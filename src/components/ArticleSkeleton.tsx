export default function ArticleSkeleton() {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark animate-pulse">
      <div className="h-6 bg-bg-light dark:bg-bg-dark rounded w-3/4 mb-3" />
      <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-full mb-2" />
      <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-5/6 mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-5 bg-bg-light dark:bg-bg-dark rounded-full w-16" />
          <div className="h-5 bg-bg-light dark:bg-bg-dark rounded-full w-12" />
        </div>
        <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-20" />
      </div>
    </div>
  );
}
