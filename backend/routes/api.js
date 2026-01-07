const express = require('express');
const { body } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');
const urlController = require('../controllers/urlController');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.post('/v1/login', authController.login);

router.post('/v1/urls', [
    body('fullUrl').isURL().isLength({ max: 2048 }),
    body('shortCode').optional({ values: 'falsy' }).isAlphanumeric().isLength({ max: 10 })
], urlController.createUrl);

router.put('/v1/urls/:id', [
    authenticate,
    body('fullUrl').optional().isURL().isLength({ max: 2048 }),
    body('shortCode').optional().isAlphanumeric().isLength({ max: 10 })
], urlController.updateUrl);

router.get('/v1/urls', authenticate, urlController.getUrls);

router.delete('/v1/urls/:shortCode', authenticate, urlController.deleteUrl);

router.all(/.*/, (req, res) => {
    errorResponse(res, `Cannot ${req.method} ${req.originalUrl}`, 404);
});

module.exports = router;