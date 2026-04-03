const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
// connectDB(); // Uncomment if you have a local MongoDB running

const app = express();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://skill2career-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log("API HIT:", req.method, req.originalUrl);
    next();
});

// Routes
let authRoutes;
try {
    authRoutes = require('./routes/authRoutes');
    console.log("AUTH ROUTES LOADED");
} catch (err) {
    console.error("AUTH ROUTES FAILED:", err);
}
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server running' });
});

// 404 Catch-All to prevent HTML responses
app.use('*', (req, res) => {
    res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

// Global Error Handler to ensure JSON responses on errors
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    try {
        await connectDB();
    } catch (e) {
        console.warn('MongoDB connection failed (is MongoDB running?). Server is still up to serve other routes.');
    }
});
