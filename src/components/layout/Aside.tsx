import { motion } from 'framer-motion';
import { getAllTags } from '../../data/posts';

interface AsideProps {
  selectedTag?: string;
  onTagSelect?: (tag: string) => void;
}

const tags = getAllTags();

export default function Aside({ selectedTag, onTagSelect }: AsideProps) {
  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block sticky top-20">
        <ProfileCard selectedTag={selectedTag} onTagSelect={onTagSelect} />
      </div>

      {/* Mobile: horizontal scrolling card */}
      <div className="lg:hidden">
        <MobileProfileCard selectedTag={selectedTag} onTagSelect={onTagSelect} />
      </div>
    </aside>
  );
}

interface ProfileCardProps {
  selectedTag?: string;
  onTagSelect?: (tag: string) => void;
}

function ProfileCard({ selectedTag, onTagSelect }: ProfileCardProps) {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark transition-colors duration-300">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <motion.div
          className="w-20 h-20 rounded-full bg-accent-light/20 dark:bg-accent-dark/20 flex items-center justify-center"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-light dark:text-accent-dark">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </motion.div>
      </div>

      {/* Username */}
      <h2 className="text-center text-lg font-bold text-heading-light dark:text-heading-dark mb-2">
        Yuuzi
      </h2>

      {/* Signature */}
      <p className="text-center text-sm text-text-light dark:text-text-dark mb-6 leading-relaxed">
        Gott ist tot. Hi there, I'm a programmer who loves anime.
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map(tag => {
          const isActive = selectedTag === tag;
          return (
            <motion.button
              key={tag}
              className={`px-3 py-1 text-xs rounded-full border cursor-pointer transition-colors duration-300 ${
                isActive
                  ? 'bg-accent-light dark:bg-accent-dark text-white border-accent-light dark:border-accent-dark'
                  : 'bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark hover:border-accent-light/50 dark:hover:border-accent-dark/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTagSelect?.(tag === selectedTag ? '' : tag)}
            >
              {tag}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function MobileProfileCard({ selectedTag, onTagSelect }: ProfileCardProps) {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-4 border border-border-light dark:border-border-dark transition-colors duration-300 mb-4">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <motion.div
          className="w-12 h-12 rounded-full bg-accent-light/20 dark:bg-accent-dark/20 flex items-center justify-center shrink-0"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-light dark:text-accent-dark">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </motion.div>

        {/* Info */}
        <div className="min-w-0">
          <h2 className="text-base font-bold text-heading-light dark:text-heading-dark">
            Yuuzi
          </h2>
          <p className="text-xs text-text-light dark:text-text-dark truncate">
            Gott ist tot. Hi there, I'm a programmer who loves anime.
          </p>
        </div>
      </div>

      {/* Tags - horizontal scroll */}
      <div className="mt-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          {tags.map(tag => {
            const isActive = selectedTag === tag;
            return (
              <motion.button
                key={tag}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap border cursor-pointer transition-colors duration-300 ${
                  isActive
                    ? 'bg-accent-light dark:bg-accent-dark text-white border-accent-light dark:border-accent-dark'
                    : 'bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTagSelect?.(tag === selectedTag ? '' : tag)}
              >
                {tag}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
