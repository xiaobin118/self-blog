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
      {/* Fallback background */}
      <div className="fixed inset-0 bg-bg-light dark:bg-bg-dark transition-colors duration-300" />

      {/* Background image */}
      <div
        className={`fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Overlay - light mode: wash out image to near-white */}
      <div className="fixed inset-0 bg-white/50 backdrop-blur-sm dark:hidden transition-colors duration-300" />

      {/* Overlay - dark mode: darken image significantly */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm hidden dark:block transition-colors duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
