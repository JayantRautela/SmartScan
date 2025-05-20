import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
        message: {
            message: 'Too many requests from this IP, please try again later.',
            success: false,
        },
        standardHeaders: true, 
        legacyHeaders: false, 
});