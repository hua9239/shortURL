const express = require("express");
const router = express.Router();
const db = require("../db");

router.get(/^\/([A-Za-z0-9]+)$/, async (req, res, next) => {
    const code = req.params[0];
    console.log(`Processing redirect for code: ${code}`);

    if (code.length > 10) {
        // return res.status(400).send('Invalid short URL code');
        return res.redirect('/');
    }

    try {
        const [rows] = await db.query('SELECT fullUrl FROM urls USE INDEX (idx_shortCode) WHERE shortCode = ?', [code]);

        if (rows.length > 0) {
            return res.redirect(rows[0].fullUrl);
        } else {
            // return res.status(404).send('Short URL not found');
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Database error:', error);
        next(error);
    }
});

module.exports = router;
