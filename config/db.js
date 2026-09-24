const mongoose = require('mongoose');

// Disable buffering so queries fail immediately or gracefully fall back
// rather than hanging for 10,000ms with cryptic buffering errors.
mongoose.set('bufferCommands', false);

let isConnecting = false;
let retryTimer = null;

const isDbConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        console.warn('\n[MongoDB Warning] Neither MONGO_URI nor MONGODB_URI is defined in environment variables.');
        console.warn('[MongoDB Warning] The application will operate with an in-memory session store for authentication and career profiles.');
        console.warn('[MongoDB Warning] To persist data permanently, add MONGO_URI to your environment variables.\n');
        return false;
    }

    if (isDbConnected()) {
        return true;
    }

    if (isConnecting) {
        return false;
    }

    try {
        isConnecting = true;
        console.log('[MongoDB] Attempting to connect to MongoDB...');

        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });

        console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
        if (retryTimer) {
            clearTimeout(retryTimer);
            retryTimer = null;
        }
        return true;
    } catch (error) {
        console.error(`[MongoDB Connection Error] ${error.message}`);
        console.warn('[MongoDB Warning] Operating in resilient fallback mode until database is reachable.');

        // Schedule background retry if not already scheduled
        if (!retryTimer) {
            retryTimer = setTimeout(() => {
                retryTimer = null;
                console.log('[MongoDB] Retrying database connection in background...');
                connectDB().catch(() => {});
            }, 10000);
        }
        return false;
    } finally {
        isConnecting = false;
    }
};

// Listen for Mongoose connection events
mongoose.connection.on('connected', () => {
    console.log('[MongoDB Event] Mongoose connected.');
});

mongoose.connection.on('error', (err) => {
    console.error('[MongoDB Event] Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB Event] Mongoose disconnected.');
    if (!retryTimer) {
        retryTimer = setTimeout(() => {
            retryTimer = null;
            connectDB().catch(() => {});
        }, 5000);
    }
});

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
