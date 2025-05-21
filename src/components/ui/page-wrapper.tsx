import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import type { HTMLMotionProps } from 'framer-motion';

interface PageWrapperProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  children: React.ReactNode;
}

export function PageWrapper({ children, className, ...props }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn('max-w-7xl mx-auto p-6', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}