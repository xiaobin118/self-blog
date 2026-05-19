import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostById } from '../data/posts';
import BackgroundLayout from '../components/layout/BackgroundLayout';

const homeImages = [
  '/image/home/woman_with_a_parasol_-_madame_monet_and_her_son_1983.1.29.jpg',
  '/image/home/普维尔悬崖漫步.jpg',
  '/image/home/153-莫奈- Bend in the Epte River near Giverny.webp',
  '/image/home/400-莫奈-Woman Seated under the Willows.webp',
];

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const post = getPostById(Number(id));

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

  return (
    <BackgroundLayout imageUrls={homeImages}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-card-light dark:bg-card-dark rounded-2xl p-8 md:p-12 border border-border-light dark:border-border-dark transition-colors duration-300"
        >
          {/* Header */}
          <header className="mb-8 pb-6 border-b border-border-light dark:border-border-dark">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-accent-light dark:text-accent-dark hover:underline mb-4"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
              返回文章列表
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-heading-light dark:text-heading-dark mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <time className="text-sm text-text-light dark:text-text-dark">
                {post.date}
              </time>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs rounded-full bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark border border-accent-light/20 dark:border-accent-dark/20 transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-heading-light dark:prose-headings:text-heading-dark prose-p:text-text-light dark:prose-p:text-text-dark prose-a:text-accent-light dark:prose-a:text-accent-dark prose-code:bg-bg-light dark:prose-code:bg-bg-dark prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-bg-light dark:prose-pre:bg-bg-dark prose-pre:border prose-pre:border-border-light dark:prose-pre:border-border-dark prose-blockquote:border-accent-light dark:prose-blockquote:border-accent-dark prose-strong:text-heading-light dark:prose-strong:text-heading-dark">
            <Markdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </Markdown>
          </div>
        </motion.article>
      </div>
    </BackgroundLayout>
  );
}
