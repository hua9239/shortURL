const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { errorResponse, successResponse } = require('../utils/responseHandler');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return errorResponse(res, 'Username and password are required', 400);
    }

    try {
        if (username !== config.adminUser || password !== config.adminPassword) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const token = jwt.sign(
            { id: 1, username: username },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

        successResponse(res, { token }, 'Login successful');
    } catch (error) {
        console.error(error);
        errorResponse(res, 'Internal server error', 500);
    }
};
