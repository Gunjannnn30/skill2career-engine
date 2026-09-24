const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { isDbConnected } = require('./config/db');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // Fallback for standard .env location

const app = express();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[API HIT] ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

// Diagnostic test endpoint (supports both GET and POST)
app.all('/api/test', (req, res) => {
    res.json({ 
        success: true,
        dbStatus: isDbConnected() ? "connected" : "in-memory-fallback",
        hasMongoUri: !!(process.env.MONGO_URI || process.env.MONGODB_URI),
        hasAiKey: !!process.env.AI_API_KEY,
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        hasJwtSecret: !!process.env.JWT_SECRET,
        envCount: Object.keys(process.env).length,
        nodeEnv: process.env.NODE_ENV || 'development'
    });
});

// Health check endpoint for Render/hosting monitors
app.get(['/api/health', '/health'], (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        database: isDbConnected() ? 'connected' : 'in-memory-fallback',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server running',
        database: isDbConnected() ? 'connected' : 'in-memory-fallback',
        version: '1.0.0'
    });
});

// 404 Catch-All to prevent HTML responses
app.use('*', (req, res) => {
    res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

// Global Error Handler to ensure JSON responses on errors
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    try {
        await connectDB();
    } catch (e) {
        console.warn('[Server Warning] MongoDB connection failed. Server is operating with in-memory store fallback.');
    }
});
