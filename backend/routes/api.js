const express = require('express');
const { body } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');
const urlController = require('../controllers/urlController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.post('/v1/create', [
    body('fullUrl').isURL().isLength({ max: 2048 }),
    body('shortCode').optional({ values: 'falsy' }).isAlphanumeric().isLength({ max: 10 })
], urlController.createUrl);

router.get('/v1/urls', authenticate, urlController.getUrls);

router.post('/v1/delete', authenticate, urlController.deleteUrl);

router.all(/.*/, (req, res) => {
    errorResponse(res, `Cannot ${req.method} ${req.originalUrl}`, 404, { hint: 'what are you looking for?' });
});

module.exports = router;