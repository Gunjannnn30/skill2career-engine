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
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000'];
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or check if origin is explicitly allowed
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Check gracefully for potential subdomain variants later if needed
            callback(null, false); // Block other domains implicitly
        }
    },
    credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Server running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    try {
        await connectDB();
    } catch(e) {
        console.warn('MongoDB connection failed (is MongoDB running?). Server is still up to serve other routes.');
    }
});
