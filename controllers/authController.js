const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        console.warn('[Auth Warning] JWT_SECRET is not defined in environment variables. Using fallback secret.');
        return 'skill2career_jwt_default_secret_key_2026';
    }
    return process.env.JWT_SECRET;
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id: id.toString() }, getJwtSecret(), {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "All fields are required",
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                error: "Please enter a valid email address",
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 6 characters long",
                message: "Password must be at least 6 characters long"
            });
        }

        const userExists = await userService.findUserByEmail(normalizedEmail);

        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'User already exists',
                message: 'An account with this email already exists. Please log in.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userService.createUser({
            name: trimmedName,
            email: normalizedEmail,
            password: hashedPassword
        });

        if (user) {
            const userId = user._id ? user._id.toString() : user.id;
            return res.status(201).json({
                success: true,
                _id: userId,
                id: userId,
                name: user.name,
                email: user.email,
                token: generateToken(userId)
            });
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid user data',
                message: 'Failed to create user account'
            });
        }
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Registration failed",
            error: error.message || "Registration failed"
        });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password',
                message: 'Please provide email and password'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await userService.findUserByEmail(normalizedEmail);

        if (user && (await bcrypt.compare(password, user.password))) {
            const userId = user._id ? user._id.toString() : user.id;
            return res.json({
                success: true,
                _id: userId,
                id: userId,
                name: user.name,
                email: user.email,
                token: generateToken(userId)
            });
        } else {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
            message: error.message || 'Login failed'
        });
    }
};

module.exports = {
    register,
    login
};
