import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import { env } from '../config/env.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { prisma } from '../lib/prisma.js';
import type { ApiResponse } from '../types/api.js';
import type { JwtPayload } from '../types/jwt.js';

const router = Router();

// GET /api/auth/github – Redirect to GitHub OAuth
router.get('/github', authLimiter, (req, res, next) => {
  // Capture frontend origin for post-OAuth redirect
  const origin = (req.query.origin as string) || (req.headers.referer ? new URL(req.headers.referer).origin : '');
  if (origin && req.session) {
    (req.session as unknown as Record<string, unknown>).frontendOrigin = origin;
  }
  passport.authenticate('github', { scope: ['user:email'], session: false })(req, res, next);
});

// GET /api/auth/github/callback – Handle OAuth callback
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/auth?error=github' }),
  (req, res) => {
    const { userId, role } = req.user as JwtPayload;
    const token = jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '7d' });
    const origin = (req.session as unknown as Record<string, unknown>)?.frontendOrigin as string || env.FRONTEND_URL;
    res.redirect(`${origin}/auth/callback?token=${token}`);
  },
);

// GET /api/auth/me – Get current user info
router.get(
  '/me',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const { userId } = req.user as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, avatarUrl: true, email: true, role: true },
    });

    if (!user) {
      const response: ApiResponse = { success: false, error: 'User not found' };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof user> = { success: true, data: user };
    res.json(response);
  }),
);

export default router;
