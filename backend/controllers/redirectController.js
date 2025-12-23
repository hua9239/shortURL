const db = require("../db");

exports.redirectUrl = async (req, res, next) => {
    const code = req.params[0];
    console.log(`Processing redirect for code: ${code}`);

    if (code.length > 10) {
        return res.redirect('/');
    }

    try {
        const [rows] = await db.query('SELECT fullUrl FROM urls USE INDEX (idx_shortCode) WHERE shortCode = ?', [code]);

        if (rows.length > 0) {
            return res.redirect(rows[0].fullUrl);
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Database error:', error);
        next(error);
    }
};
