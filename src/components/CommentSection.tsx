import { useState, useEffect, useCallback } from 'react';
import { commentsApi, type ApiComment } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CommentSkeleton from './CommentSkeleton';

interface CommentSectionProps {
  postId: string;
}

interface PendingComment extends ApiComment {
  pending?: boolean;
}

interface CommentItemProps {
  comment: PendingComment;
  replies: PendingComment[];
  onDelete: (id: string) => void;
  onReply: (parentId: string) => void;
  isAdmin: boolean;
  currentUserId?: string;
}

function CommentItem({ comment, replies, onDelete, onReply, isAdmin, currentUserId }: CommentItemProps) {
  const canDelete = isAdmin || comment.userId === currentUserId;
  const date = new Date(comment.createdAt).toLocaleDateString('zh-CN');

  return (
    <div className={`border-l-2 border-border-light dark:border-border-dark pl-4 mb-4 ${comment.pending ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <img src={comment.user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
        <span className="font-medium text-sm text-heading-light dark:text-heading-dark">{comment.user.username}</span>
        <span className="text-xs text-text-light dark:text-text-dark">{date}</span>
        {comment.pending && (
          <span className="text-xs text-yellow-500">发送中...</span>
        )}
      </div>
      <p className="text-sm text-text-light dark:text-text-dark mb-2">{comment.content}</p>
      {!comment.pending && (
        <div className="flex gap-3 text-xs text-text-light dark:text-text-dark">
          <button onClick={() => onReply(comment.id)} className="hover:text-accent-light dark:hover:text-accent-dark cursor-pointer">Reply</button>
          {canDelete && (
            <button onClick={() => onDelete(comment.id)} className="hover:text-red-500 cursor-pointer">Delete</button>
          )}
        </div>
      )}
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
  const { showToast } = useToast();
  const [comments, setComments] = useState<PendingComment[]>([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await commentsApi.getByPost(postId);
      if (res.success) setComments(res.data!);
    } catch {
      showToast('加载评论失败', 'error');
    }
  }, [postId, showToast]);

  useEffect(() => {
    setLoading(true);
    fetchComments().finally(() => setLoading(false));
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic: PendingComment = {
      id: tempId,
      content: content.trim(),
      postId,
      userId: user.id,
      parentId: replyTo,
      createdAt: new Date().toISOString(),
      isApproved: true,
      user: { id: user.id, username: user.username, avatarUrl: user.avatarUrl, role: user.role },
      pending: true,
    };

    // Optimistic insert
    setComments(prev => [...prev, optimistic]);
    const trimmed = content.trim();
    setContent('');
    setReplyTo(null);
    setSubmitting(true);

    try {
      const res = await commentsApi.create({
        postId,
        content: trimmed,
        parentId: replyTo ?? undefined,
      });
      if (res.success) {
        // Replace optimistic with real data
        setComments(prev => prev.map(c => c.id === tempId ? { ...res.data!, pending: false } : c));
        showToast('评论发表成功', 'success');
      }
    } catch {
      // Rollback on failure
      setComments(prev => prev.filter(c => c.id !== tempId));
      setContent(trimmed);
      setReplyTo(replyTo);
      showToast('评论发表失败，请重试', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这条评论吗？')) return;
    try {
      await commentsApi.delete(id);
      setComments(prev => prev.filter(c => c.id !== id));
      showToast('评论已删除', 'success');
    } catch {
      showToast('删除失败', 'error');
    }
  };

  // Build tree: top-level comments + their replies
  const topLevel = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-heading-light dark:text-heading-dark">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="mb-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        ) : comments.length > 0 ? (
          topLevel.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={getReplies(comment.id)}
              onDelete={handleDelete}
              onReply={setReplyTo}
              isAdmin={isAdmin}
              currentUserId={user?.id}
            />
          ))
        ) : (
          <p className="text-sm text-text-light dark:text-text-dark">暂无评论</p>
        )}
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {replyTo && (
            <div className="text-sm text-text-light dark:text-text-dark">
              回复评论
              <button type="button" onClick={() => setReplyTo(null)} className="ml-2 text-red-400 cursor-pointer">取消</button>
            </div>
          )}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="写下你的评论..."
            className="w-full p-3 border rounded-lg bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark text-sm text-heading-light dark:text-heading-dark placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 outline-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-4 py-2 bg-accent-light dark:bg-accent-dark text-white rounded-lg text-sm disabled:opacity-50 cursor-pointer"
          >
            {submitting ? '发送中...' : '发表评论'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-text-light dark:text-text-dark">请登录后发表评论</p>
      )}
    </div>
  );
}
