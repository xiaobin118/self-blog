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
      {/* Background: single div, no backdrop-blur, no transitions */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-bg-light dark:bg-bg-dark"
        style={{
          backgroundImage: loaded ? `url(${bgImage})` : 'none',
        }}
      />

      {/* Overlay: single div with dark: variant, no transitions */}
      <div className="fixed inset-0 -z-10 bg-white/50 dark:bg-black/70" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
