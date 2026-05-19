import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import type { Profile } from 'passport-github2';
import { prisma } from '../lib/prisma.js';
import { env } from './env.js';

passport.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: env.GITHUB_CALLBACK_URL,
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done: (err: Error | null, user?: Express.User) => void) => {
      try {
        const githubId = String(profile.id);
        const isAdmin = env.ADMIN_GITHUB_IDS.includes(githubId);

        const user = await prisma.user.upsert({
          where: { githubId },
          update: {
            username: profile.username ?? profile.displayName ?? 'unknown',
            avatarUrl: profile.photos?.[0]?.value ?? '',
            email: profile.emails?.[0]?.value ?? null,
            role: isAdmin ? 'ADMIN' : 'USER',
          },
          create: {
            githubId,
            username: profile.username ?? profile.displayName ?? 'unknown',
            avatarUrl: profile.photos?.[0]?.value ?? '',
            email: profile.emails?.[0]?.value ?? null,
            role: isAdmin ? 'ADMIN' : 'USER',
          },
        });

        done(null, { userId: user.id, role: user.role });
      } catch (err) {
        done(err as Error);
      }
    },
  ),
);

export default passport;
