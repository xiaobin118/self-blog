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
      {/* Layer 1: Solid fallback color */}
      <div className="fixed inset-0 -z-20 bg-bg-light dark:bg-bg-dark" />

      {/* Layer 2: Background image - URL ALWAYS set, opacity controls visibility.
          This lets the browser precompute bg-cover layout before the image loads,
          preventing the "resize" flash when the image appears. */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
          opacity: loaded ? 1 : 0,
        }}
      />

      {/* Layer 3: Overlay */}
      <div className="fixed inset-0 bg-white/50 dark:bg-black/70" />

      {/* Layer 4: Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
