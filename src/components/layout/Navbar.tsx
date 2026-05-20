import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

interface NavItem {
  to: string;
  label: string;
  isExternal?: boolean;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/archive', label: 'Archive' },
  { to: '/about', label: 'About' },
  { to: 'https://github.com', label: 'GitHub', isExternal: true },
];

function NavLinkItem({ to, label, isExternal, onClick }: NavItem & { onClick?: () => void }) {
  if (isExternal) {
    return (
      <motion.a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="relative px-3 py-2 text-sm text-text-light dark:text-text-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {label}
      </motion.a>
    );
  }

  return (
    <NavLink to={to} end={to === '/'} onClick={onClick}>
      {({ isActive }: { isActive: boolean }) => (
        <motion.span
          className="relative px-3 py-2 text-sm cursor-pointer transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={isActive
            ? 'text-heading-light dark:text-heading-dark font-medium'
            : 'text-text-light dark:text-text-dark hover:text-heading-light dark:hover:text-heading-dark'
          }>
            {label}
          </span>
          {isActive && (
            <motion.span
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-light dark:bg-accent-dark rounded-full"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </motion.span>
      )}
    </NavLink>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-card-light dark:hover:bg-card-dark transition-colors duration-300 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {theme === 'light' ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="block"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="block"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function SearchButton() {
  return (
    <motion.button
      className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-card-light dark:hover:bg-card-dark transition-colors duration-300 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Search"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </motion.button>
  );
}

function UserMenu() {
  const { user, logout, isAdmin } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
        <span className="text-sm text-text-light dark:text-text-dark hidden sm:inline">{user.username}</span>
        {isAdmin && (
          <Link
            to="/admin/new"
            className="text-xs px-2 py-1 rounded bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark hover:bg-accent-light/20 dark:hover:bg-accent-dark/20 transition-colors"
          >
            New Post
          </Link>
        )}
        <button
          onClick={logout}
          className="text-xs text-text-light dark:text-text-dark hover:text-red-500 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <a
      href={`${API_BASE_URL}/api/auth/github`}
      className="text-sm text-text-light dark:text-text-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors"
    >
      Login
    </a>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg-light/80 dark:bg-bg-dark/80 border-b border-border-light dark:border-border-dark transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold text-heading-light dark:text-heading-dark">
          Yuuzi
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <NavLinkItem key={item.to} {...item} />
          ))}
          <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-2" />
          <SearchButton />
          <ThemeToggle />
          <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-2" />
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <UserMenu />
          <ThemeToggle />
          <motion.button
            onClick={() => setMenuOpen(prev => !prev)}
            className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-card-light dark:hover:bg-card-dark transition-colors duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark"
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navItems.map(item => (
                <NavLinkItem key={item.to} {...item} onClick={closeMenu} />
              ))}
              <div className="h-px bg-border-light dark:bg-border-dark my-2" />
              <SearchButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
