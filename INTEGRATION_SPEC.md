# Prompt-UI Integration Specification

## Executive Summary

The backend has sophisticated Vaughn Tan-aligned prompts and API endpoints ready, but the frontend is completely disconnected, using hardcoded questions. This document specifies the integration requirements to connect them properly.

## Current State Analysis

### ✅ What's Working

**Backend (server/index.js)**
- Express server with GLM API integration
- Endpoints for all stages (context, meaningmaking, tensions, research)
- Loads improved PROMPTS.js with tool framework
- Proper JSON parsing and error handling

**Frontend (React/Vite)**
- Beautiful canvas UI with ReactFlow
- Box state management via useCanvasState hook
- Stage progression logic
- Visual design system implemented

### ❌ Critical Disconnects

1. **No API Integration**: Frontend uses hardcoded questions in `constants/index.js`
2. **Static Research**: Fixed categories (Market Data, Case Studies) instead of value-responsive
3. **Missing Foundation**: No introduction of tool framework / knife metaphor
4. **No Session Context**: Each API call isolated, no conversation memory
5. **Fixed Labels**: Box labels hardcoded, not dynamic from LLM

## Integration Requirements

### 1. Frontend API Service Layer

Create `src/services/api.js`:

```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const meaningmakingAPI = {
  // Generate context questions based on problem
  async generateContextQuestions(problemText) {
    const response = await fetch(`${API_BASE}/api/generate/context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: problemText })
    });
    return response.json();
  },

  // Generate meaningmaking questions
  async generateMeaningmakingQuestions(problem, contextAnswers) {
    const response = await fetch(`${API_BASE}/api/generate/meaningmaking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem, answers: contextAnswers })
    });
    return response.json();
  },

  // Generate value-responsive research
  async executeResearch(problem, context, meaningmaking) {
    const response = await fetch(`${API_BASE}/api/research/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem, context, meaningmaking })
    });
    return response.json();
  },

  // Additional endpoints...
};
```

### 2. Dynamic Box Generation

Modify `src/utils/nodeGenerator.js`:

```javascript
export const generateContextBoxes = async (problemText, callbacks) => {
  // Call API to get questions
  const { questions } = await meaningmakingAPI.generateContextQuestions(problemText);

  // Generate boxes with dynamic questions
  const nodes = questions.map(q => ({
    id: `box${q.id}`,
    type: 'customBox',
    data: {
      boxId: q.id,
      label: q.title,
      question: q.question, // Dynamic from LLM
      why: q.why_factual, // Explanation from prompt
      type: BOX_TYPES.CONTEXT,
      // ... callbacks
    }
  }));

  return { nodes, edges };
};
```

### 3. Value-Responsive Research Boxes

Critical change for `generateResearchBoxes`:

```javascript
export const generateResearchBoxes = async (problem, context, meaningmaking) => {
  // Get value-responsive research from API
  const { research } = await meaningmakingAPI.executeResearch(problem, context, meaningmaking);

  // Generate boxes with dynamic categories based on user values
  const nodes = research.map(item => ({
    id: item.id,
    type: 'customBox',
    data: {
      label: item.research_focus, // NOT fixed "Market Data"
      content: item.specific_queries.map(q => `• ${q}`).join('\n'),
      userValue: item.user_value, // "You said X matters"
      type: BOX_TYPES.RESEARCH,
      status: BOX_STATUS.COMPLETE
    }
  }));

  return { nodes, edges };
};
```

### 4. Session State Management

Add to `src/hooks/useCanvasState.js`:

```javascript
const [sessionData, setSessionData] = useState({
  problem: '',
  contextAnswers: {},
  meaningmakingAnswers: {},
  researchData: {},
  synthesisAnswer: '',
  tensionResolutions: {},
  iterationRound: 1,
  foundationShown: false // Track if tool framework introduced
});

