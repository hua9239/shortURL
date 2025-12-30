const db = require("../db");
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const config = require('../config/config');
const { generateCode, isBlocked } = require('../utils/codeGenerator');

exports.createUrl = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    let { fullUrl, shortCode } = req.body || {};

    // Normalize URL
    if (!/^https?:\/\//i.test(fullUrl)) {
        fullUrl = 'http://' + fullUrl;
    }

    // Validate URL domain
    try {
        const urlObj = new URL(fullUrl);
        if (config.blockedDomains.includes(urlObj.hostname)) {
            return errorResponse(res, 'Self-redirection is not allowed', 400);
        }
    } catch (error) {
        return errorResponse(res, 'Invalid URL', 400);
    }

    // Validate custom shortCode
    if (shortCode && isBlocked(shortCode)) {
        return errorResponse(res, 'Custom code is not allowed', 400);
    }

    try {
        if (shortCode) {
            // Check if custom code exists
            const [rows] = await db.query('SELECT id FROM urls WHERE shortCode = ?', [shortCode]);
            if (rows.length > 0) {
                return errorResponse(res, 'Custom code already exists', 400);
            }
        } else {
            // Generate unique code
            let isAvailable = false;
            let attempts = 0;
            const maxAttempts = 5;

            while (!isAvailable && attempts < maxAttempts) {
                const code = generateCode();

                if (isBlocked(code)) {
                    attempts++;
                    continue;
                }

                const [rows] = await db.query('SELECT id FROM urls WHERE shortCode = ?', [code]);
                if (rows.length === 0) {
                    shortCode = code;
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
};

exports.getUrls = async (_req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM urls ORDER BY id ASC');
        successResponse(res, rows);
    } catch (error) {
        console.error('Database error:', error);
        errorResponse(res, 'Internal server error', 500);
    }
};

exports.deleteUrl = async (req, res) => {
    const { shortCode } = req.params;
    
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
};
