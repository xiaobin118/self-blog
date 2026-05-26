import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-40 w-10 h-10 rounded-full bg-accent-light dark:bg-accent-dark text-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          aria-label="返回顶部"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
