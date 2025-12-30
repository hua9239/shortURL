const db = require("../db");

exports.redirectUrl = async (req, res, next) => {
    const code = req.params[0];
    
    if (!code || code.length > 10) {
        return res.redirect('/');
    }

    try {
        const [rows] = await db.query('SELECT fullUrl FROM urls WHERE shortCode = ?', [code]);

        if (rows.length > 0) {
            return res.redirect(rows[0].fullUrl);
        }
        
        return res.redirect('/');
    } catch (error) {
        console.error('Database error:', error);
        // In case of error, redirect to home page is a safe fallback for users
        return res.redirect('/');
    }
};
