import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
  ADMIN_GITHUB_IDS: z.string().min(1, 'ADMIN_GITHUB_IDS is required'),
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GITHUB_CALLBACK_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

const data = parsed.data;
const frontendUrl = data.FRONTEND_URL;

export const env = {
  DATABASE_URL: data.DATABASE_URL,
  JWT_SECRET: data.JWT_SECRET,
  GITHUB_CLIENT_ID: data.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: data.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: data.GITHUB_CALLBACK_URL || `${frontendUrl}/api/auth/github/callback`,
  FRONTEND_URL: frontendUrl,
  ADMIN_GITHUB_IDS: data.ADMIN_GITHUB_IDS.split(',').map(id => id.trim()),
  PORT: parseInt(data.PORT, 10),
  NODE_ENV: data.NODE_ENV,
};
