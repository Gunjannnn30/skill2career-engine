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
// Parse comma separated client URLs, helping support multiple environments
const allowedOrigins = process.env.CLIENT_URL 
    ? process.env.CLIENT_URL.split(',') 
    : ['http://localhost:3000'];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            // Give a specific error when blocked to prevent obscure "Failed to fetch"
            callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
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
