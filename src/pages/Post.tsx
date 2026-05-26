import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { postsApi, type ApiPost } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import BackgroundLayout from '../components/layout/BackgroundLayout';
import CommentSection from '../components/CommentSection';
import Spinner from '../components/ui/Spinner';

const homeImages = [
  '/image/home/woman_with_a_parasol_-_madame_monet_and_her_son_1983.1.29.jpg',
  '/image/home/普维尔悬崖漫步.jpg',
  '/image/home/153-莫奈- Bend in the Epte River near Giverny.webp',
  '/image/home/400-莫奈-Woman Seated under the Willows.webp',
];

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<ApiPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const seo = useSEO({
    title: post?.title,
    description: post?.summary,
    type: 'article',
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    postsApi.getBySlug(slug)
      .then(res => {
        if (res.success && res.data) setPost(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!post || !confirm('确定删除这篇文章吗？')) return;
    try {
      await postsApi.delete(post.id);
      navigate('/');
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <BackgroundLayout imageUrls={homeImages}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-card-light dark:bg-card-dark rounded-2xl p-8 border border-border-light dark:border-border-dark transition-colors duration-300">
            <Spinner text="加载文章中..." />
          </div>
        </div>
      </BackgroundLayout>
    );
  }

  if (!post) {
    return (
      <BackgroundLayout imageUrls={homeImages}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-card-light dark:bg-card-dark rounded-2xl p-8 border border-border-light dark:border-border-dark text-center transition-colors duration-300">
            <h1 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-4">
              文章未找到
            </h1>
            <Link to="/" className="text-accent-light dark:text-accent-dark hover:underline">
              返回首页
            </Link>
          </div>
        </div>
      </BackgroundLayout>
    );
  }

  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('zh-CN')
    : '';

  return (
    <BackgroundLayout imageUrls={homeImages}>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={seo.url} />
        <meta property="article:published_time" content={post.publishedAt || post.createdAt} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={seo.description} />
        <link rel="canonical" href={seo.url} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-card-light dark:bg-card-dark rounded-2xl p-8 md:p-12 border border-border-light dark:border-border-dark transition-colors duration-300"
        >
          {/* Header */}
          <header className="mb-8 pb-6 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-sm text-accent-light dark:text-accent-dark hover:underline"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                返回文章列表
              </Link>

              {/* Admin buttons */}
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/edit/${post.slug}`)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark hover:bg-accent-light/20 dark:hover:bg-accent-dark/20 transition-colors cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    编辑
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    删除
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-heading-light dark:text-heading-dark mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <time className="text-sm text-text-light dark:text-text-dark">
                {dateStr}
              </time>
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
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-heading-light dark:prose-headings:text-heading-dark prose-p:text-text-light dark:prose-p:text-text-dark prose-a:text-accent-light dark:prose-a:text-accent-dark prose-code:bg-bg-light dark:prose-code:bg-bg-dark prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-bg-light dark:prose-pre:bg-bg-dark prose-pre:border prose-pre:border-border-light dark:prose-pre:border-border-dark prose-blockquote:border-accent-light dark:prose-blockquote:border-accent-dark prose-strong:text-heading-light dark:prose-strong:text-heading-dark">
            <Markdown remarkPlugins={[remarkGfm]}>
              {DOMPurify.sanitize(post.content)}
            </Markdown>
          </div>

          {/* Comments */}
          <CommentSection postId={post.id} />
        </motion.article>
      </div>
    </BackgroundLayout>
  );
}
