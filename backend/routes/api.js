const express = require('express');

const router = express.Router();

const authenticate = (req, res, next) => {
    const auth = true; // Replace with real authentication logic
    if (auth) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};


router.get('/v1/create', (req, res) => {
    console.log(new Date().toISOString(), 'GET /v1/create called');
    res.json({ message: 'create endpoint triggered' });
});

router.get('/v1/login', (req, res) => {
    console.log(new Date().toISOString(), 'GET /v1/login called');
    res.json({ message: 'login endpoint triggered' });
});

router.get('/v1/urls', authenticate, (_req, res) => {
    console.log(new Date().toISOString(), 'GET /v1/urls called');
    res.json({ message: 'urls endpoint triggered' });
});

router.get('/v1/delete', authenticate, (req, res) => {
    console.log(new Date().toISOString(), 'GET /v1/delete called');
    res.json({ message: 'delete endpoint triggered' });
});

module.exports = router;