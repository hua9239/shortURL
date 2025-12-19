const express = require('express');
const db = require("../db");
const { body, validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const router = express.Router();

const authenticate = (req, res, next) => {
    const auth = true; // Replace with real authentication logic
    if (auth) {
        next();
    } else {
        errorResponse(res, 'Unauthorized', 401);
    }
};


router.post('/v1/create', [
    body('fullUrl').isURL().isLength({ max: 2048 }),
    body('shortCode').optional({ values: 'falsy' }).isAlphanumeric().isLength({ max: 10 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const blockList = ['api', 'login'];
    const isBlocked = (code) => blockList.includes(code.toLowerCase());

    let { fullUrl, shortCode } = req.body || {};

    if (!/^https?:\/\//i.test(fullUrl)) {
        fullUrl = 'http://' + fullUrl;
    }

    try {
        const urlObj = new URL(fullUrl);
        const blockedDomains = ['127.0.0.1', 'localhost', 'domain.com']; // FIXME: add your own domain
        if (blockedDomains.includes(urlObj.hostname)) {
            return errorResponse(res, 'Self-redirection is not allowed', 400);
        }
    } catch (error) {
        return errorResponse(res, 'Invalid URL', 400);
    }

    if (shortCode && isBlocked(shortCode)) {
        return errorResponse(res, 'Custom code is not allowed', 400);
    }

    try {
        if (shortCode) {
            const [rows] = await db.query('SELECT id FROM urls WHERE shortCode = ?', [shortCode]);
            if (rows.length > 0) {
                return errorResponse(res, 'Custom code already exists', 400);
            }
        } else {
            const generateCode = () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                for (let i = 0; i < 6; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            };

            let isAvailable = false;
            let attempts = 0;

            while (!isAvailable && attempts < 5) {
                shortCode = generateCode();

                if (isBlocked(shortCode)) {
                    attempts++;
                    continue;
                }

                const [rows] = await db.query('SELECT id FROM urls WHERE shortCode = ?', [shortCode]);
                if (rows.length === 0) {
                    isAvailable = true;
                }
                attempts++;
            }

            if (!isAvailable) {
                return errorResponse(res, 'Failed to generate unique code, please try again', 500);
            }
        }

        await db.query('INSERT INTO urls (shortCode, fullUrl) VALUES (?, ?)', [shortCode, fullUrl]);

        successResponse(res, { fullUrl, shortCode }, 'Short URL created successfully');
    } catch (error) {
        console.error('Database error:', error);
        errorResponse(res, 'Internal server error', 500);
    }
});

router.get('/v1/urls', authenticate, async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM urls ORDER BY id ASC');
        successResponse(res, rows);
    } catch (error) {
        console.error('Database error:', error);
        errorResponse(res, 'Internal server error', 500);
    }
});

router.post('/v1/delete', authenticate, async (req, res) => {
    const { shortCode } = req.body;
    if (!shortCode) {
        return errorResponse(res, 'shortCode is required', 400);
    }
    try {
        const [result] = await db.query('DELETE FROM urls WHERE shortCode = ?', [shortCode]);
        if (result.affectedRows === 0) {
            return errorResponse(res, 'shortCode not found', 404);
        }
        successResponse(res, null, 'Deleted successfully');
    } catch (error) {
        console.error('Database error:', error);
        errorResponse(res, 'Internal server error', 500);
    }
});

// router.get('/v1/login', (req, res) => {
//     res.json({ message: 'login endpoint triggered' });
// });

router.all(/.*/, (req, res) => {
    errorResponse(res, `Cannot ${req.method} ${req.originalUrl}`, 404, { hint: 'what are you looking for?' });
});

module.exports = router;