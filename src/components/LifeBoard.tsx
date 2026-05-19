import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LifeItem {
  title: string;
  detail: string;
}

interface LifeSection {
  id: string;
  title: string;
  icon: string;
  items: LifeItem[];
}

const sections: LifeSection[] = [
  {
    id: 'music',
    title: 'Music',
    icon: '♫',
    items: [
      { title: 'Yurisa - Moonlight Sonata', detail: 'Classical crossover with modern arrangement' },
      { title: 'RADWIMPS - Sparkle', detail: 'Your Name OST, always hits different' },
      { title: 'Nujabes - Feather', detail: 'The godfather of lo-fi hip hop' },
      { title: 'Joe Hisaishi - Summer', detail: 'Simple yet profoundly beautiful piano piece' },
    ],
  },
  {
    id: 'art',
    title: 'Art',
    icon: '🎨',
    items: [
      { title: 'Claude Monet', detail: 'Impressionist master, love his water lilies series' },
      { title: 'Zdzisław Beksiński', detail: 'Dark surrealism, hauntingly beautiful' },
      { title: 'Makoto Shinkai', detail: 'The sky is his canvas, every frame is art' },
    ],
  },
  {
    id: 'game',
    title: 'Game',
    icon: '🎮',
    items: [
      { title: 'NieR: Automata', detail: 'A philosophical masterpiece disguised as an action game' },
      { title: 'Hollow Knight', detail: 'Beautiful hand-drawn metroidvania with deep lore' },
      { title: 'Elden Ring', detail: 'Open world souls-like, exploration at its finest' },
      { title: 'Celeste', detail: 'Tight platformer with an emotional story' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function CollapsibleSection({ section }: { section: LifeSection }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden transition-colors duration-300 hover:shadow-lg"
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-bg-light/50 dark:hover:bg-bg-dark/50 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">
            {section.title}
          </h3>
          <span className="text-sm text-text-light dark:text-text-dark">
            ({section.items.length})
          </span>
        </div>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-light dark:text-text-dark"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      {/* Content with collapse animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-2">
              {section.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-light/50 dark:hover:bg-bg-dark/50 transition-colors duration-300 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-light dark:bg-accent-dark mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-heading-light dark:text-heading-dark group-hover:text-accent-light dark:group-hover:text-accent-dark transition-colors duration-300">
                      {item.title}
                    </p>
                    <p className="text-xs text-text-light dark:text-text-dark mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LifeBoard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {sections.map(section => (
        <CollapsibleSection key={section.id} section={section} />
      ))}
    </motion.div>
  );
}
