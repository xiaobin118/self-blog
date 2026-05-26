export default function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content skeleton */}
        <div className="flex-1 min-w-0 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark animate-pulse"
            >
              <div className="h-6 bg-bg-light dark:bg-bg-dark rounded w-3/4 mb-3" />
              <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-full mb-2" />
              <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-5/6 mb-4" />
              <div className="flex gap-2">
                <div className="h-5 bg-bg-light dark:bg-bg-dark rounded-full w-16" />
                <div className="h-5 bg-bg-light dark:bg-bg-dark rounded-full w-12" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark animate-pulse">
            <div className="w-20 h-20 rounded-full bg-bg-light dark:bg-bg-dark mx-auto mb-4" />
            <div className="h-5 bg-bg-light dark:bg-bg-dark rounded w-24 mx-auto mb-2" />
            <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-full mb-1" />
            <div className="h-4 bg-bg-light dark:bg-bg-dark rounded w-4/5 mx-auto mb-6" />
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-bg-light dark:bg-bg-dark rounded-full w-14" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
