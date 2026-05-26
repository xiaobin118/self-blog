import { Helmet } from 'react-helmet-async';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import TimeLine from '../components/TimeLine';
import { useSEO } from '../hooks/useSEO';

const archiveImages = [
    '/image/achieve/1.webp',
    '/image/achieve/13.webp',
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
