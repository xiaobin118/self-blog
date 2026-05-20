import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizes = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function Spinner({ size = 'md', text }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <motion.div
        className={`${sizes[size]} border-2 border-border-light dark:border-border-dark border-t-accent-light dark:border-t-accent-dark rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <span className="text-sm text-text-light dark:text-text-dark">{text}</span>
      )}
    </div>
  );
}
