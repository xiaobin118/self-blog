import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsApi, tagsApi, type ApiTag } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function AdminPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<ApiTag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    tagsApi.getAll().then(res => {
      if (res.success) setAvailableTags(res.data!);
    });

    if (id) {
      postsApi.getBySlug(id).then(res => {
        if (res.success) {
          const post = res.data!;
          setTitle(post.title);
          setContent(post.content);
          setSummary(post.summary);
          setCoverImage(post.coverImage || '');
          setPublished(post.published);
          setSelectedTags(post.tags.map(t => t.tag.name));
        }
      });
    }
  }, [id, isAdmin, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        title,
        content,
        summary,
        coverImage: coverImage || undefined,
        published,
        tags: selectedTags,
      };

      let res;
      if (isEditing && id) {
        res = await postsApi.update(id, data);
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
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Post' : 'New Post'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <input
            type="text"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            type="text"
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 font-mono text-sm"
            rows={15}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-sm rounded-full flex items-center gap-1"
              >
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 text-sm"
              placeholder="Add a tag..."
            />
            <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm">
              Add
            </button>
          </div>
          {availableTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {availableTags.filter(t => !selectedTags.includes(t.name)).map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTags([...selectedTags, tag.name])}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  + {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          <label htmlFor="published" className="text-sm">Publish immediately</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
