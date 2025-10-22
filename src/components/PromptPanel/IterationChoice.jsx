import React from 'react';
import { motion } from 'framer-motion';

const IterationChoice = ({ currentRound, onIteration, onDecide }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="p-6"
      style={{
        borderTop: '2px solid var(--gray)',
        backgroundColor: 'var(--gray)'
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <h3 className="font-heading text-xl font-normal text-text mb-4">ITERATION CHOICE</h3>
      <div className="space-y-3">
        <motion.button
          onClick={onIteration}
          className="w-full py-3 bg-text text-background font-body font-normal rounded-sm hover:opacity-80 transition-opacity duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          CONTINUE ITERATION (Round {currentRound + 1})
        </motion.button>
        <motion.button
          onClick={onDecide}
          className="w-full py-3 bg-background text-text font-body font-normal rounded-sm hover:opacity-80 transition-opacity duration-200"
          style={{ border: '2px solid var(--gray)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          READY TO DECIDE
        </motion.button>
      </div>
    </motion.div>
  );
};

export default IterationChoice;