// Update session as user progresses
const updateSession = (stage, data) => {
  setSessionData(prev => ({
    ...prev,
    [stage]: data
  }));
};
```

### 5. Foundation Integration (Tool Framework)

Add initial modal or prompt panel section:

```javascript
// On app load, before Box 0
const IntroductionModal = () => (
  <div className="foundation-modal">
    <h2>🔪 Understanding Your Tool</h2>
    <p>
      Think of this system like a knife in cooking - it helps you prepare
      ingredients (information), but YOU decide what to cook (what matters).
    </p>
    <p>
      I'll help you discover your values through structured questions.
      There are no "correct" answers - only YOUR answers.
    </p>
    <button onClick={startJourney}>Begin Your Discovery</button>
  </div>
);
```

### 6. API Call Sequencing

```javascript
// In useCanvasState.js or dedicated orchestrator

const progressToNextStage = async (currentStage) => {
  switch(currentStage) {
    case 'ROOT_COMPLETE':
      // Generate context questions
      const contextQuestions = await generateContextBoxes(sessionData.problem);
      addNodesToCanvas(contextQuestions);
      break;

    case 'CONTEXT_COMPLETE':
      // Generate meaningmaking questions
      const meaningQuestions = await generateMeaningmakingBoxes(
        sessionData.problem,
        sessionData.contextAnswers
      );
      addNodesToCanvas(meaningQuestions);
      break;

    case 'MEANINGMAKING_COMPLETE':
      // Generate value-responsive research
      const research = await generateResearchBoxes(
        sessionData.problem,
        sessionData.contextAnswers,
        sessionData.meaningmakingAnswers
      );
      addNodesToCanvas(research);
      break;

    // ... continue pattern
  }
};
```

### 7. Backend Enhancements Needed

Add to `server/index.js`:

```javascript
// Add FOUNDATION endpoint
app.get('/api/foundation', (req, res) => {
  res.json({
    title: "Understanding Your Thinking Tool",
    content: PROMPTS.FOUNDATION,
    metaphor: "knife",
    principles: [
      "You decide what matters",
      "I help organize information",
      "No correct answers exist",
      "Revision is refinement"
    ]
  });
});

// Add ITERATION endpoint
app.post('/api/generate/iteration', async (req, res) => {
  const { tensions, sessionData, round } = req.body;
  // Use ITERATION prompt to generate deeper questions
});

// Add DECISION endpoint
app.post('/api/generate/decision', async (req, res) => {
  const { fullJourney } = req.body;
  // Use DECISION prompt to structure final decision
});
```

### 8. UI Modifications Required

**Dynamic Box Labels**: Remove hardcoded labels from constants
```javascript
// OLD - src/constants/index.js
export const QUESTIONS = {
  'box1a': 'What\'s your current employment status?',
  // ... hardcoded
};

// NEW - questions come from API dynamically
```

**Research Box Flexibility**: Support variable number of research boxes
```javascript
// OLD - Always 4 boxes (3a, 3b, 3c, 3d)
// NEW - Could be 3-6 boxes based on user values
```

**Iteration Tracking**: Add round number to canvas state
```javascript
// Show "Round 2", "Round 3" in UI
// Prefix box IDs with round (r2-box2a)
```

## Implementation Phases

### Phase 1: Basic Connection (MVP)
1. Create API service layer
2. Connect Box 0 → Context generation
3. Connect Context → Meaningmaking generation
4. Test basic flow

### Phase 2: Value-Responsive Research
1. Implement dynamic research categories
2. Connect meaningmaking values to research
3. Remove hardcoded research labels

### Phase 3: Full Integration
1. Add Foundation modal/intro
2. Implement Tensions generation
3. Add Iteration support
4. Complete Decision flow

### Phase 4: Polish
1. Session persistence (localStorage)
2. Error handling and retry logic
3. Loading states during API calls
4. Export completed canvas

## Testing Considerations

1. **API Availability**: Ensure GLM API key is configured
2. **Response Parsing**: Handle malformed JSON gracefully
3. **Network Failures**: Implement retry logic
4. **Session Recovery**: Save progress to localStorage
5. **Performance**: Cache API responses where appropriate

## Success Metrics

✅ Questions dynamically generated based on user context
✅ Research categories derived from user's stated values
✅ Full journey from problem → decision using LLM
✅ Users understand tool framework (not outsourcing judgment)
✅ Iteration capability for deeper exploration

## Conclusion

The backend infrastructure exists and the prompts are sophisticated. The frontend UI is beautiful and functional. They just need to be connected. This integration will transform the app from a static prototype to a true AI-powered meaningmaking tool that embodies Vaughn Tan's framework.