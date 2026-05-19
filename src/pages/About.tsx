import BackgroundLayout from '../components/layout/BackgroundLayout';
import LifeBoard from '../components/LifeBoard';

const aboutImages = [
  '/image/about/AD House12.jpg',
  '/image/about/AD PainoX.jpg',
  '/image/about/AD PianoIX.jpg',
  '/image/about/AD PiaonIV.jpg',
  '/image/about/Qualia.jpg',
  '/image/about/work.jpg',
];

export default function About() {
  return (
    <BackgroundLayout imageUrls={aboutImages}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LifeBoard />
      </div>
    </BackgroundLayout>
  );
}
