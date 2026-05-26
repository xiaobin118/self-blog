import { useState, useRef, useEffect, type ImgHTMLAttributes } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export default function LazyImage({ src, alt, className, ...props }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      src={inView ? src : undefined}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
      {...props}
    />
  );
}
