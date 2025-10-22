import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Lightbulb, Target, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import './styles.css';

export const FoundationModal = ({ onComplete }) => {
  const [foundation, setFoundation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const loadFoundation = async () => {
      try {
        const data = await api.getFoundation();
        setFoundation(data);
      } catch (error) {
        console.error('Failed to load foundation:', error);
        // Use default foundation if API fails
        setFoundation({
          title: "Understanding Your Thinking Tool",
          content: "Think of this system like a knife in cooking - it helps you prepare ingredients (information), but YOU decide what to cook (what matters). I'll help you discover your values through structured questions. There are no 'correct' answers - only YOUR answers.",
          metaphor: "knife",
          principles: [
            "You decide what matters",
            "I help organize information",
            "No correct answers exist",
            "Revision is refinement"
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFoundation();
  }, []);

  if (isLoading) {
    return (
      <div className="foundation-modal-overlay">
        <div className="foundation-modal">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      icon: <ChefHat size={48} />,
      title: "The Knife Metaphor",
      content: (
        <>
          <p className="foundation-text">
            Imagine you're a chef with a knife. The knife helps you prepare ingredients,
            but it doesn't tell you <em>what to cook</em>.
          </p>
          <p className="foundation-text">
            Similarly, I'm your thinking tool. I help you organize information and explore options,
            but <strong>YOU decide what matters</strong>.
          </p>
        </>
      )
    },
    {
      icon: <Lightbulb size={48} />,
      title: "Your Values, Your Answers",
      content: (
        <>
          <p className="foundation-text">
            There are no "correct" answers here - only <em>your</em> answers.
          </p>
          <ul className="principle-list">
            <li>✓ I'll ask questions to help you discover what you value</li>
            <li>✓ You'll explore tensions between ideals and reality</li>
            <li>✓ We'll research based on what YOU said matters</li>
            <li>✓ You'll make the final decision that aligns with YOUR values</li>
          </ul>
        </>
      )
    },
    {
      icon: <Target size={48} />,
      title: "How This Works",
      content: (
        <>
          <div className="stage-preview">
            <div className="stage-item">
              <span className="stage-number">1</span>
              <span className="stage-label">Context</span>
              <span className="stage-desc">Facts about your situation</span>
            </div>
            <div className="stage-item">
              <span className="stage-number">2</span>
              <span className="stage-label">Values</span>
              <span className="stage-desc">What truly matters to you</span>
            </div>
            <div className="stage-item">
              <span className="stage-number">3</span>
              <span className="stage-label">Research</span>
              <span className="stage-desc">Data tailored to your values</span>
            </div>
            <div className="stage-item">
              <span className="stage-number">4</span>
              <span className="stage-label">Synthesis</span>
              <span className="stage-desc">Your non-negotiables</span>
            </div>
            <div className="stage-item">
              <span className="stage-number">5</span>
              <span className="stage-label">Tensions</span>
              <span className="stage-desc">Conflicts to resolve</span>
            </div>
            <div className="stage-item">
              <span className="stage-number">6</span>
              <span className="stage-label">Decision</span>
              <span className="stage-desc">Your aligned choice</span>
            </div>
          </div>
        </>
      )
    },
    {
      icon: <RefreshCw size={48} />,
      title: "Remember: Revision is Refinement",
      content: (
        <>
          <p className="foundation-text">
            This isn't a test - it's a discovery process. You can:
          </p>
          <ul className="principle-list">
            <li>✓ Take your time with each question</li>
            <li>✓ Change your mind as you learn</li>
            <li>✓ Go deeper through iteration</li>
            <li>✓ Trust your own judgment</li>
          </ul>
          <div className="key-reminder">
            <strong>🔑 Key Point:</strong> I don't give advice. I help you think clearly
            about what YOU value and what that means for your decision.
          </div>
        </>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="foundation-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="foundation-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="foundation-header">
            <div className="step-indicator">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                />
              ))}
            </div>
          </div>

          <motion.div
            key={currentStep}
            className="foundation-content"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="foundation-icon">
              {currentStepData.icon}
            </div>
            <h2 className="foundation-title">{currentStepData.title}</h2>
            <div className="foundation-body">
              {currentStepData.content}
            </div>
          </motion.div>

          <div className="foundation-actions">
            {currentStep > 0 && (
              <button
                className="foundation-button secondary"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            <button
              className="foundation-button primary"
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? "Begin Your Journey" : "Next"}
            </button>
          </div>

          {currentStep === 0 && (
            <button
              className="skip-button"
              onClick={onComplete}
            >
              Skip Introduction
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};