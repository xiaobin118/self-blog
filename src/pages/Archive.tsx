import { Helmet } from 'react-helmet-async';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import TimeLine from '../components/TimeLine';
import { useSEO } from '../hooks/useSEO';

const archiveImages = [
  '/image/achieve/the-neon-lit-streets-of-a-cyberpunk-anime-night-city-with-this-captivating-4k-wallpaper-generated-ai-free-photo.jpg',
  '/image/achieve/lucy-cyberpunk-edgerunners-anime-wallpaper-3554x1999_53.jpg',
  '/image/achieve/wp11532730.jpg',
];

export default function Archive() {
  const seo = useSEO({ title: 'Archive' });

  return (
    <BackgroundLayout imageUrls={archiveImages}>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content={seo.type} />
        <link rel="canonical" href={seo.url} />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <TimeLine />
      </div>
    </BackgroundLayout>
  );
}
