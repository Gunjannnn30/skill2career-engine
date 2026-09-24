const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'skill2career_jwt_default_secret_key_2026';
};

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, getJwtSecret());
            
            const user = await userService.findUserById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'User does not exist',
                    message: 'User account not found'
                });
            }
            
            req.user = user;
            return next();
        } catch (error) {
            console.error('Auth Middleware error:', error.message);
            return res.status(401).json({
                success: false,
                error: 'Not authorized, token failed',
                message: 'Invalid or expired session token. Please log in again.'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized, no token',
            message: 'No authorization token provided'
        });
    }
};

module.exports = { protect };
