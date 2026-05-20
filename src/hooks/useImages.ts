import { useState, useEffect } from 'react';
import { api } from '../api/client';

interface ImageData {
  [folder: string]: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function useImages() {
  const [images, setImages] = useState<ImageData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<never, { success: boolean; data?: ImageData }>('/api/images')
      .then(res => {
        if (res.success && res.data) {
          // Prefix each URL with the API base URL
          const prefixed: ImageData = {};
          for (const [folder, urls] of Object.entries(res.data)) {
            prefixed[folder] = urls.map(u => `${API_BASE_URL}${u}`);
          }
          setImages(prefixed);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { images, loading };
}
