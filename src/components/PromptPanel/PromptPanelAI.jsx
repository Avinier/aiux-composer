import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Brain, Loader2 } from 'lucide-react';
import IterationChoice from './IterationChoice';
import MiniMap from './MiniMap';
import { STAGE_INDICATORS } from '../../constants';

const PromptPanelAI = ({
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
  // AI-specific props
  isAIThinking,
  aiThinkingText,
  boxPrompts
}) => {
  const getStageIndicator = () => {
    if (!activeNode) return { icon: null, text: '', color: '' };
    return STAGE_INDICATORS[activeNode.data.type] || { icon: null, text: '', color: '' };
  };

  const stageIndicator = getStageIndicator();

  // Get the current box prompt from either boxPrompts or node data
  const currentPrompt = boxPrompts?.[activeBoxId] || activeNode?.data?.prompt || '';

  return (
    <motion.div
      className="bg-gray flex flex-col relative"
      style={{ borderRight: '2px solid var(--gray)' }}
      initial={{ width: 400, opacity: 0 }}
      animate={{
        width: 400,
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
            <div className="p-6" style={{ borderBottom: '2px solid var(--gray)' }}>
              <h1 className="text-2xl font-heading font-normal text-text">YOUR PROCESS</h1>
              <p className="text-sm font-body text-darkgray mt-2">
                {isAIThinking ? 'AI is thinking...' : 'Click any box to see its prompt'}
              </p>
            </div>

            {/* AI Thinking Display */}
            <AnimatePresence>
              {isAIThinking && (
                  <motion.div
                    className="mx-6 mt-4 p-4 bg-purple-50 border-2 border-gray rounded-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                    <span className="text-sm font-body text-purple-700 font-medium">AI Thinking</span>
                    <Loader2 className="w-4 h-4 text-purple-600 animate-spin ml-auto" />
                  </div>
                  {aiThinkingText && (
                    <p className="text-sm font-body text-purple-600 mt-2 italic">
                      {aiThinkingText}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Box Display */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
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
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray text-text text-xs font-body rounded-sm">
                      {activeNode?.data.boxId || ''}
                    </span>
                    <span className="font-heading text-xl font-normal text-text">
                      {activeNode?.data.label || ''}
                    </span>
                  </div>

                  {/* Stage Indicator */}
                  {stageIndicator.text && (
                    <motion.div
                      className={"flex items-center gap-2 p-4 bg-gray rounded-sm"}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-sm font-body font-normal text-red-600">{stageIndicator.text}</span>
                    </motion.div>
                  )}

                  {/* Question/Prompt */}
                  {currentPrompt && (
                    <div className="bg-gray p-5 rounded-sm border-l-4" style={{ borderColor: 'var(--gray)' }}>
                      <p className="text-text font-body leading-relaxed">
                        {currentPrompt}
                      </p>
                    </div>
                  )}

                  {/* Additional description for tension boxes */}
                  {activeNode?.data?.description && (
                    <motion.div
                      className="p-4 bg-orange-50 border-l-4" 
                      style={{ borderColor: 'var(--gray)' }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm font-body text-orange-800">
                        <span className="font-medium">Tension: </span>
                        {activeNode.data.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Insights for synthesis box */}
                  {activeNode?.data?.insights && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <p className="text-sm font-body text-darkgray font-medium">Key insights:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {activeNode.data.insights.map((insight, idx) => (
                          <li key={idx} className="text-sm font-body text-text">
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Content Preview for editable boxes */}
                  {responses[activeBoxId] && !activeNode?.data?.readOnly && (
                    <motion.div
                      className="border-l-4 pl-5"
                      style={{ borderColor: 'var(--gray)' }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm font-body text-darkgray mb-2">Your response:</p>
                      <p className="text-sm font-body text-text whitespace-pre-wrap">
                        {responses[activeBoxId]}
                      </p>
                    </motion.div>
                  )}

                  {/* Research data display (read-only) */}
                  {activeNode?.data?.readOnly && activeNode?.data?.content && (
                    <motion.div
                      className="p-4 bg-teal-50 border-2 border-gray rounded-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-xs font-body text-teal-700 mb-2 uppercase tracking-wide">
                        AI Research Data
                      </p>
                      <div className="text-sm font-body text-teal-900 whitespace-pre-line">
                        {activeNode.data.content}
                      </div>
                    </motion.div>
                  )}

                  {/* Instructions based on box type */}
                  <motion.div
                    className="mt-6 p-4 bg-gray rounded-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <p className="text-sm font-body text-darkgray">
                      {activeNode?.data?.readOnly ? (
                        <span>
                          <strong>Read-only:</strong> This data was researched by AI based on your values.
                        </span>
                      ) : activeNode?.data?.status === 'COMPLETE' ? (
                        <span className="text-green-600">✓ Complete</span>
                      ) : activeNode?.data?.status === 'ACTIVE' ? (
                        <span>
                          <strong>Type your response</strong> in the box, then press <kbd className="px-2 py-1 bg-darkgray text-background text-xs rounded">Tab</kbd> to continue.
                        </span>
                      ) : (
                        <span className="text-darkgray">Complete previous boxes to unlock this one.</span>
                      )}
                    </p>
                  </motion.div>
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
            <div className="mt-auto flex-shrink-0" style={{ borderTop: '2px solid var(--gray)' }}>
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

export default PromptPanelAI;