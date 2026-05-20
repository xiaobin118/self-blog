import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImages } from '../hooks/useImages';
import Spinner from './ui/Spinner';

export default function ImageGallery() {
  const { images, loading } = useImages();
  const [selected, setSelected] = useState<string | null>(null);

  if (loading) return <Spinner size="sm" text="加载图片中..." />;

  const allImages = Object.values(images).flat();
  if (allImages.length === 0) return null;

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark transition-colors duration-300">
      <h3 className="text-lg font-semibold text-heading-light dark:text-heading-dark mb-4">Gallery</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {allImages.slice(0, 9).map((url) => (
          <motion.div
            key={url}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(url)}
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={selected}
              alt=""
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
