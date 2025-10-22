# Integration Implementation Example

This shows the exact code changes needed to connect the frontend to the backend with your improved prompts.

## Step 1: Create API Service

**File: `src/services/api.js`**

```javascript
/**
 * API Service for Meaningmaking Canvas
 * Connects to Express backend with GLM integration
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class MeaningmakingAPI {
  constructor() {
    this.sessionId = Date.now().toString();
    this.cache = new Map();
  }

  async request(endpoint, data = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get the tool framework introduction
  async getFoundation() {
    const response = await fetch(`${API_BASE}/api/foundation`);
    return response.json();
  }

  // Generate context questions from problem statement
  async generateContextQuestions(problemText) {
    const result = await this.request('/api/generate/context', {
      text: problemText
    });

    // Transform to match frontend expectations
    return result.questions.map(q => ({
      id: `box${q.id}`,
      boxId: q.id,
      label: q.title,
      question: q.question,
      preamble: result.preamble || null,
      whyFactual: q.why_factual || q.why
    }));
  }

  // Generate meaningmaking questions from context
  async generateMeaningmakingQuestions(problem, contextAnswers) {
    const result = await this.request('/api/generate/meaningmaking', {
      problem,
      answers: contextAnswers
    });

    return result.questions.map(q => ({
      id: `box${q.id}`,
      boxId: q.id,
      label: q.title,
      question: q.question,
      discoveryGoal: q.discovery_goal,
      possibleTension: q.possible_tension,
      followUpNote: q.follow_up_note
    }));
  }

  // Generate VALUE-RESPONSIVE research (critical improvement)
  async executeResearch(problem, contextAnswers, meaningmakingAnswers) {
    const result = await this.request('/api/research/execute', {
      problem,
      context: contextAnswers,
      meaningmaking: meaningmakingAnswers
    });

    // Transform research to boxes - NOTE the dynamic categories!
    return result.research.map((item, index) => ({
      id: `box3${String.fromCharCode(97 + index)}`, // 3a, 3b, 3c...
      boxId: `3${String.fromCharCode(97 + index)}`,
      label: item.research_focus, // DYNAMIC based on user values!
      userValue: item.user_value, // "You said X matters..."
      content: item.specific_queries.map(q => `• ${q}`).join('\n'),
      neutralityCheck: item.neutrality_check
    }));
  }

  // Generate synthesis prompt
  async generateSynthesis(problem, context, meaningmaking, research) {
    const result = await this.request('/api/generate/synthesis', {
      problem,
      context,
      meaningmaking,
      research
    });

    return {
      preamble: result.preamble,
      prompt: result.synthesis_prompt,
      tensionsPreview: result.tensions_preview,
      iterationInvitation: result.iteration_invitation
    };
  }

  // Generate tensions
  async generateTensions(problem, context, meaningmaking, research, synthesis) {
    const result = await this.request('/api/generate/tensions', {
      problem,
      context,
      meaningmaking,
      research,
      synthesis
    });

    return result.tensions.map(t => ({
      id: `box${t.id}`,
      boxId: t.id,
      label: t.title,
      observation: t.observation,
      tension: t.the_tension,
      question: t.productive_question,
      learningOpportunity: t.learning_opportunity
    }));
  }

  // Generate iteration questions
  async generateIterationQuestions(tensions, sessionData, round) {
    const result = await this.request('/api/generate/iteration', {
      tensions,
      sessionData,
      round
    });

    return result.questions;
  }

  // Generate decision template
  async generateDecisionTemplate(fullJourney) {
    const result = await this.request('/api/generate/decision', {
      fullJourney
    });

    return result;
  }
}

export const api = new MeaningmakingAPI();
```

## Step 2: Modify useCanvasState Hook

**File: `src/hooks/useCanvasState.js`** (key changes)

