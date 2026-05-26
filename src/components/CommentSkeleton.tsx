export default function CommentSkeleton() {
  return (
    <div className="border-l-2 border-border-light dark:border-border-dark pl-4 mb-4 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-bg-light dark:bg-bg-dark" />
        <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-20" />
        <div className="h-3 bg-bg-light dark:bg-bg-dark rounded w-16" />
      </div>
      <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-full mb-1" />
      <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-4/5" />
    </div>
  );
}
