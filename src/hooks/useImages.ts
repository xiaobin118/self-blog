import { useState, useEffect } from 'react';
import { api } from '../api/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function useImages() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<never, { success: boolean; data?: string[] }>('/api/images')
      .then(res => {
        if (res.success && res.data) {
          setImages(res.data.map(u => `${API_BASE_URL}${u}`));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { images, loading };
}