```javascript
import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

export const useCanvasState = () => {
  // ... existing state ...

  // ADD: Session data to track full journey
  const [sessionData, setSessionData] = useState({
    problem: '',
    contextAnswers: {},
    meaningmakingAnswers: {},
    researchData: [],
    synthesisAnswer: '',
    tensionResolutions: {},
    iterationRound: 1,
    foundationShown: false
  });

  // ADD: Loading states for API calls
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState('');

  // MODIFY: handleComplete to trigger API calls
  const handleComplete = useCallback(async (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !responses[nodeId]) return;

    // Mark current box complete
    setNodes(nds =>
      nds.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: { ...n.data, status: BOX_STATUS.COMPLETE }
          };
        }
        return n;
      })
    );

    setCompletedBoxes(prev => new Set([...prev, nodeId]));

    // Store answer in session
    const stage = node.data.type;
    if (stage === BOX_TYPES.ROOT) {
      setSessionData(prev => ({ ...prev, problem: responses[nodeId] }));
      await generateContextQuestions();
    } else if (stage === BOX_TYPES.CONTEXT) {
      setSessionData(prev => ({
        ...prev,
        contextAnswers: { ...prev.contextAnswers, [nodeId]: responses[nodeId] }
      }));

      // Check if all context boxes complete
      if (isLastContextBox(nodeId)) {
        await generateMeaningmakingQuestions();
      }
    } else if (stage === BOX_TYPES.MEANINGMAKING) {
      setSessionData(prev => ({
        ...prev,
        meaningmakingAnswers: { ...prev.meaningmakingAnswers, [nodeId]: responses[nodeId] }
      }));

      // Check if all meaningmaking complete
      if (isLastMeaningmakingBox(nodeId)) {
        await generateResearch();
      }
    }
    // ... continue pattern for other stages
  }, [nodes, responses]);

  // ADD: Generate context questions dynamically
  const generateContextQuestions = async () => {
    setIsGenerating(true);
    setGenerationMessage('Understanding your situation...');

    try {
      const questions = await api.generateContextQuestions(sessionData.problem);

      // Create nodes with dynamic questions
      const newNodes = questions.map((q, index) => ({
        id: q.id,
        type: 'customBox',
        position: getPosition(q.id), // Use your positioning logic
        data: {
          boxId: q.boxId,
          label: q.label,
          question: q.question, // DYNAMIC from LLM!
          type: BOX_TYPES.CONTEXT,
          status: index === 0 ? BOX_STATUS.ACTIVE : BOX_STATUS.PENDING,
          onActivate: handleActivate,
          onChange: handleContentChange,
          onComplete: handleComplete
        }
      }));

      // Add nodes and edges to canvas
      setNodes(prev => [...prev, ...newNodes]);
      // ... add edges

      // Auto-activate first box
      setActiveBoxId(newNodes[0].id);
    } catch (error) {
      console.error('Failed to generate context questions:', error);
      // Show error to user
    } finally {
      setIsGenerating(false);
      setGenerationMessage('');
    }
  };

  // ADD: Generate value-responsive research
  const generateResearch = async () => {
    setIsGenerating(true);
    setGenerationMessage('Researching based on YOUR values...');

    try {
      const researchBoxes = await api.executeResearch(
        sessionData.problem,
        sessionData.contextAnswers,
        sessionData.meaningmakingAnswers
      );

      // Create research nodes - NOTE dynamic labels!
      const newNodes = researchBoxes.map(box => ({
        id: box.id,
        type: 'customBox',
        position: getPosition(box.id),
        data: {
          boxId: box.boxId,
          label: box.label, // NOT "Market Data" - value-responsive!
          userValue: box.userValue, // "You said X matters..."
          content: box.content,
          type: BOX_TYPES.RESEARCH,
          status: BOX_STATUS.COMPLETE, // Research is read-only
          onActivate: handleActivate
        }
      }));

      setNodes(prev => [...prev, ...newNodes]);

      // Auto-show synthesis after delay
      setTimeout(() => generateSynthesisBox(), 2000);
    } catch (error) {
      console.error('Failed to generate research:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // ... similar patterns for other stages ...

  return {
    // ... existing returns ...
    isGenerating,
    generationMessage,
    sessionData
  };
};
```

## Step 3: Update Box Component

**File: `src/components/BoxNode/index.jsx`** (show dynamic question)

```javascript
export const BoxNode = ({ data, selected }) => {
  const {
    boxId,
    label,
    type,
    status,
    content,
    question, // NEW: Dynamic question from API
    userValue, // NEW: For research boxes
    onActivate,
    onChange,
    onComplete
  } = data;

  return (
    <div className={`box-node ${type} ${status}`}>
      <div className="box-header">
        <span className="box-id">{boxId}</span>
        <span className="box-label">{label}</span>
        {status === BOX_STATUS.COMPLETE && <span>✓</span>}
      </div>

      <div className="box-content">
        {/* Show dynamic question for active boxes */}
        {status === BOX_STATUS.ACTIVE && (
          <>
            {question && (
              <div className="question-text">{question}</div>
            )}
            <textarea
              placeholder="Type your answer..."
              onChange={(e) => onChange(data.id, e.target.value)}
            />
          </>
        )}

        {/* Show user value connection for research */}
        {type === BOX_TYPES.RESEARCH && userValue && (
          <div className="user-value-note">
            {userValue}
          </div>
        )}

        {/* Show content */}
        {content && (
          <div className="box-response">{content}</div>
        )}
      </div>
    </div>
  );
};
```

## Step 4: Add Foundation Introduction

**File: `src/components/FoundationModal/index.jsx`**

```javascript
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export const FoundationModal = ({ onComplete }) => {
  const [foundation, setFoundation] = useState(null);

  useEffect(() => {
    api.getFoundation().then(setFoundation);
  }, []);

  if (!foundation) return null;

  return (
    <div className="foundation-modal">
      <div className="modal-content">
        <h2>🔪 {foundation.title}</h2>

        <div className="knife-metaphor">
          <p>{foundation.content}</p>
        </div>

        <div className="principles">
          <h3>How This Works:</h3>
          <ul>
            {foundation.principles.map((p, i) => (
              <li key={i}>✓ {p}</li>
            ))}
          </ul>
        </div>

        <button onClick={onComplete}>
          I Understand - Let's Begin
        </button>
      </div>
    </div>
  );
};
```

## Step 5: Update Main App

**File: `src/App.jsx`**

```javascript
import { useState } from 'react';
import { Canvas } from './components/Canvas';
import { PromptPanel } from './components/PromptPanel';
import { FoundationModal } from './components/FoundationModal';

function App() {
  const [foundationComplete, setFoundationComplete] = useState(false);

  // Show foundation first
  if (!foundationComplete) {
    return (
      <FoundationModal
        onComplete={() => setFoundationComplete(true)}
      />
    );
  }

  return (
    <div className="app">
      <PromptPanel />
      <Canvas />
    </div>
  );
}
```

## Testing the Integration

1. **Start the backend**: `node server/index.js`
2. **Start the frontend**: `npm run dev`
3. **Verify API connection**: Check network tab for API calls
4. **Test dynamic generation**: Questions should be different based on problem
5. **Verify value-responsive research**: Research categories should match user values

## Key Integration Points

✅ **Dynamic Questions**: No more hardcoded questions in constants
✅ **Value-Responsive Research**: Research derived from user's stated values
✅ **Tool Framework**: Foundation modal introduces knife metaphor
✅ **Session Tracking**: Full journey tracked for context
✅ **API Integration**: Frontend properly calls backend

This transforms your static prototype into a dynamic AI-powered meaningmaking tool!