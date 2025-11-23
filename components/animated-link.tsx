'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const AnimatedLink = ({ href, children, className = '', onClick }: AnimatedLinkProps) => {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileHover={{ 
          y: -2,
          scale: 1.02
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17 
        }}
        className={`inline-block ${className}`}
      >
        {children}
      </motion.div>
    </Link>
  );
};