import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ size = 'h-9', showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 cursor-pointer ${className}`}>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className={`${size === 'h-9' ? 'w-9 h-9' : 'w-12 h-12'} rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black italic shadow-2xl transition-transform`}
        >
          {size === 'h-9' ? 'E' : 'EM'}
        </motion.div>
        {showText && (
          <span className={`${size === 'h-9' ? 'text-sm' : 'text-xl'} font-black uppercase tracking-[0.3em] text-inherit`}>
            EMPIROS
          </span>
        )}
    </div>
  );
}
