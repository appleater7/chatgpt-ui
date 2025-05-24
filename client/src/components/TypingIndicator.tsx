import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <motion.div
        className="w-2 h-2 rounded-full bg-white"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-white"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ 
          duration: 1.4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-white"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ 
          duration: 1.4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.4
        }}
      />
    </div>
  );
};

export default TypingIndicator;
