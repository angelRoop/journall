import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { PORT, MONGO_URI, ALLOWED_ORIGINS, UPLOAD_DIR } from './config.js';
import authRoutes from './routes/auth.js';
import tradesRoutes from './routes/trades.js';
import tagsRoutes from './routes/tags.js';
import templatesRoutes from './routes/templates.js';

const app = express();

const origin = (req, callback) => {
  const allowed = ALLOWED_ORIGINS;
  const requestOrigin = req.header('Origin');
  if (!requestOrigin || allowed.includes(requestOrigin)) {
    return callback(null, true);
  }
  callback(new Error('CORS blocked by server')); 
};

app.use(cors({ origin }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/templates', templatesRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });
