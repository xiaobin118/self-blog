import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export default function LoginButton() {
  const { user, logout, isAdmin } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
        <span className="text-sm">{user.username}</span>
        {isAdmin && (
          <a href="/admin/new" className="text-xs text-blue-500 hover:underline">New Post</a>
        )}
        <button onClick={logout} className="text-xs text-gray-500 hover:text-red-500">
          Logout
        </button>
      </div>
    );
  }

  return (
    <a
      href={`${API_BASE_URL}/api/auth/github`}
      className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
    >
      Login with GitHub
    </a>
  );
}
