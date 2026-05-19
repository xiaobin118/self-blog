import BackgroundLayout from '../components/layout/BackgroundLayout';
import TimeLine from '../components/TimeLine';

const archiveImages = [
  '/image/achieve/the-neon-lit-streets-of-a-cyberpunk-anime-night-city-with-this-captivating-4k-wallpaper-generated-ai-free-photo.jpg',
  '/image/achieve/lucy-cyberpunk-edgerunners-anime-wallpaper-3554x1999_53.jpg',
  '/image/achieve/wp11532730.jpg',
];

export default function Archive() {
  return (
    <BackgroundLayout imageUrls={archiveImages}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <TimeLine />
      </div>
    </BackgroundLayout>
  );
}
