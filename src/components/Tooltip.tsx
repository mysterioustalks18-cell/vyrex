import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({ content, children, className, position = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative flex items-center" 
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.9, 
              y: position === 'top' ? 8 : position === 'bottom' ? -8 : 0, 
              x: position === 'left' ? 8 : position === 'right' ? -8 : 0 
            }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.9, 
              y: position === 'top' ? 8 : position === 'bottom' ? -8 : 0, 
              x: position === 'left' ? 8 : position === 'right' ? -8 : 0 
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-[999] pointer-events-none whitespace-normal min-w-[120px] max-w-[200px] px-3 py-2 bg-[#080d18]/95 backdrop-blur-xl border border-vy-border/40 text-vy-white text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.8)] leading-relaxed text-center",
              positionClasses[position],
              className
            )}
          >
            {content}
            <div className={cn(
              "absolute w-1.5 h-1.5 bg-[#0a1220] border-r border-b border-vy-border/40 rotate-45",
              position === 'top' ? "-bottom-[4px] left-1/2 -translate-x-1/2" : 
              position === 'bottom' ? "-top-[4px] left-1/2 -translate-x-1/2 rotate-[225deg]" :
              position === 'left' ? "-right-[4px] top-1/2 -translate-y-1/2 rotate-[-45deg]" :
              "-left-[4px] top-1/2 -translate-y-1/2 rotate-[135deg]"
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
