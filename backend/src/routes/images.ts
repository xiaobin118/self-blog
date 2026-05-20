import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import type { ApiResponse } from '../types/api.js';

const router = Router();

const IMAGE_DIR = path.resolve(process.cwd(), '../public/image');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);

router.get('/', async (_req, res) => {
  try {
    const result: Record<string, string[]> = {};

    const folders = await fs.readdir(IMAGE_DIR, { withFileTypes: true });

    for (const folder of folders) {
      if (!folder.isDirectory()) continue;
      const folderPath = path.join(IMAGE_DIR, folder.name);
      const files = await fs.readdir(folderPath);
      const images = files
        .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
        .map(f => `/image/${folder.name}/${encodeURIComponent(f)}`);

      if (images.length > 0) {
        result[folder.name] = images;
      }
    }

    const response: ApiResponse<Record<string, string[]>> = { success: true, data: result };
    res.json(response);
  } catch (err) {
    const response: ApiResponse = { success: false, error: 'Failed to read images' };
    res.status(500).json(response);
  }
});

export default router;
