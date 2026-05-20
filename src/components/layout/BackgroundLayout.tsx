import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface BackgroundLayoutProps {
  imageUrls: string[];
  children: ReactNode;
}

export default function BackgroundLayout({ imageUrls, children }: BackgroundLayoutProps) {
  const [bgImage] = useState(() => {
    const index = Math.floor(Math.random() * imageUrls.length);
    return encodeURI(imageUrls[index]);
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = bgImage;
    if (img.complete) {
      setLoaded(true);
    } else {
      img.onload = () => setLoaded(true);
    }
  }, [bgImage]);

  return (
    <div className="relative min-h-screen">
      {/* Fallback color */}
      <div className="absolute inset-0 bg-bg-light dark:bg-bg-dark" />

      {/* Background image: scrolls with content so long images are fully visible */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Fixed overlay for readability */}
      <div className="fixed inset-0 bg-white/50 dark:bg-black/70 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
