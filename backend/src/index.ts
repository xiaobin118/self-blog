import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import tagRoutes from './routes/tags.js';
import commentRoutes from './routes/comments.js';
import imageRoutes from './routes/images.js';
import sitemapRoutes from './routes/sitemap.js';
import type { ApiResponse } from './types/api.js';

const app = express();

// Compression — skip already-compressed formats (images, fonts)
app.use(compression({
  filter: (req, res) => {
    if (req.path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf|eot)$/i)) {
      return false;
    }
    return compression.filter(req, res);
  },
}));

// Global middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://avatars.githubusercontent.com"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(cors({
  origin: [env.FRONTEND_URL, `http://localhost:${env.PORT}`].filter(Boolean),
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// General rate limiter on all /api routes
app.use('/api', generalLimiter);

// Block direct access to database files
app.use((req, res, next) => {
  if (req.path.endsWith('.db')) {
    res.status(403).json({ success: false, error: 'Forbidden' });
    return;
  }
  next();
});

// Health check
const startTime = Date.now();
app.get('/health', async (_req, res) => {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'disconnected';
  }

  const response: ApiResponse<{ status: string; db: string; uptime: number; timestamp: string }> = {
    success: true,
    data: {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      db: dbStatus,
      uptime: Math.round((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
    },
  };
  res.json(response);
});

// Static files (serve public/images)
app.use('/image', express.static(path.resolve(process.cwd(), '../public/image')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/images', imageRoutes);
app.use('/sitemap.xml', sitemapRoutes);

// Serve frontend SPA in production
const frontendDist = path.resolve(process.cwd(), '../dist');
app.use(express.static(frontendDist));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});
