const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { errorResponse } = require('../utils/responseHandler');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'Unauthorized: No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 'Unauthorized: Invalid token', 401);
    }
};

module.exports = authenticate;
