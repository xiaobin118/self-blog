import { motion } from 'framer-motion';

interface TimelineEntry {
  title: string;
  date: string;
  tags: string[];
}

interface YearGroup {
  year: number;
  entries: TimelineEntry[];
}

const timelineData: YearGroup[] = [
  {
    year: 2026,
    entries: [
      { title: 'Building a Personal Blog with React and Tailwind CSS', date: '2026-05-15', tags: ['React', 'Tailwind CSS'] },
      { title: 'My Arch Linux Rice Setup 2026', date: '2026-04-20', tags: ['Arch Linux', 'Customization'] },
      { title: 'Understanding DSP: From Theory to Practice', date: '2026-03-10', tags: ['DSP', 'Mathematics'] },
    ],
  },
  {
    year: 2025,
    entries: [
      { title: 'Dark Mode Done Right: A Complete Guide', date: '2025-12-05', tags: ['Dark Mode', 'CSS'] },
      { title: 'Conda Environment Management Tips', date: '2025-09-18', tags: ['Conda', 'Python'] },
      { title: 'CLI Tools I Can\'t Live Without', date: '2025-06-22', tags: ['CLI Tools', 'Productivity'] },
      { title: 'Setting Up Neovim from Scratch', date: '2025-03-14', tags: ['Neovim', 'Editor'] },
    ],
  },
  {
    year: 2024,
    entries: [
      { title: 'Exploring VS Code Extensions for Web Dev', date: '2024-11-08', tags: ['Extension', 'VS Code'] },
      { title: 'Getting Started with TypeScript 5', date: '2024-07-20', tags: ['TypeScript', 'JavaScript'] },
      { title: 'My Journey into Open Source', date: '2024-02-15', tags: ['Open Source', 'Git'] },
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

export default function TimeLine() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8"
    >
      {timelineData.map(group => (
        <motion.section key={group.year} variants={itemVariants}>
          {/* Year header */}
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-heading-light dark:text-heading-dark">
              {group.year}
            </h2>
            <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
            <span className="text-sm text-text-light dark:text-text-dark">
              {group.entries.length} articles
            </span>
          </div>

          {/* Entries */}
          <div className="relative pl-6 border-l-2 border-border-light dark:border-border-dark">
            <div className="flex flex-col gap-4">
              {group.entries.map((entry, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Dot on timeline */}
                  <div className="absolute -left-[31px] top-3 w-3 h-3 rounded-full bg-accent-light dark:bg-accent-dark border-2 border-card-light dark:border-card-dark" />

                  <motion.div
                    className="bg-card-light dark:bg-card-dark rounded-xl p-4 border border-border-light dark:border-border-dark hover:shadow-md transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-medium text-heading-light dark:text-heading-dark group-hover:text-accent-light dark:group-hover:text-accent-dark transition-colors duration-300">
                        {entry.title}
                      </h3>
                      <time className="text-xs text-text-light dark:text-text-dark shrink-0">
                        {entry.date}
                      </time>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      ))}
    </motion.div>
  );
}
