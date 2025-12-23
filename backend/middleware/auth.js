const { errorResponse } = require('../utils/responseHandler');

const authenticate = (req, res, next) => {
    const auth = true; // Replace with real authentication logic
    if (auth) {
        next();
    } else {
        errorResponse(res, 'Unauthorized', 401);
    }
};

module.exports = authenticate;
