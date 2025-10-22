import React from 'react';
import { motion } from 'framer-motion';
import { BOX_TYPES } from '../../constants';

const SECTION_CONFIG = {
  [BOX_TYPES.ROOT]: ['box0'],
  [BOX_TYPES.CONTEXT]: ['box1a', 'box1b', 'box1c', 'box1d'],
  [BOX_TYPES.MEANINGMAKING]: ['box2a', 'box2b', 'box2c', 'box2d', 'box2e', 'box2f'],
  [BOX_TYPES.RESEARCH]: ['box3a', 'box3b', 'box3c', 'box3d'],
  [BOX_TYPES.SYNTHESIS]: ['box4'],
  [BOX_TYPES.TENSION]: ['box5a', 'box5b', 'box5c'],
  [BOX_TYPES.DECISION]: ['boxFinal']
};

const SECTION_ORDER = [
  BOX_TYPES.ROOT,
  BOX_TYPES.CONTEXT,
  BOX_TYPES.MEANINGMAKING,
  // BOX_TYPES.RESEARCH - excluded from minimap
  BOX_TYPES.SYNTHESIS,
  BOX_TYPES.TENSION,
  BOX_TYPES.DECISION
];

const MiniBox = ({ node, isCompleted, isActive, onFocusBox }) => {
  return (
    <motion.button
      onClick={() => onFocusBox(node.id)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: '18px',
        height: '18px',
        minWidth: '18px',
        minHeight: '18px',
        maxWidth: '18px',
        maxHeight: '18px',
        padding: 0,
        margin: 0,
        backgroundColor: isCompleted ? '#9AFFA6' : '#fff',
        borderRadius: '0',
        border: isCompleted ? 'none' : '1px solid var(--gray)',
        cursor: 'pointer',
        position: 'relative',
        display: 'block',
        flexShrink: 0,
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'background-color 0.3s ease, border 0.3s ease'
      }}
      className="focus:outline-none focus:ring-0"
    />
  );
};

const MiniMap = ({ nodes, completedBoxes, activeBoxId, onFocusBox }) => {
  // Deduplicate nodes by ID first
  const uniqueNodes = nodes.reduce((acc, node) => {
    if (!acc.find(n => n.id === node.id)) {
      acc.push(node);
    }
    return acc;
  }, []);

  const nodesByType = uniqueNodes.reduce((acc, node) => {
    const type = node.data.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(node);
    return acc;
  }, {});

  return (
    <div style={{
      width: '100%',
      padding: '20px',
      boxSizing: 'border-box',
      overflowY: 'auto',
      maxHeight: '500px',
      backgroundColor: 'var(--gray)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {SECTION_ORDER.map((sectionType) => {
          const sectionNodes = nodesByType[sectionType] || [];
          const config = SECTION_CONFIG[sectionType];

          if (sectionNodes.length === 0) return null;

          const sortedNodes = sectionNodes.sort((a, b) => {
            const aIndex = config.indexOf(a.id);
            const bIndex = config.indexOf(b.id);
            return aIndex - bIndex;
          });

          return (
            <div
              key={sectionType}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '8px',
                flexWrap: 'wrap'
              }}
            >
              {sortedNodes.map((node) => {
                const isCompleted = completedBoxes.has(node.id);
                const isActive = activeBoxId === node.id;

                return (
                  <MiniBox
                    key={node.id}
                    node={node}
                    isCompleted={isCompleted}
                    isActive={isActive}
                    onFocusBox={onFocusBox}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniMap;
