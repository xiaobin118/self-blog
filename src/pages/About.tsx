import { Helmet } from 'react-helmet-async';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import LifeBoard from '../components/LifeBoard';
import { useSEO } from '../hooks/useSEO';

const aboutImages = [
  '/image/about/AD House12.jpg',
  '/image/about/AD PainoX.jpg',
  '/image/about/AD PianoIX.jpg',
  '/image/about/AD PiaonIV.jpg',
  '/image/about/Qualia.jpg',
  '/image/about/work.jpg',
];

export default function About() {
  const seo = useSEO({ title: 'About' });

  return (
    <BackgroundLayout imageUrls={aboutImages}>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content={seo.type} />
        <link rel="canonical" href={seo.url} />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LifeBoard />
      </div>
    </BackgroundLayout>
  );
}
