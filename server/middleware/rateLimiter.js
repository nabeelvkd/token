// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { message },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Different rate limits for different endpoints
const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many authentication attempts, please try again later'
);

const generalLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests
    'Too many requests, please try again later'
);

const uploadLimiter = createRateLimiter(
    60 * 60 * 1000, // 1 hour
    10, // 10 uploads
    'Too many upload attempts, please try again later'
);

module.exports = {
    authLimiter,
    generalLimiter,
    uploadLimiter
};