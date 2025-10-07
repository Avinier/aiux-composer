import React from 'react';
import { Panel } from '@xyflow/react';
import { motion } from 'framer-motion';

const Legend = () => {
  const legendItems = [
    { color: '#00b7ff', label: 'Context (Facts)' },
    { color: '#a855f7', label: 'Meaningmaking (Values)' },
    { color: '#06ffa5', label: 'Research (Data)' },
    { color: '#ff6b35', label: 'Tensions' },
    { color: '#00ff33', label: 'Decision' }
  ];

  return (
    <Panel position="top-right" className="m-4">
      <motion.div
        className="bg-gray border border-darkgray p-4 rounded-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <h4 className="font-heading text-sm font-normal text-text mb-3">Box Types</h4>
        <div className="text-xs space-y-2 font-body">
          {legendItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div
                className="w-3 h-3 border-2 rounded-sm"
                style={{ borderColor: item.color }}
              />
              <span className="text-darkgray">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Panel>
  );
};

export default Legend;