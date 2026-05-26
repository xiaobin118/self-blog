import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tagsApi, type ApiTag } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Connect from '../Connect';

interface AsideProps {
  selectedTag?: string;
  onTagSelect?: (tag: string) => void;
}

export default function Aside({ selectedTag, onTagSelect }: AsideProps) {
  const [tags, setTags] = useState<ApiTag[]>([]);
  const { isAdmin } = useAuth();

  const fetchTags = () => {
    tagsApi.getAll().then(res => {
      if (res.success && res.data) setTags(res.data);
    }).catch(() => {});
  };

  useEffect(() => { fetchTags(); }, []);

  const handleAddTag = async (name: string) => {
    try {
      await tagsApi.create(name);
      fetchTags();
    } catch { /* ignore */ }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await tagsApi.delete(id);
      fetchTags();
    } catch { /* ignore */ }
  };

  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block sticky top-20 space-y-4">
        <ProfileCard
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={onTagSelect}
          isAdmin={isAdmin}
          onAddTag={handleAddTag}
          onDeleteTag={handleDeleteTag}
        />
        <Connect />
      </div>

      {/* Mobile: horizontal scrolling card */}
      <div className="lg:hidden">
        <MobileProfileCard
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={onTagSelect}
          isAdmin={isAdmin}
          onAddTag={handleAddTag}
          onDeleteTag={handleDeleteTag}
        />
      </div>
    </aside>
  );
}

interface ProfileCardProps {
  tags: ApiTag[];
  selectedTag?: string;
  onTagSelect?: (tag: string) => void;
  isAdmin?: boolean;
  onAddTag?: (name: string) => void;
  onDeleteTag?: (id: string) => void;
}

function ProfileCard({ tags, selectedTag, onTagSelect, isAdmin, onAddTag, onDeleteTag }: ProfileCardProps) {
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTag.trim();
    if (name && onAddTag) {
      onAddTag(name);
      setNewTag('');
    }
  };

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
        Hi there, I'm a programmer from HIT. I love music and anime, hope you can find something interesting here!
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map(tag => {
          const isActive = selectedTag === tag.name;
          return (
            <div key={tag.id} className="relative group">
              <motion.button
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
              {isAdmin && (
                <button
                  onClick={() => onDeleteTag?.(tag.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
                  title="删除标签"
                >
                  &times;
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin: Add tag */}
      {isAdmin && (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-1">
          <input
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            placeholder="新标签..."
            className="flex-1 px-2 py-1 text-xs rounded-l-full border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-heading-light dark:text-heading-dark placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 outline-none"
          />
          <button
            type="submit"
            disabled={!newTag.trim()}
            className="px-2 py-1 text-xs rounded-r-full bg-accent-light dark:bg-accent-dark text-white disabled:opacity-50 cursor-pointer"
          >
            +
          </button>
        </form>
      )}
    </div>
  );
}

function MobileProfileCard({ tags, selectedTag, onTagSelect, isAdmin, onAddTag, onDeleteTag }: ProfileCardProps) {
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTag.trim();
    if (name && onAddTag) {
      onAddTag(name);
      setNewTag('');
    }
  };

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
        <div className="flex gap-2 pb-1 items-center">
          {tags.map(tag => {
            const isActive = selectedTag === tag.name;
            return (
              <div key={tag.id} className="relative group shrink-0">
                <motion.button
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
                {isAdmin && (
                  <button
                    onClick={() => onDeleteTag?.(tag.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
                    title="删除标签"
                  >
                    &times;
                  </button>
                )}
              </div>
            );
          })}

          {/* Admin: Add tag (inline) */}
          {isAdmin && (
            <form onSubmit={handleSubmit} className="flex shrink-0">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="新标签..."
                className="w-20 px-2 py-1 text-xs rounded-l-full border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-heading-light dark:text-heading-dark placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 outline-none"
              />
              <button
                type="submit"
                disabled={!newTag.trim()}
                className="px-2 py-1 text-xs rounded-r-full bg-accent-light dark:bg-accent-dark text-white disabled:opacity-50 cursor-pointer"
              >
                +
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
