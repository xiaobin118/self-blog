import dotenv from 'dotenv';

dotenv.config();

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;
  FRONTEND_URL: string;
  ADMIN_GITHUB_IDS: string[];
  PORT: number;
  NODE_ENV: string;
}

function getEnv(): Env {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'GITHUB_CALLBACK_URL',
    'FRONTEND_URL',
    'ADMIN_GITHUB_IDS',
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  const frontendUrl = process.env.FRONTEND_URL!;

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || `${frontendUrl}/api/auth/github/callback`,
    FRONTEND_URL: frontendUrl,
    ADMIN_GITHUB_IDS: process.env.ADMIN_GITHUB_IDS!.split(',').map(id => id.trim()),
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}

export const env = getEnv();
