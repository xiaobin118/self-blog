import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Aside from '../components/layout/Aside';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import Articles from '../components/Articles';
import { useSEO } from '../hooks/useSEO';

const homeImages = [
  '/image/home/woman_with_a_parasol_-_madame_monet_and_her_son_1983.1.29.jpg',
  '/image/home/普维尔悬崖漫步.jpg',
  '/image/home/153-莫奈- Bend in the Epte River near Giverny.webp',
  '/image/home/400-莫奈-Woman Seated under the Willows.webp',
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const seo = useSEO();

  return (
    <BackgroundLayout imageUrls={homeImages}>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content={seo.type} />
        <meta property="og:url" content={seo.url} />
        <link rel="canonical" href={seo.url} />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Mobile: sidebar on top */}
        <div className="lg:hidden mb-6">
          <Aside selectedTag={selectedTag} onTagSelect={setSelectedTag} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Articles
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <Aside selectedTag={selectedTag} onTagSelect={setSelectedTag} />
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}
