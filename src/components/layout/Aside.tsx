import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tagsApi, type ApiTag } from '../../api/client';
import ImageGallery from '../ImageGallery';

interface AsideProps {
  selectedTag?: string;
  onTagSelect?: (tag: string) => void;
}

export default function Aside({ selectedTag, onTagSelect }: AsideProps) {
  const [tags, setTags] = useState<ApiTag[]>([]);

  useEffect(() => {
    tagsApi.getAll().then(res => {
      if (res.success && res.data) setTags(res.data);
    }).catch(() => {});
  }, []);

  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block sticky top-20 space-y-4">
        <ProfileCard tags={tags} selectedTag={selectedTag} onTagSelect={onTagSelect} />
        <ImageGallery />
      </div>

      {/* Mobile: horizontal scrolling card */}
      <div className="lg:hidden">
        <MobileProfileCard tags={tags} selectedTag={selectedTag} onTagSelect={onTagSelect} />
      </div>
    </aside>
  );
}

interface ProfileCardProps {
  tags: ApiTag[];
  selectedTag?: string;
  onTagSelect?: (tag: string) => void;
}

function ProfileCard({ tags, selectedTag, onTagSelect }: ProfileCardProps) {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark transition-colors duration-300">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <motion.img
          src="/image/OIP.webp"
          alt="Lilly"
          className="w-20 h-20 rounded-full object-cover border-2 border-accent-light/30 dark:border-accent-dark/30"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Username */}
      <h2 className="text-center text-lg font-bold text-heading-light dark:text-heading-dark mb-2">
        Lilly
      </h2>

      {/* Signature */}
      <p className="text-center text-sm text-text-light dark:text-text-dark mb-6 leading-relaxed">
        Gott ist tot. Hi there, I'm a programmer who loves anime.
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map(tag => {
          const isActive = selectedTag === tag.name;
          return (
            <motion.button
              key={tag.id}
              className={`px-3 py-1 text-xs rounded-full border cursor-pointer transition-colors duration-300 ${
                isActive
                  ? 'bg-accent-light dark:bg-accent-dark text-white border-accent-light dark:border-accent-dark'
                  : 'bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark hover:border-accent-light/50 dark:hover:border-accent-dark/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTagSelect?.(tag.name === selectedTag ? '' : tag.name)}
            >
              {tag.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function MobileProfileCard({ tags, selectedTag, onTagSelect }: ProfileCardProps) {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-4 border border-border-light dark:border-border-dark transition-colors duration-300 mb-4">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <motion.img
          src="/image/OIP.webp"
          alt="Lilly"
          className="w-12 h-12 rounded-full object-cover shrink-0 border border-accent-light/30 dark:border-accent-dark/30"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Info */}
        <div className="min-w-0">
          <h2 className="text-base font-bold text-heading-light dark:text-heading-dark">
                Lilly
          </h2>
          <p className="text-xs text-text-light dark:text-text-dark truncate">
                Hi there, I'm a programmer form HIT. I love music and anime, hope you can find something interesting here!
          </p>
        </div>
      </div>

      {/* Tags - horizontal scroll */}
      <div className="mt-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          {tags.map(tag => {
            const isActive = selectedTag === tag.name;
            return (
              <motion.button
                key={tag.id}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap border cursor-pointer transition-colors duration-300 ${
                  isActive
                    ? 'bg-accent-light dark:bg-accent-dark text-white border-accent-light dark:border-accent-dark'
                    : 'bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTagSelect?.(tag.name === selectedTag ? '' : tag.name)}
              >
                {tag.name}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
