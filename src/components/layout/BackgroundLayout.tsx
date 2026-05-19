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
      {/* Solid fallback - matches overlay color, no flash */}
      <div className="fixed inset-0 bg-bg-light dark:bg-bg-dark transition-colors duration-300" />

      {/* Background image - opacity via inline style to avoid Tailwind transition conflict */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat will-change-[opacity]"
        style={{
          backgroundImage: `url(${bgImage})`,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Overlay - only apply backdrop-blur after image loads to prevent recalculation flicker */}
      <div
        className="fixed inset-0 bg-white/50 dark:hidden transition-colors duration-300"
        style={{ backdropFilter: loaded ? 'blur(4px)' : 'none' }}
      />
      <div
        className="fixed inset-0 bg-black/70 hidden dark:block transition-colors duration-300"
        style={{ backdropFilter: loaded ? 'blur(4px)' : 'none' }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
