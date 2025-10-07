import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import IterationChoice from './IterationChoice';
import { STAGE_INDICATORS, QUESTIONS } from '../../constants';

const PromptPanel = ({
  activeBoxId,
  activeNode,
  responses,
  completedBoxes,
  totalBoxes,
  currentRound,
  showIterationChoice,
  onIteration,
  onDecide,
  resetPositions,
  isExpanded,
  onToggle
}) => {
  const getStageIndicator = () => {
    if (!activeNode) return { icon: null, text: '', color: '' };
    return STAGE_INDICATORS[activeNode.data.type] || { icon: null, text: '', color: '' };
  };

  const progressPercentage = (completedBoxes.size / totalBoxes) * 100;
  const stageIndicator = getStageIndicator();

  return (
    <motion.div
      className="bg-background border-r-2 border-gray flex flex-col relative"
      initial={{ width: 400, opacity: 0 }}
      animate={{
        width: isExpanded ? 400 : 48,
        opacity: 1
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-10 top-6 z-10 w-8 h-8 bg-background border-2 border-gray hover:border-darkgray rounded-sm flex items-center justify-center transition-all duration-200 hover:bg-gray"
        title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 text-text" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text" />
        )}
      </button>

      {/* Content wrapper with visibility animation */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-6 border-b-2 border-gray">
              <h1 className="text-2xl font-heading font-normal text-text">INSTRUCTIONS</h1>
              <p className="text-sm font-body text-darkgray mt-2">Click any box on the canvas to see its prompt</p>
            </div>

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
                      className={`flex items-center gap-2 p-4 bg-gray rounded-sm ${stageIndicator.color}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-lg">{stageIndicator.icon}</span>
                      <span className="text-sm font-body font-normal">{stageIndicator.text}</span>
                    </motion.div>
                  )}

                  {/* Question */}
                  <div className="bg-gray p-5 rounded-sm border-l-4 border-darkgray">
                    <p className="text-text font-body leading-relaxed">
                      {QUESTIONS[activeBoxId] || ''}
                    </p>
                  </div>

                  {/* Content Preview */}
                  {responses[activeBoxId] && (
                    <motion.div
                      className="border-l-4 pl-5"
                      style={{ borderColor: 'var(--dark-gray)' }}
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

            {/* Reset Button */}
            <div className="px-6 pb-4">
              <button
                onClick={resetPositions}
                className="w-full px-4 py-2.5 bg-background border-2 border-gray hover:border-darkgray text-text hover:text-text text-sm rounded-sm flex items-center justify-center gap-2 transition-all duration-200 font-body hover:bg-gray"
                title="Reset positions and zoom out to show all boxes"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show All Boxes</span>
              </button>
            </div>

            {/* Progress Section */}
            <div className="p-6 border-t-2 border-gray">
              <h3 className="text-sm font-heading font-normal text-text mb-3">PROGRESS</h3>
              <p className="text-xs font-body text-darkgray mb-3">
                {completedBoxes.size} / {totalBoxes} boxes completed
              </p>
              <div className="w-full h-2 bg-gray rounded-sm overflow-hidden">
                <motion.div
                  className="h-full bg-text rounded-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              {currentRound > 1 && (
                <motion.p
                  className="text-xs font-body text-darkgray mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Iteration round: {currentRound}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PromptPanel;