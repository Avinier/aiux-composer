import React from 'react';
import { motion } from 'framer-motion';

const CompletionModal = ({ onExport, onNewCanvas }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex items-center justify-center bg-text/50 backdrop-blur-sm"
    >
      <motion.div
        className="bg-background p-10 rounded-sm border-2 border-text shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.1
        }}
      >
        <h2 className="text-3xl font-heading font-normal text-text mb-6">
          Your thinking journey is complete!
        </h2>
        <div className="space-x-4 flex">
          <motion.button
            onClick={onExport}
            className="px-6 py-3 bg-gray border-2 border-darkgray text-text font-body font-normal rounded-sm hover:opacity-80 transition-opacity duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            Export as Image
          </motion.button>
          <motion.button
            onClick={onNewCanvas}
            className="px-6 py-3 bg-text text-background font-body font-normal rounded-sm hover:opacity-80 transition-opacity duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            Start New Canvas
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompletionModal;