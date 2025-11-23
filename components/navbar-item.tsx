'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NavbarItemProps {
  href: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const NavbarItem = ({ 
  href, 
  children, 
  className = '', 
  isActive = false,
  onClick 
}: NavbarItemProps) => {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileHover={{ 
          y: -3,
          scale: 1.05,
          transition: { 
            duration: 0.2,
            ease: "easeOut"
          }
        }}
        whileTap={{ scale: 0.95 }}
        className={`relative px-3 py-2 rounded-md transition-all duration-300 ${className}`}
      >
        {children}
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            layoutId="navbarIndicator"
          />
        )}
        <div className="absolute bottom-0 left-3 right-3 h-px bg-transparent group-hover:bg-primary/30 transition-colors duration-300" />
      </motion.div>
    </Link>
  );
};