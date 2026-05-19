import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-heading-light dark:text-heading-dark">
        404
      </h1>
      <p className="text-text-light dark:text-text-dark">
        Page not found
      </p>
      <Link
        to="/"
        className="text-accent-light dark:text-accent-dark hover:underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
