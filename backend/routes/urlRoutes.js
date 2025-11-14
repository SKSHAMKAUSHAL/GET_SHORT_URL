const express = require('express');
const {
  shortenUrl,
  redirectUrl,
  getUserUrls,
  getAnalytics,
  deleteUrl,
  updateUrl,
  getUrlByShortId,
  toggleStatus,
  clearCache,
} = require('../controllers/urlController');
const auth = require('../middleware/auth');
const { validateUrl, validateUpdateUrl } = require('../middleware/validate');
const logger = require('../utils/logger');

const router = express.Router();

// URL shortening
router.post('/shorten', auth, validateUrl, shortenUrl);

// User URLs management
router.get('/user/urls', auth, getUserUrls);
router.get('/user/urls/:shortId', auth, getUrlByShortId);

// Analytics
router.get('/analytics/:shortId', auth, getAnalytics);

// URL operations
router.put('/:shortId', auth, validateUpdateUrl, updateUrl);
router.put('/:shortId/toggle-status', auth, toggleStatus);
router.delete('/:shortId', auth, deleteUrl);

// Cache management
router.delete('/cache/:cacheKey', auth, clearCache);

// Redirect endpoint (handles short URL redirects)
router.get('/:shortId', redirectUrl);

// Paused URL page
router.get('/paused/:shortId', (req, res) => {
  logger.info('Rendering paused page', { shortId: req.params.shortId });
  res.status(200).json({ 
    error: 'URL is paused', 
    message: `This URL (${req.params.shortId}) is currently paused or has expired.` 
  });
});

module.exports = router;