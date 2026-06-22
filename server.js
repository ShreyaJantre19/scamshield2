import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './app/config/db.js';
import scamRoutes from './app/routes/scamRoutes.js';
import authRoutes from './app/routes/authRoutes.js';
import { errorHandler } from './app/middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true }));

// Request Logger (morgan)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ScamShield Backend API is running smoothly.',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Register Routes
app.use('/api/scams', scamRoutes);
app.use('/api/auth', authRoutes);

// Catch-all route for unregistered endpoints (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`[Server] ScamShield backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Fatal Error] Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
