const express = require("express");
const router = express.Router();

router.get(/^\/([0-9a-z]{8})$/, (req, res) => {
    const code = req.params[0];
    console.log(`Redirecting code: ${code}`);
    // TODO secarch the code in mySQL and get the original URL
    res.redirect("https://www.google.com");
});

module.exports = router;
