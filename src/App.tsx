import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useScrollVisibility } from './hooks/useScrollVisibility';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Archive from './pages/Archive';
import About from './pages/About';
import Post from './pages/Post';
import AdminPost from './pages/AdminPost';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import type { ReactNode } from 'react';

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/archive"
          element={
            <PageTransition>
              <Archive />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/post/:slug"
          element={
            <PageTransition>
              <Post />
            </PageTransition>
          }
        />
        <Route
          path="/auth/callback"
          element={<AuthCallback />}
        />
        <Route
          path="/admin/new"
          element={
            <PageTransition>
              <AdminPost />
            </PageTransition>
          }
        />
        <Route
          path="/admin/edit/:slug"
          element={
            <PageTransition>
              <AdminPost />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useScrollVisibility();

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main className="pt-16">
            <AnimatedRoutes />
          </main>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
