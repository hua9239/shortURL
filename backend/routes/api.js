const express = require('express');
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
    // isURL -> valid URL so len must > 0
    // isLength -> max length
    body('fullUrl').isURL().isLength({ max: 2048 }),

    // optional({values: 'falsy'}) -> can be "", null, undefined
    // isAlphanumeric -> [A-Za-z0-9]
    // isLength -> lan <= 10
    body('customCode').optional({ values: 'falsy' }).isAlphanumeric().isLength({ max: 10 })
], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { fullUrl, customCode } = req.body || {};
    console.log(new Date().toISOString(), 'POST /v1/create called with:', { fullUrl, customCode });

    res.json({ message: 'success', data: { fullUrl, customCode } });
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

router.all(/.*/, (req, res) => {
    res.status(404).json({
        message: `Cannot ${req.method} ${req.originalUrl}`,
        hint: 'what are you looking for?'
    });
});

module.exports = router;