import { useState, useEffect } from 'react';
import { api } from '../api/client';

export function useImages() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<never, { success: boolean; data?: string[] }>('/api/images')
      .then(res => {
        if (res.success && res.data) {
          setImages(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { images, loading };
}
