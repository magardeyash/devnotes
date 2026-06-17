require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const aiRoutes = require('./routes/ai');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// CORS
// Allow localhost dev origins + any *.netlify.app deploy + explicit CLIENT_URL
// ---------------------------------------------------------------------------
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
    : []),
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile, server-to-server)
    if (!origin) return callback(null, true);
    // Allow any Netlify deployment URL (covers preview & branch deploys)
    if (origin.endsWith('.netlify.app')) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    callback(
      new Error(
        `CORS: origin "${origin}" is not allowed. Add it to CLIENT_URL env var.`
      ),
      false
    );
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware (handles both pre-flight OPTIONS and actual requests)
app.use(cors(corsOptions));

// Explicitly handle pre-flight OPTIONS for all routes
app.options('*', cors(corsOptions));

// ---------------------------------------------------------------------------
// Body parsing middleware  (must come BEFORE route handlers)
// ---------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/notes', protect, notesRoutes);
app.use('/api/ai', protect, aiRoutes);

// Health check – Render & UptimeRobot ping this to keep the service warm
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Global 404 handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

// ---------------------------------------------------------------------------
// Database connection & server start
// ---------------------------------------------------------------------------
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devnotes';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
