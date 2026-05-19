import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { useScrollVisibility } from './hooks/useScrollVisibility';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Archive from './pages/Archive';
import About from './pages/About';
import Post from './pages/Post';
import NotFound from './pages/NotFound';
import type { ReactNode } from 'react';

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
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
          path="/post/:id"
          element={
            <PageTransition>
              <Post />
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
      <BrowserRouter>
        <Navbar />
        <main className="pt-16">
          <AnimatedRoutes />
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}
