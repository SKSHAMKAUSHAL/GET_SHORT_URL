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

router.post('/shorten', auth, validateUrl, shortenUrl);
router.get('/:shortId', redirectUrl);
router.get('/paused/:shortId', (req, res) => {
  logger.info('Rendering paused page', { shortId: req.params.shortId });
  res.status(200).send(`This URL (${req.params.shortId}) is currently paused or has expired.`);
});
router.get('/user/urls', auth, getUserUrls);
router.get('/user/urls/:shortId', auth, getUrlByShortId);
router.get('/analytics/:shortId', auth, getAnalytics);
router.delete('/:shortId', auth, deleteUrl);
router.put('/:shortId', auth, validateUpdateUrl, updateUrl);
router.put('/:shortId/toggle-status', auth, toggleStatus);
router.delete('/cache/:cacheKey', auth, clearCache);

module.exports = router;