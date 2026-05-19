import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postsApi, type ApiPost } from '../api/client';

interface YearGroup {
  year: number;
  entries: ApiPost[];
}

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
  const [groups, setGroups] = useState<YearGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all published posts (up to 50)
    postsApi.getList({ limit: 50 })
      .then(res => {
        if (res.success && res.data) {
          const byYear = new Map<number, ApiPost[]>();
          for (const post of res.data.items) {
            const year = post.publishedAt
              ? new Date(post.publishedAt).getFullYear()
              : new Date(post.createdAt).getFullYear();
            if (!byYear.has(year)) byYear.set(year, []);
            byYear.get(year)!.push(post);
          }
          const sorted = Array.from(byYear.entries())
            .sort((a, b) => b[0] - a[0])
            .map(([year, entries]) => ({ year, entries }));
          setGroups(sorted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-text-light dark:text-text-dark">加载中...</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8"
    >
      {groups.map(group => (
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
              {group.entries.map(entry => (
                <motion.div
                  key={entry.id}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Dot on timeline */}
                  <div className="absolute -left-[31px] top-3 w-3 h-3 rounded-full bg-accent-light dark:bg-accent-dark border-2 border-card-light dark:border-card-dark" />

                  <motion.div
                    className="bg-card-light dark:bg-card-dark rounded-xl p-4 border border-border-light dark:border-border-dark hover:shadow-md transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate(`/post/${entry.slug}`)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-medium text-heading-light dark:text-heading-dark group-hover:text-accent-light dark:group-hover:text-accent-dark transition-colors duration-300">
                        {entry.title}
                      </h3>
                      <time className="text-xs text-text-light dark:text-text-dark shrink-0">
                        {entry.publishedAt
                          ? new Date(entry.publishedAt).toLocaleDateString('zh-CN')
                          : ''}
                      </time>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="px-2 py-0.5 text-xs rounded-full bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark"
                        >
                          {tag.name}
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
      {groups.length === 0 && (
        <div className="text-center py-12 text-text-light dark:text-text-dark">暂无文章</div>
      )}
    </motion.div>
  );
}
