import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IterationChoice from './IterationChoice';
import MiniMap from './MiniMap';
import { STAGE_INDICATORS, BOX_TYPES } from '../../constants';

// Hex to RGB conversion utility
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
    '0, 183, 255'; // Default to sky blue if invalid
};

// Color cycling array - extracted from design system and box types
const GLOW_COLORS = [
  '#00B7FF', // Sky Blue (Context)
  '#06FFA5', // Cyan (Research)
  '#A855F7', // Purple (Meaningmaking)
  '#06FFA5', // Lime Green variant (Synthesis)
  '#FF6B35', // Coral Orange (Tension)
  '#7209B7'  // Violet (Decision)
];

// Creates inset glow shadows with RGB values
const getInsetGlowShadow = (colorRgb, isHovered = false) => {
  const baseOpacity = isHovered ? 0.5 : 0.45;
  const secondaryOpacity = isHovered ? 0.4 : 0.35;
  return `inset rgba(${colorRgb}, ${baseOpacity}) 0px 0px 25px 0px,
          inset rgba(${colorRgb}, ${secondaryOpacity}) 0px 0px 40px 0px,
          inset rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`;
};

const PromptPanel = ({
  activeBoxId,
  activeNode,
  responses,
  completedBoxes,
  nodes,
  currentRound,
  showIterationChoice,
  onIteration,
  onDecide,
  onFocusBox,
  isExpanded,
  onToggle,
  isGenerating,
  generationMessage,
  boxPrompts
}) => {
  const [thinkingWord, setThinkingWord] = React.useState('');
  const [colorIndex, setColorIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [pulsePhase, setPulsePhase] = React.useState(0);

  // Get the current prompt from boxPrompts (AI version) or from node data (regular version)
  const currentPrompt = boxPrompts?.[activeBoxId] || activeNode?.data?.prompt || '';

  const getStageIndicator = () => {
    if (!activeNode) return { icon: null, text: '', color: '' };
    return STAGE_INDICATORS[activeNode.data.type] || { icon: null, text: '', color: '' };
  };

  const stageIndicator = getStageIndicator();

  // No icon rendering — stage indicator displays text only

  // Thinking words for LLM generation
  const thinkingWords = [
    'Analyzing...',
    'Meaningmaking...',
    'Synthesizing...',
    'Reflecting...',
    'Processing...',
    'Connecting ideas...',
    'Exploring patterns...',
    'Structuring thoughts...',
    'Weaving concepts...',
    'Finding clarity...'
  ];

  // Color cycling effect - changes every 2.5 seconds
  React.useEffect(() => {
    if (isGenerating) {
      const colorInterval = setInterval(() => {
        setColorIndex(prev => (prev + 1) % GLOW_COLORS.length);
      }, 2500);

      return () => clearInterval(colorInterval);
    }
  }, [isGenerating]);

  // Pulse animation effect - 1.2 second loop for breathing effect
  React.useEffect(() => {
    if (isGenerating) {
      const pulseInterval = setInterval(() => {
        setPulsePhase(prev => (prev + 1) % 3); // 0, 1, 2 for full, dim, full
      }, 400); // 1200ms / 3 = 400ms per phase

      return () => clearInterval(pulseInterval);
    }
  }, [isGenerating]);

  // Cycle through thinking words when generating
  React.useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setThinkingWord(prev => {
          const currentIndex = thinkingWords.indexOf(prev);
          return thinkingWords[(currentIndex + 1) % thinkingWords.length];
        });
      }, 800);

      // Start with a random word
      setThinkingWord(thinkingWords[Math.floor(Math.random() * thinkingWords.length)]);

      return () => clearInterval(interval);
    } else {
      setThinkingWord('');
      // Reset states when not generating
      setColorIndex(0);
      setPulsePhase(0);
    }
  }, [isGenerating]);

  // Debug: Log when activeBoxId or activeNode changes
  React.useEffect(() => {
    console.log(`📍 [PROMPT PANEL UPDATE] activeBoxId: ${activeBoxId}`);
    console.log(`📍 [PROMPT PANEL UPDATE] activeNode:`, activeNode?.id, activeNode?.data.boxId, activeNode?.data.label);
  }, [activeBoxId, activeNode]);

  return (
    <motion.div
      className="flex flex-col relative"
      style={{
        backgroundColor: 'var(--gray)',
        borderRight: '2px solid var(--primary-bg)'
      }}
      initial={{ width: 480, opacity: 0 }}
      animate={{
        width: 430,
        opacity: 1
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Content wrapper with visibility animation */}
      <AnimatePresence mode="wait">
        {true && (
          <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="px-6 py-6">
              <h1 className="text-2xl font-heading font-normal text-text text-center">YOUR PROCESS</h1>
            </div>

            {/* Active Box Display */}
            <div className="flex-1 px-4 pt-8 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBoxId}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Box ID Badge */}
                  <div className="flex items-center justify-center">
                    <span className="font-heading text-xl font-normal text-text">
                      {activeNode?.data.boxId ? activeNode.data.boxId.replace(/^box/i, '') : ''} {activeNode?.data.label || ''}
                    </span>
                  </div>

                  {/* Combined Question and Answer Box - Always visible except ROOT */}
                  {/* But show thinking message even for ROOT during generation */}
                  {(activeNode?.data.type !== BOX_TYPES.ROOT || (isGenerating && activeNode?.data.type === BOX_TYPES.ROOT)) && (
                    <motion.div
                      className="rounded-sm shadow-sm"
                      style={{
                        backgroundColor: '#FEFEFE',
                        border: '1px solid #E5E5E5',
                        margin: '10px 20px',
                        padding: '10px 10px',
                        minHeight: '60px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        height: isGenerating
                          ? 'auto'
                          : (currentPrompt || responses[activeBoxId])
                            ? 'auto'
                            : '60px',
                        boxShadow: isGenerating ? [
                          `inset 0 0 15px rgba(${hexToRgb(GLOW_COLORS[colorIndex])}, 0.6),
                           inset 0 0 25px rgba(${hexToRgb(GLOW_COLORS[colorIndex])}, 0.4)`,
                          `inset 0 0 20px rgba(${hexToRgb(GLOW_COLORS[(colorIndex + 1) % GLOW_COLORS.length])}, 0.7),
                           inset 0 0 35px rgba(${hexToRgb(GLOW_COLORS[(colorIndex + 1) % GLOW_COLORS.length])}, 0.5)`,
                          `inset 0 0 15px rgba(${hexToRgb(GLOW_COLORS[colorIndex])}, 0.6),
                           inset 0 0 25px rgba(${hexToRgb(GLOW_COLORS[colorIndex])}, 0.4)`
                        ] : 'none'
                      }}
                      transition={{
                        duration: 0.3,
                        height: { duration: 0.2, ease: "easeInOut" },
                        boxShadow: isGenerating ? {
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        } : {}
                      }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      {/* Content Layer */}
                      <div style={{ position: 'relative', zIndex: 2 }}>
                        {/* Generation Message Section - shown when LLM is generating */}
                        {isGenerating && generationMessage && (
                          <div className="p-4 text-center">
                            <motion.p
                              className="text-xs font-heading font-italic text-lightgray"
                              style={{ fontWeight: '400' }}
                              animate={{
                                opacity: [0.3, 0.7, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              {generationMessage}
                            </motion.p>
                          </div>
                        )}

                      {/* Question Section - shown when not generating */}
                      {!isGenerating && currentPrompt && (
                        <div className="p-4 pb-2">
                          <p className="text-[15px] italic font-heading leading-relaxed text-lightgray whitespace-pre-wrap text-center" style={{ letterSpacing: '0.025em' }}>
                            {currentPrompt}
                          </p>
                        </div>
                      )}

                        {/* Answer Section */}
                        {!isGenerating && responses[activeBoxId] && (
                          <div className="p-4 pt-2">
                            <p className="text-sm font-body text-text whitespace-pre-wrap text-center" style={{ fontWeight: '400' }}>
                              {responses[activeBoxId]}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Stage Indicator */}
                  {stageIndicator.text && (
                    <motion.div
                      className={"flex items-center justify-center gap-2 p-4 rounded-sm"}
                      style={{ backgroundColor: 'var(--gray)' }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xs font-body font-normal" style={{ color: '#a0a0a0' }}>{stageIndicator.text}</span>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Iteration Choice Modal */}
            <AnimatePresence>
              {showIterationChoice && (
                <IterationChoice
                  currentRound={currentRound}
                  onIteration={onIteration}
                  onDecide={onDecide}
                />
              )}
            </AnimatePresence>

            {/* Progress MiniMap Section */}
            <div className="mt-auto flex-shrink-0">
              <MiniMap
                nodes={nodes}
                completedBoxes={completedBoxes}
                activeBoxId={activeBoxId}
                onFocusBox={onFocusBox}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PromptPanel;