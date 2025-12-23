const express = require("express");
const router = express.Router();
const redirectController = require('../controllers/redirectController');

router.get(/^\/([A-Za-z0-9]+)$/, redirectController.redirectUrl);

module.exports = router;
