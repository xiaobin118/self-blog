import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { postsApi, type ApiPost, type PaginatedData } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from './ui/Spinner';

interface ArticlesProps {
  searchQuery?: string;
  selectedTag?: string;
  onSearchChange?: (query: string) => void;
}

const ITEMS_PER_PAGE = 5;

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

export default function Articles({ searchQuery = '', selectedTag = '', onSearchChange }: ArticlesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<PaginatedData<ApiPost> | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag]);

  useEffect(() => {
    setLoading(true);
    postsApi.getList({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      q: searchQuery || undefined,
      tag: selectedTag || undefined,
    }).then(res => {
      if (res.success && res.data) setData(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [currentPage, searchQuery, selectedTag]);

  const handleDelete = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (!confirm('确定删除这篇文章吗？')) return;
    try {
      await postsApi.delete(postId);
      // Refresh list
      const res = await postsApi.getList({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        q: searchQuery || undefined,
        tag: selectedTag || undefined,
      });
      if (res.success && res.data) setData(res.data);
    } catch { /* ignore */ }
  };

  const posts = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <SearchBar
        searchQuery={searchQuery}
        resultCount={data?.total ?? 0}
        onSearchChange={onSearchChange}
      />

      {/* Article list */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Spinner text="加载文章中..." />
          </motion.div>
        ) : posts.length > 0 ? (
          <motion.div
            key={`page-${currentPage}-${searchQuery}-${selectedTag}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col gap-4"
          >
            {posts.map(post => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(`/post/${post.slug}`)}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-heading-light dark:text-heading-dark group-hover:text-accent-light dark:group-hover:text-accent-dark transition-colors duration-300">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <time className="text-sm text-text-light dark:text-text-dark">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('zh-CN') : ''}
                    </time>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/edit/${post.slug}`); }}
                          className="p-1 rounded hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 text-text-light dark:text-text-dark hover:text-accent-light dark:hover:text-accent-dark cursor-pointer"
                          title="编辑"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, post.id)}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-text-light dark:text-text-dark hover:text-red-500 cursor-pointer"
                          title="删除"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark mb-3 line-clamp-2">
                  {post.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="px-2.5 py-0.5 text-xs rounded-full bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark border border-accent-light/20 dark:border-accent-dark/20 transition-colors duration-300"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-text-light dark:text-text-dark"
          >
            未找到文章
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

function SearchBar({
  searchQuery,
  resultCount,
  onSearchChange,
}: {
  searchQuery: string;
  resultCount: number;
  onSearchChange?: (query: string) => void;
}) {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-4 border border-border-light dark:border-border-dark transition-colors duration-300">
      <div className="flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-light dark:text-text-dark shrink-0">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchQuery}
          onChange={e => onSearchChange?.(e.target.value)}
          className="flex-1 bg-transparent text-sm text-heading-light dark:text-heading-dark placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 outline-none"
        />
        {searchQuery && (
          <span className="text-xs text-text-light dark:text-text-dark shrink-0">
            {resultCount} 篇
          </span>
        )}
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 text-sm rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors duration-300"
        whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
        whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
      >
        上一页
      </motion.button>
      <span className="text-sm text-text-light dark:text-text-dark">
        {currentPage} / {totalPages}
      </span>
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 text-sm rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors duration-300"
        whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
        whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
      >
        下一页
      </motion.button>
    </div>
  );
}
