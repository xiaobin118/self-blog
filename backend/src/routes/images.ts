import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import type { ApiResponse } from '../types/api.js';

const router = Router();

const IMAGE_DIR = path.resolve(process.cwd(), '../public/image/gallery');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);

router.get('/', async (_req, res) => {
  try {
    const files = await fs.readdir(IMAGE_DIR);
    const images = files
      .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .slice(0, 9)
      .map(f => encodeURI(`/image/gallery/${f}`));

    const response: ApiResponse<string[]> = { success: true, data: images };
    res.json(response);
  } catch {
    const response: ApiResponse = { success: false, error: 'Failed to read images' };
    res.status(500).json(response);
  }
});

export default router;
