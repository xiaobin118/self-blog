import { useState, useEffect } from 'react';
import { commentsApi, type ApiComment } from '../api/client';
import { useAuth } from '../hooks/useAuth';

interface CommentSectionProps {
  postId: string;
}

interface CommentItemProps {
  comment: ApiComment;
  replies: ApiComment[];
  onDelete: (id: string) => void;
  onReply: (parentId: string) => void;
  isAdmin: boolean;
  currentUserId?: string;
}

function CommentItem({ comment, replies, onDelete, onReply, isAdmin, currentUserId }: CommentItemProps) {
  const canDelete = isAdmin || comment.userId === currentUserId;
  const date = new Date(comment.createdAt).toLocaleDateString('zh-CN');

  return (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <img src={comment.user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
        <span className="font-medium text-sm">{comment.user.username}</span>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <p className="text-sm mb-2">{comment.content}</p>
      <div className="flex gap-3 text-xs text-gray-500">
        <button onClick={() => onReply(comment.id)} className="hover:text-blue-500">Reply</button>
        {canDelete && (
          <button onClick={() => onDelete(comment.id)} className="hover:text-red-500">Delete</button>
        )}
      </div>
      {replies.length > 0 && (
        <div className="mt-2">
          {replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              onDelete={onDelete}
              onReply={onReply}
              isAdmin={isAdmin}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user, isAdmin } = useAuth();
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await commentsApi.getByPost(postId);
      if (res.success) setComments(res.data!);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await commentsApi.create({
        postId,
        content: content.trim(),
        parentId: replyTo ?? undefined,
      });
      setContent('');
      setReplyTo(null);
      fetchComments();
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await commentsApi.delete(id);
      fetchComments();
    } catch { /* ignore */ }
  };

  // Build tree: top-level comments + their replies
  const topLevel = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>

      {/* Comment list */}
      <div className="mb-6">
        {topLevel.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={getReplies(comment.id)}
            onDelete={handleDelete}
            onReply={setReplyTo}
            isAdmin={isAdmin}
            currentUserId={user?.id}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {replyTo && (
            <div className="text-sm text-gray-500">
              Replying to comment
              <button type="button" onClick={() => setReplyTo(null)} className="ml-2 text-red-400">Cancel</button>
            </div>
          )}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 text-sm"
            rows={3}
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">Please log in to comment.</p>
      )}
    </div>
  );
}
