import React from 'react';
import { motion } from 'framer-motion';
import logoImg from '../assets/Empiros_Logo.jpeg';

export default function Logo({ size = 'h-9', showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 cursor-pointer ${className}`}>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.9 }}
          className={`${size === 'h-9' ? 'w-10 h-10' : 'w-16 h-16'} rounded-xl overflow-hidden shadow-2xl transition-transform`}
        >
          <img 
            src={logoImg} 
            alt="Empiros Logo" 
            className="w-full h-full object-cover" 
          />
        </motion.div>
        {showText && (
          <span className={`${size === 'h-9' ? 'text-sm' : 'text-xl'} font-black uppercase tracking-[0.3em] text-inherit`}>
            EMPIROS
          </span>
        )}
    </div>
  );
}
