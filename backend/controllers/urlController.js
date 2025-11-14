const shortid = require('shortid');
const validator = require('validator');
const Url = require('../models/urlModel');
const UAParser = require('ua-parser-js');
const client = require('../config/redis');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const axios = require('axios');

async function verifyRecaptcha(token) {
  logger.info('Starting reCAPTCHA v2 verification', { token: token ? 'provided' : 'missing' });
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: token,
        },
      }
    );
    logger.info('reCAPTCHA v2 response', {
      success: response.data.success,
      errorCodes: response.data['error-codes'],
    });
    return response.data.success;
  } catch (err) {
    logger.error('reCAPTCHA v2 verification failed', { error: err.message });
    return false;
  }
}

exports.shortenUrl = async (req, res) => {
  logger.info('Received shorten URL request', { body: req.body });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }
  const { originalUrl, recaptchaToken } = req.body;
  logger.info('Processing URL', { originalUrl, recaptchaToken: recaptchaToken ? 'provided' : 'missing' });

  if (recaptchaToken !== 'session-verified') {
    if (!recaptchaToken) {
      logger.warn('Missing reCAPTCHA token');
      return res.status(400).json({ error: 'reCAPTCHA token missing' });
    }
    if (!(await verifyRecaptcha(recaptchaToken))) {
      logger.warn('reCAPTCHA verification failed');
      return res.status(400).json({ error: 'reCAPTCHA verification failed' });
    }
  }

  if (!validator.isURL(originalUrl, { protocols: ['http', 'https'], require_protocol: true })) {
    logger.warn('Invalid URL provided', { originalUrl });
    return res.status(400).json({ error: 'Invalid URL' });
  }
  try {
    const shortId = shortid.generate();
    const newUrl = new Url({ originalUrl, shortId, userId: req.user.id, active: true });
    await newUrl.save();
    logger.info('URL shortened successfully', { shortId, originalUrl });
    res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortId}` });
  } catch (err) {
    logger.error('Error shortening URL', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectUrl = async (req, res) => {
  const { shortId } = req.params;
  const cacheKey = `url:${shortId}`;
  logger.info('Processing redirect request', { shortId, headers: req.headers });

  try {
    // Check Redis cache
    const cachedUrl = await client.get(cacheKey);
    logger.debug('Checking cache', { shortId, cacheExists: !!cachedUrl });

    let url;
    if (cachedUrl) {
      url = JSON.parse(cachedUrl);
      logger.debug('Cache hit', { shortId, cachedData: url });
    } else {
      logger.info('Querying database for URL', { shortId });
      url = await Url.findOne({ shortId });
      if (!url) {
        logger.warn('URL not found in database', { shortId });
        return res.status(404).json({ error: 'URL not found' });
      }
      logger.debug('Database URL data', { shortId, originalUrl: url.originalUrl, active: url.active });
      await client.set(cacheKey, JSON.stringify(url.toObject()), { EX: 3600 });
      logger.info('URL cached', { shortId, cacheKey, originalUrl: url.originalUrl });
    }

    if (!url.active) {
      logger.warn('URL is inactive', { shortId });
      await client.del(cacheKey);
      logger.info('Cache cleared due to inactive URL', { cacheKey });
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      logger.info('Redirecting to paused page', { shortId });
      return res.redirect(302, `/paused/${shortId}`);
    }

    const parser = new UAParser(req.headers['user-agent']);
    const { device, browser } = parser.getResult();
    url.clicks.push({
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      device: device.type || 'unknown',
      browser: browser.name || 'unknown',
    });
    await Url.findOneAndUpdate({ shortId }, { $push: { clicks: url.clicks[url.clicks.length - 1] } });
    logger.debug('URL saved with new click', { shortId, newClick: url.clicks[url.clicks.length - 1] });

    logger.info('Redirecting to original URL', { shortId, originalUrl: url.originalUrl });
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res.redirect(301, url.originalUrl);
  } catch (err) {
    logger.error('Error redirecting URL', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserUrls = async (req, res) => {
  logger.info('Fetching user URLs', { userId: req.user.id });
  try {
    const urls = await Url.find({ userId: req.user.id });
    logger.info('User URLs fetched', { userId: req.user.id, count: urls.length });
    res.json(urls);
  } catch (err) {
    logger.error('Error fetching user URLs', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUrlByShortId = async (req, res) => {
  const { shortId } = req.params;
  logger.info('Fetching URL by shortId', { shortId, userId: req.user.id });
  try {
    const url = await Url.findOne({ shortId, userId: req.user.id });
    if (!url) {
      logger.warn('URL not found', { shortId, userId: req.user.id });
      return res.status(404).json({ error: 'URL not found' });
    }
    logger.info('URL fetched', { shortId, originalUrl: url.originalUrl, active: url.active });
    res.json(url);
  } catch (err) {
    logger.error('Error fetching URL', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  const { shortId } = req.params;
  logger.info('Fetching analytics', { shortId, userId: req.user.id });
  try {
    const url = await Url.findOne({ shortId, userId: req.user.id });
    if (!url) {
      logger.warn('Analytics URL not found', { shortId, userId: req.user.id });
      return res.status(404).json({ error: 'URL not found' });
    }
    logger.info('Analytics fetched', { shortId, clickCount: url.clicks.length });
    res.json(url.clicks);
  } catch (err) {
    logger.error('Error fetching analytics', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUrl = async (req, res) => {
  const { shortId } = req.params;
  logger.info('Deleting URL', { shortId, userId: req.user.id });
  try {
    const url = await Url.findOne({ shortId, userId: req.user.id });
    if (!url) {
      logger.warn('URL not found for deletion', { shortId, userId: req.user.id });
      return res.status(404).json({ error: 'URL not found' });
    }
    await Url.deleteOne({ _id: url._id });
    const cacheKey = `url:${shortId}`;
    await client.del(cacheKey);
    logger.info('URL deleted and cache cleared', { shortId, cacheKey });
    res.json({ message: 'Deleted' });
  } catch (err) {
    logger.error('Error deleting URL', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUrl = async (req, res) => {
  const { shortId } = req.params;
  const { originalUrl } = req.body;
  logger.info('Updating URL', { shortId, originalUrl, userId: req.user.id });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors on update', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }
  if (!validator.isURL(originalUrl, { protocols: ['http', 'https'], require_protocol: true })) {
    logger.warn('Invalid URL on update', { originalUrl });
    return res.status(400).json({ error: 'Invalid URL' });
  }
  try {
    const url = await Url.findOneAndUpdate(
      { shortId, userId: req.user.id },
      { originalUrl },
      { new: true }
    );
    if (!url) {
      logger.warn('URL not found for update', { shortId, userId: req.user.id });
      return res.status(404).json({ error: 'URL not found' });
    }
    const cacheKey = `url:${shortId}`;
    await client.del(cacheKey);
    logger.info('URL updated and cache cleared', { shortId, originalUrl, cacheKey });
    res.json(url);
  } catch (err) {
    logger.error('Error updating URL', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.toggleStatus = async (req, res) => {
  const { shortId } = req.params;
  const { active } = req.body;
  logger.info('Toggling URL status', { shortId, active, userId: req.user.id });
  try {
    const url = await Url.findOne({ shortId, userId: req.user.id });
    if (!url) {
      logger.warn('URL not found for status toggle', { shortId, userId: req.user.id });
      return res.status(404).json({ error: 'URL not found' });
    }
    logger.debug('Current URL state', { shortId, currentActive: url.active });
    const newActive = active === 'toggle' ? !url.active : active;
    logger.debug('Setting new active status', { shortId, newActive });
    const updatedUrl = await Url.findOneAndUpdate(
      { shortId, userId: req.user.id },
      { active: newActive },
      { new: true }
    );
    const cacheKey = `url:${shortId}`;
    await client.del(cacheKey);
    logger.info('URL status updated and cache cleared', { shortId, newActive, cacheKey });
    res.json(updatedUrl);
  } catch (err) {
    logger.error('Error toggling URL status', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.clearCache = async (req, res) => {
  const { cacheKey } = req.params;
  logger.info('Clearing cache', { cacheKey });
  try {
    const result = await client.del(cacheKey);
    logger.info('Cache cleared', { cacheKey, result });
    res.json({ message: 'Cache cleared' });
  } catch (err) {
    logger.error('Error clearing cache', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
};