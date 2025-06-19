import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Log environment variables status (for debugging)
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET'
});

// Get the directory name (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'http://localhost:3005', 'http://127.0.0.1:54986'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create data and output directories if they don't exist
import fs from 'fs';
const dataDir = path.join(__dirname, 'data');
const outputDir = path.join(__dirname, process.env.PDF_OUTPUT_DIR || 'output');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('Created output directory');
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Report Writer API' });
});

// Health check endpoint - both with and without /api prefix for DigitalOcean routing
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT
  });
});
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

// Debug endpoint to check data files
app.get('/debug/data-files', async (req, res) => {
  const dataFiles = {
    'Card_Births.csv': fs.existsSync(path.join(dataDir, 'Card_Births.csv')),
    'spreads.json': fs.existsSync(path.join(dataDir, 'spreads.json')),
    'cards.json': fs.existsSync(path.join(dataDir, 'cards.json')),
    'database.json': fs.existsSync(path.join(dataDir, 'database.json')),
    dataDir: dataDir,
    __dirname: __dirname,
    cwd: process.cwd()
  };
  res.json(dataFiles);
});
app.get('/api/debug/data-files', async (req, res) => {
  const dataFiles = {
    'Card_Births.csv': fs.existsSync(path.join(dataDir, 'Card_Births.csv')),
    'spreads.json': fs.existsSync(path.join(dataDir, 'spreads.json')),
    'cards.json': fs.existsSync(path.join(dataDir, 'cards.json')),
    'database.json': fs.existsSync(path.join(dataDir, 'database.json')),
    dataDir: dataDir,
    __dirname: __dirname,
    cwd: process.cwd()
  };
  res.json(dataFiles);
});

// API Routes
import authRoutes from './routes/authRoutes.js';
import peopleRoutes from './routes/peopleRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/test.js';

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.get('origin')}`);
  next();
});

// Mount routes with /api prefix for local development
app.use('/api/auth', authRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/test', testRoutes);

// Also mount routes without /api prefix for DigitalOcean deployment
// (DigitalOcean strips the /api prefix when routing)
app.use('/auth', authRoutes);
app.use('/people', peopleRoutes);
app.use('/reports', reportRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/test', testRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
