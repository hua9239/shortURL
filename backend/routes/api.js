const express = require('express');
const db = require("../db");
const { body, validationResult } = require('express-validator');

const router = express.Router();

const authenticate = (req, res, next) => {
    const auth = true; // Replace with real authentication logic
    if (auth) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};


router.post('/v1/create', [
    body('fullUrl').isURL().isLength({ max: 2048 }),
    body('shortCode').optional({ values: 'falsy' }).isAlphanumeric().isLength({ max: 10 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
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
            return res.status(400).json({ message: 'Self-redirection is not allowed' });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid URL' });
    }

    if (shortCode && isBlocked(shortCode)) {
        return res.status(400).json({ message: 'Custom code is not allowed' });
    }

    try {
        if (shortCode) {
            const [rows] = await db.query('SELECT id FROM urls WHERE shortCode = ?', [shortCode]);
            if (rows.length > 0) {
                return res.status(400).json({ message: 'Custom code already exists' });
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
                return res.status(500).json({ message: 'Failed to generate unique code, please try again' });
            }
        }

        await db.query('INSERT INTO urls (shortCode, fullUrl) VALUES (?, ?)', [shortCode, fullUrl]);

        res.json({ message: 'success', data: { fullUrl, shortCode } });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/v1/urls', authenticate, async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM urls ORDER BY id ASC');
        res.json({ message: 'success', data: rows });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/v1/delete', authenticate, async (req, res) => {
    const { shortCode } = req.body;
    if (!shortCode) {
        return res.status(400).json({ message: 'shortCode is required' });
    }
    try {
        const [result] = await db.query('DELETE FROM urls WHERE shortCode = ?', [shortCode]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'shortCode not found' });
        }
        res.json({ message: 'success' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// router.get('/v1/login', (req, res) => {
//     res.json({ message: 'login endpoint triggered' });
// });

router.all(/.*/, (req, res) => {
    res.status(404).json({
        message: `Cannot ${req.method} ${req.originalUrl}`,
        hint: 'what are you looking for?'
    });
});

module.exports = router;