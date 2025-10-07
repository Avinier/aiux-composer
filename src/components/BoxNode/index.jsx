import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { BOX_STATUS, BOX_TYPES } from '../../constants';
import { getDynamicBoxShadow, getBoxColor } from '../../utils/shadowUtils';

const BoxNode = ({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const isActive = data.status === BOX_STATUS.ACTIVE;
  const isComplete = data.status === BOX_STATUS.COMPLETE;
  const isReadOnly = data.type === BOX_TYPES.RESEARCH;

  // Auto-focus when box becomes active
  useEffect(() => {
    if (isActive && textareaRef.current && !isReadOnly) {
      textareaRef.current.focus();
    }
  }, [isActive, isReadOnly]);

  // Reset focus when box completes
  useEffect(() => {
    if (isComplete && isFocused) {
      setIsFocused(false);
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  }, [isComplete]);

  const handleClick = (e) => {
    e.stopPropagation();
    // Don't activate if already completed
    if (isComplete) {
      return;
    }
    if (data.onActivate) {
      data.onActivate(data.id);
    }
    // Auto-focus when clicking on active box
    if (isActive && textareaRef.current && !isReadOnly) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (e) => {
    // Handle Tab key for completion
    if (e.key === 'Tab' && isActive && !isReadOnly && data.content && data.content.length > 0) {
      e.preventDefault();
      if (data.onComplete) {
        data.onComplete(data.id);
        // Force blur to reset state
        textareaRef.current?.blur();
        setIsFocused(false);
      }
    }
  };

  // Get box dimensions based on type
  const getBoxDimensions = () => {
    // ROOT box - larger
    if (data.type === BOX_TYPES.ROOT) return 'w-[500px] h-[180px]';

    // CONTEXT boxes - slightly larger
    if (data.type === BOX_TYPES.CONTEXT) return 'w-[320px] h-[150px]';

    // RESEARCH boxes - vertical rectangles
    if (data.type === BOX_TYPES.RESEARCH) return 'w-[200px] h-[280px]';

    // SYNTHESIS and DECISION boxes
    if (data.type === BOX_TYPES.SYNTHESIS || data.type === BOX_TYPES.DECISION) {
      return 'w-[400px] h-[160px]';
    }

    // Default (MEANINGMAKING, TENSION, etc)
    return 'w-[280px] h-[140px]';
  };

  // Get the signature color for this box type
  const boxColor = getBoxColor(data.type);
  // Show glow only when: hovered OR focused (being typed in)
  const dynamicBoxShadow = getDynamicBoxShadow(boxColor, isHovered, isFocused);

  // Hide header when focused (not just invisible, but removed from DOM)
  const showHeader = !isFocused || isReadOnly;

  // Get border style - matches theme color when completed
  const getBorderStyle = () => {
    if (isComplete && !isActive) {
      const color = boxColor;
      // Convert hex to rgba with opacity
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `1px solid rgba(${r}, ${g}, ${b}, 0.4)`;
    }
    return 'none';
  };

  return (
    <div
      className={`
        rounded-sm cursor-pointer transition-all duration-300
        ${getBoxDimensions()} flex flex-col overflow-hidden
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: (isFocused && !isReadOnly && isActive) ? 'var(--background)' : 'var(--gray)',
        border: getBorderStyle(),
        boxShadow: dynamicBoxShadow,
        transform: 'scale(1)', // No scaling on focus/active
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />

      {/* Header - only shown when not focused */}
      {showHeader && (
        <div style={{ padding: '20px 24px' }}>
          <div className="flex items-center justify-between gap-6">
            <span className="font-body text-lg text-lightgray">{data.boxId}</span>
            <span className="font-heading text-2xl font-normal text-text flex-1 text-center">{data.label}</span>
            <div className="w-6">{/* Empty space for layout balance */}</div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1" style={{
        padding: showHeader ? '0 24px 20px 24px' : '24px 24px 20px 24px' // Add minimal top padding when header is hidden
      }}>
        {!isActive && !isComplete && !isReadOnly && (
          <p className="text-darkgray text-xl font-body italic">Click to answer...</p>
        )}

        {isActive && !isReadOnly && (
          <textarea
            ref={textareaRef}
            value={data.content || ''}
            onChange={(e) => data.onChange && data.onChange(data.id, e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Properly reset focus state on blur
              setIsFocused(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder={isFocused ? "Type your answer here..." : "Click to start typing..."}
            className="w-full text-3xl font-body bg-transparent resize-none outline-none border-none"
            style={{
              height: '80px', // Fixed height to prevent expansion
              color: 'var(--text)',
              padding: '20px 12px 12px 12px',
              backgroundColor: 'transparent',
              display: 'block',
              lineHeight: '1.5'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {isComplete && !isActive && !isReadOnly && (
          <div className="pt-2">
            <p className="text-2xl font-body text-text whitespace-pre-wrap leading-relaxed">{data.content}</p>
          </div>
        )}

        {isReadOnly && (
          <div className="text-xl font-body text-darkgray bg-background p-4 rounded-sm">
            {data.content || 'AI research data will appear here...'}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

export default BoxNode;