import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsApi, tagsApi, type ApiTag } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function AdminPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEditing = Boolean(slug);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [published, setPublished] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<ApiTag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postId, setPostId] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    tagsApi.getAll().then(res => {
      if (res.success) setAvailableTags(res.data!);
    });

    if (slug) {
      postsApi.getBySlug(slug).then(res => {
        if (res.success && res.data) {
          const post = res.data;
          setPostId(post.id);
          setTitle(post.title);
          setContent(post.content);
          setSummary(post.summary);
          setPublished(post.published);
          setSelectedTags(post.tags.map(t => t.tag.name));
        }
      });
    }
  }, [slug, isAdmin, navigate]);

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleToggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        title,
        content,
        summary,
        published,
        tags: selectedTags,
      };

      let res;
      if (isEditing && postId) {
        res = await postsApi.update(postId, data);
      } else {
        res = await postsApi.create(data);
      }

      if (res.success) {
        navigate(`/post/${res.data!.slug}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-heading-light dark:text-heading-dark">
        {isEditing ? 'Edit Post' : 'New Post'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-heading-light dark:text-heading-dark">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark text-heading-light dark:text-heading-dark"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-heading-light dark:text-heading-dark">Summary</label>
          <input
            type="text"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="w-full p-2 border rounded-lg bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark text-heading-light dark:text-heading-dark"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-heading-light dark:text-heading-dark">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-2 border rounded-lg bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark text-heading-light dark:text-heading-dark font-mono text-sm"
            rows={15}
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1 text-heading-light dark:text-heading-dark">Tags</label>

          {/* Selected tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark text-sm rounded-full flex items-center gap-1 border border-accent-light/20 dark:border-accent-dark/20"
              >
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-red-400 hover:text-red-600 cursor-pointer">&times;</button>
              </span>
            ))}
          </div>

          {/* Available tags (clickable) */}
          {availableTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag.name)}
                    className={`px-2.5 py-0.5 text-xs rounded-full border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-accent-light dark:bg-accent-dark text-white border-accent-light dark:border-accent-dark'
                        : 'bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark hover:border-accent-light/50 dark:hover:border-accent-dark/50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{tag.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Add custom tag */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 p-2 border rounded-lg bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark text-heading-light dark:text-heading-dark text-sm"
              placeholder="自定义标签..."
            />
            <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm text-heading-light dark:text-heading-dark cursor-pointer">
              Add
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          <label htmlFor="published" className="text-sm text-heading-light dark:text-heading-dark">Publish immediately</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-accent-light dark:bg-accent-dark text-white rounded-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-heading-light dark:text-heading-dark cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
