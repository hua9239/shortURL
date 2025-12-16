const express = require("express");
const router = express.Router();
const db = require("../db");

router.get(/^\/([0-9a-z]{1,10})$/, async (req, res) => {
    const code = req.params[0];
    console.log(`Redirecting code: ${code}`);
    
    try {
        const [rows] = await db.query('SELECT full_url FROM urls WHERE short_url_code = ?', [code]);
        
        if (rows.length > 0) {
            const originalUrl = rows[0].full_url;
            console.log(`Found URL: ${originalUrl}`);
            res.redirect(originalUrl);
        } else {
            console.log('URL not found');
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
