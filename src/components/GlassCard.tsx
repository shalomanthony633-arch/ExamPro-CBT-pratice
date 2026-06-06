import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noGlow?: boolean;
}

const GlassCard = React.memo(function GlassCard({ children, className, onClick, noGlow = false }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-[22px] p-5 mb-3.5',
        'bg-[rgba(255,255,255,0.04)] backdrop-blur-[32px]',
        'border border-[rgba(255,255,255,0.12)]',
        onClick && 'cursor-pointer active:scale-[0.97]',
        className
      )}
      style={{
        boxShadow: noGlow ? undefined : '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)',
        WebkitBackdropFilter: 'blur(32px)',
        willChange: 'transform',
      }}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={onClick}
    >
      {!noGlow && (
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
        />
      )}
      {children}
    </motion.div>
  );
});

export default GlassCard;
