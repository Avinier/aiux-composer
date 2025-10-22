/**
 * AI-Powered Node Generator
 * =========================
 * Generates nodes dynamically based on AI responses.
 * Implements the meaningmaking framework with GLM-4.5 integration.
 */

import { BOX_TYPES, BOX_STATUS } from '../constants';
import { getIdealPositions } from './dynamicPositioning';
import { api } from '../services/api';
// Keep aiService as fallback for now
import aiService from '../services/aiService';

/**
 * REUSABLE: Generate edges from parent section to child section
 * @param {Array} parentBoxIds - IDs of parent boxes (e.g., ['box1a', 'box1b', 'box1c', 'box1d'])
 * @param {Array} childNodes - Child nodes to connect to
 * @param {number} childCount - How many child nodes each parent connects to (default: 2)
 */
const generateSectionEdges = (parentBoxIds, childNodes, childCount = 2) => {
  const edges = [];

  parentBoxIds.forEach(sourceId => {
    childNodes.slice(0, childCount).forEach(targetNode => {
      edges.push({
        id: `e-${sourceId}-${targetNode.id}`,
        source: sourceId,
        target: targetNode.id,
        type: 'smoothstep',
        style: { stroke: '#eeeae6', strokeOpacity: 1 }
      });
    });
  });

  console.log(`🔗 [EDGES] Created ${edges.length} edges: ${parentBoxIds.length} parents → ${childCount} children each`);
  return edges;
};

/**
 * Generate context questions based on user's problem
 */
export const generateContextBoxesWithAI = async (
  problemText,
  handleContentChange,
  handleComplete,
  setActiveBoxId
) => {
  console.log('\n🏗️ [NODE GEN] generateContextBoxesWithAI');

  const FIXED_BOX_COUNT = 4; // Always generate exactly 4 context boxes
  const idealPositions = getIdealPositions();

  try {
    console.log('🌐 [API CALL] Calling generateContextQuestions with:', problemText);
    const startTime = Date.now();
    // Get AI-generated questions
    const aiQuestions = await api.generateContextQuestions(problemText);
    const endTime = Date.now();
    console.log(`📋 [NODE GEN] Received ${aiQuestions.length} AI questions in ${endTime - startTime}ms`);

    // Ensure we have exactly 4 questions
    const questions = aiQuestions.slice(0, FIXED_BOX_COUNT);

    // If AI returned less than 4, use fallback questions
    if (questions.length < FIXED_BOX_COUNT) {
      console.log(`⚠️ [NODE GEN] AI returned only ${questions.length} questions, using fallback for remaining`);
      const fallbackQuestions = [
        { id: '1a', title: 'Employment', prompt: "What's your current employment status and income?" },
        { id: '1b', title: 'Financial', prompt: "How much financial runway do you have?" },
        { id: '1c', title: 'Skills', prompt: "What are your main skills and experience?" },
        { id: '1d', title: 'Opportunity', prompt: "Do you have a specific idea or opportunity?" }
      ];

      while (questions.length < FIXED_BOX_COUNT) {
        questions.push(fallbackQuestions[questions.length]);
      }
    }

    // Map questions to nodes with fixed positioning
    const nodes = questions.map((q, i) => {
      const nodeId = `box${q.id}`;
      const isFirstBox = i === 0;

      console.log(`📦 [NODE CREATE] ${nodeId} - index: ${i}, isActive: ${isFirstBox}`);

      return {
        id: nodeId,
        type: 'customBox',
        position: idealPositions[nodeId] || { x: 100 + (i * 350), y: 250 },
        data: {
          id: nodeId, // BoxNode expects data.id
          boxId: q.id,
          label: q.label || q.title, // Use label from API response
          prompt: q.question, // Use question field from API response
          type: BOX_TYPES.CONTEXT,
          status: isFirstBox ? BOX_STATUS.ACTIVE : BOX_STATUS.PENDING,
          content: '',
          onActivate: (id) => setActiveBoxId(id),
          onChange: (id, value) => handleContentChange(id, value),
          onComplete: (id) => handleComplete(id)
        }
      };
    });

    console.log('📋 [NODES CREATED] Order:', nodes.map(n => `${n.id}(${n.data.status})`).join(', '));

    // Generate edges from root to context boxes
    const edges = nodes.map(node => ({
      id: `e-box0-${node.id}`,
      source: 'box0',
      target: node.id,
      type: 'smoothstep',
      style: { stroke: '#eeeae6', strokeOpacity: 1 }
    }));

    console.log(`✅ [NODE GEN] Created ${FIXED_BOX_COUNT} context nodes with ${edges.length} edges`);
    return { nodes, edges };
  } catch (error) {
    console.error('❌ [NODE GEN ERROR] Failed to generate context boxes:', error);
    console.log('🔄 [FALLBACK] Using default context questions');
    // Fallback to default questions
    return generateDefaultContextBoxes(handleContentChange, handleComplete, setActiveBoxId);
  }
};

/**
 * Generate meaningmaking questions based on context
 */
export const generateMeaningmakingBoxesWithAI = async (
  problem,
  contextAnswers,
  handleContentChange,
  handleComplete,
  setActiveBoxId,
  startY = 450 // Default Y position if not provided
) => {
  const FIXED_BOX_COUNT = 6; // Always generate exactly 6 meaningmaking boxes
  const idealPositions = getIdealPositions();

  try {
    // Get AI-generated questions
    const aiQuestions = await api.generateMeaningmakingQuestions(problem, contextAnswers);
    console.log(`📋 [NODE GEN] Received ${aiQuestions.length} AI meaningmaking questions`);

    // Ensure we have exactly 6 questions
    const questions = aiQuestions.slice(0, FIXED_BOX_COUNT);

    // If AI returned less than 6, use fallback questions
    if (questions.length < FIXED_BOX_COUNT) {
      console.log(`⚠️ [NODE GEN] AI returned only ${questions.length} questions, using fallback for remaining`);
      const fallbackQuestions = [
        { id: '2a', title: 'Success Vision', prompt: "What would make this the right decision in 5 years?" },
        { id: '2b', title: 'Failure Fear', prompt: "What's the worst outcome and why would it devastate you?" },
        { id: '2c', title: 'Sacrifice Ranking', prompt: "Rank what you're willing vs unwilling to sacrifice." },
        { id: '2d', title: 'Work Energy', prompt: "What work energizes vs drains you?" },
        { id: '2e', title: 'Impact vs Income', prompt: "High pay but meaningless OR low pay but meaningful?" },
        { id: '2f', title: 'Risk Tolerance', prompt: "Where's your real risk boundary?" }
      ];

      while (questions.length < FIXED_BOX_COUNT) {
        questions.push(fallbackQuestions[questions.length]);
      }
    }

    // Map questions to nodes with relative Y positioning
    console.log(`📐 [POSITIONING] Meaningmaking boxes starting at Y: ${startY} (relative to context boxes)`);
    const centerX = 785; // Same center as dynamicPositioning.js
    const boxWidth = 280;
    const horizontalGap = 50;
    const rowHeight = 140; // Meaningmaking box height
    const verticalGap = 30; // Gap between rows

    const nodes = questions.map((q, i) => {
      const nodeId = `box${q.id}`;
      const row = Math.floor(i / 3); // 0 or 1 (for 6 boxes in 2 rows)
      const col = i % 3; // 0, 1, or 2

      // Calculate X position (centered, 3 boxes per row)
      const totalWidth = 3 * boxWidth + 2 * horizontalGap;
      const startX = centerX - totalWidth / 2;
      const xPos = startX + col * (boxWidth + horizontalGap);

      // Calculate Y position (relative to startY)
      const yPos = startY + row * (rowHeight + verticalGap);

      console.log(`📦 [NODE CREATE] ${nodeId} at position (${xPos}, ${yPos}) - row ${row}, col ${col}`);

      return {
        id: nodeId,
        type: 'customBox',
        position: { x: xPos, y: yPos },
        data: {
          id: nodeId, // BoxNode expects data.id
          boxId: q.id,
          label: q.label || q.title, // Use label from API response
          prompt: q.question, // Use question field from API response
          type: BOX_TYPES.MEANINGMAKING,
          status: i === 0 ? BOX_STATUS.ACTIVE : BOX_STATUS.PENDING,
          content: '',
          onActivate: (id) => setActiveBoxId(id),
          onChange: (id, value) => handleContentChange(id, value),
          onComplete: (id) => handleComplete(id)
        }
      };
    });

    // Generate edges using reusable helper
    const contextBoxIds = ['box1a', 'box1b', 'box1c', 'box1d'];
    const edges = generateSectionEdges(contextBoxIds, nodes, 2);

    console.log(`✅ [NODE GEN] Created ${FIXED_BOX_COUNT} meaningmaking nodes with ${edges.length} edges`);
    return { nodes, edges };
  } catch (error) {
    console.error('Failed to generate meaningmaking boxes:', error);
    return generateDefaultMeaningmakingBoxes(handleContentChange, handleComplete, setActiveBoxId);
  }
};

/**
 * Execute VALUE-RESPONSIVE research and generate research boxes
 * CRITICAL: Research categories are generated based on user's stated values
 */
export const generateResearchBoxesWithAI = async (
  problem,
  contextAnswers,
  meaningmakingAnswers,
  setActiveBoxId,
  onThinkingUpdate,
  startY = 820 // Default Y if not provided
) => {
  const FIXED_BOX_COUNT = 3; // Always generate exactly 3 research boxes
  const centerX = 785; // Center position for boxes

  try {
    // Show thinking process
    if (onThinkingUpdate) {
      onThinkingUpdate('Researching based on what YOU said matters...');
    }

    // Execute VALUE-RESPONSIVE research
    const aiResearchData = await api.executeResearch(problem, contextAnswers, meaningmakingAnswers);
    console.log(`📋 [NODE GEN] Received ${aiResearchData.length} AI research items`);

    // Ensure we have exactly 3 research boxes
    const researchData = aiResearchData.slice(0, FIXED_BOX_COUNT);

    // If AI returned less than 3, use fallback research
    if (researchData.length < FIXED_BOX_COUNT) {
      console.log(`⚠️ [NODE GEN] AI returned only ${researchData.length} research items, using fallback for remaining`);
      const fallbackResearch = [
        {
          id: 'box3a',
          boxId: '3a',
          label: 'Market Data',
          userValue: 'Based on your context',
          content: '• Industry analysis\n• Competition overview\n• Market trends'
        },
        {
          id: 'box3b',
          boxId: '3b',
          label: 'Case Studies',
          userValue: 'Based on similar decisions',
          content: '• Success patterns\n• Common pitfalls\n• Timeline expectations'
        },
        {
          id: 'box3c',
          boxId: '3c',
          label: 'Financial Model',
          userValue: 'Based on your resources',
          content: '• Cost estimates\n• Revenue projections\n• Break-even analysis'
        }
      ];

      while (researchData.length < FIXED_BOX_COUNT) {
        researchData.push(fallbackResearch[researchData.length]);
      }
    }

    // Create research display boxes with relative positioning
    const boxWidth = 200; // Research boxes are 200px wide (narrow vertical boxes)
    const horizontalGap = 50;
    const totalWidth = FIXED_BOX_COUNT * boxWidth + (FIXED_BOX_COUNT - 1) * horizontalGap;
    const startX = centerX - totalWidth / 2;

    const nodes = researchData.map((item, index) => {
      const xPos = startX + index * (boxWidth + horizontalGap);

      return {
        id: item.id,
        type: 'customBox',
        position: { x: xPos, y: startY }, // Use relative Y position
        data: {
          id: item.id, // BoxNode expects data.id
          boxId: item.boxId,
          label: item.label,
          userValue: item.userValue, // Connection to user's values
          type: BOX_TYPES.RESEARCH,
          status: BOX_STATUS.COMPLETE,
          content: item.content,
          readOnly: true,
          onActivate: (id) => setActiveBoxId(id)
        }
      };
    });

    // Generate edges using reusable helper
    // Connect all meaningmaking boxes to all research boxes
    const meaningmakingBoxIds = Object.keys(meaningmakingAnswers).map(id => `box${id}`);
    const edges = generateSectionEdges(meaningmakingBoxIds, nodes, FIXED_BOX_COUNT);

    console.log(`✅ [NODE GEN] Created ${FIXED_BOX_COUNT} research nodes`);
    return {
      nodes,
      edges,
      research: researchData
    };
  } catch (error) {
    console.error('Failed to generate research boxes:', error);
    return generateDefaultResearchBoxes(setActiveBoxId);
  }
};

/**
 * Generate synthesis prompt and box
 */
export const generateSynthesisBoxWithAI = async (
  problem,
  contextAnswers,
  meaningmakingAnswers,
  handleContentChange,
  handleComplete,
  setActiveBoxId,
  startY = 1100, // Default Y if not provided
  researchNodes = [] // Research nodes for edge generation
) => {
  try {
    // Get synthesis prompt from AI
    const synthesis = await aiService.generateSynthesisPrompt(
      problem,
      contextAnswers,
      meaningmakingAnswers
    );

    // Center the synthesis box horizontally (aligned with research section)
    const centerX = 735; // Adjusted to center better
    const boxWidth = 280;
    const xPos = centerX - boxWidth / 2;

    const node = {
      id: 'box4',
      type: 'customBox',
      position: { x: xPos, y: startY }, // Use relative Y position, centered X
      data: {
        id: 'box4', // BoxNode expects data.id
        boxId: '4',
        label: 'Core Non-Negotiables',
        prompt: synthesis.questionPrompt,
        insights: synthesis.insights,
        type: BOX_TYPES.SYNTHESIS,
        status: BOX_STATUS.ACTIVE,
        content: '',
        onActivate: (id) => setActiveBoxId(id),
        onChange: (id, value) => handleContentChange(id, value),
        onComplete: (id) => handleComplete(id)
      }
    };

    // Generate edges using reusable helper
    // Connect all research boxes to synthesis box
    const researchBoxIds = researchNodes.map(n => n.id);
    const edges = generateSectionEdges(researchBoxIds, [node], 1);

    return { node, edges, synthesisData: synthesis };
  } catch (error) {
    console.error('Failed to generate synthesis box:', error);
    return generateDefaultSynthesisBox(handleContentChange, handleComplete, setActiveBoxId, startY, researchNodes);
  }
};

/**
 * Generate tension boxes based on AI analysis
 */
export const generateTensionBoxesWithAI = async (
  sessionData,
  handleContentChange,
  handleComplete,
  setActiveBoxId,
  onThinkingUpdate,
  startY = 1300, // Default Y if not provided
  synthesisNode = null // Synthesis node for edge generation
) => {
  const FIXED_BOX_COUNT = 3; // Always generate exactly 3 tension boxes
  const centerX = 785; // Center position for boxes

  try {
    // Show thinking process
    if (onThinkingUpdate) {
      onThinkingUpdate('Identifying tensions and contradictions in your values vs reality...');
    }

    // Get tensions from AI
    const aiTensions = await aiService.generateTensions(sessionData);
    console.log(`📋 [NODE GEN] Received ${aiTensions.length} AI tensions:`, aiTensions);

    // Ensure we have exactly 3 tensions
    const tensions = aiTensions.slice(0, FIXED_BOX_COUNT);

    // If AI returned less than 3, use fallback tensions
    if (tensions.length < FIXED_BOX_COUNT) {
      console.log(`⚠️ [NODE GEN] AI returned only ${tensions.length} tensions, using fallback for remaining`);
      const fallbackTensions = [
        {
          id: '5a',
          title: 'Time vs Reality',
          prompt: 'How do you reconcile urgency with realistic timelines?',
          description: 'Your expectations vs actual requirements'
        },
        {
          id: '5b',
          title: 'Income vs Risk',
          prompt: 'Is your risk tolerance aligned with income expectations?',
          description: 'Financial security vs opportunity'
        },
        {
          id: '5c',
          title: 'Control vs Capability',
          prompt: 'Full control with limits OR shared control with more capability?',
          description: 'Independence vs collaboration'
        }
      ];

      while (tensions.length < FIXED_BOX_COUNT) {
        tensions.push(fallbackTensions[tensions.length]);
      }
    }

    // Create tension boxes with relative positioning
    const boxWidth = 280;
    const horizontalGap = 50;
    const totalWidth = FIXED_BOX_COUNT * boxWidth + (FIXED_BOX_COUNT - 1) * horizontalGap;
    const startX = centerX - totalWidth / 2;

    const nodes = tensions.map((tension, i) => {
      const nodeId = `box${tension.id}`;
      const xPos = startX + i * (boxWidth + horizontalGap);

      console.log(`📦 [TENSION NODE CREATE] ${nodeId}:`, {
        id: tension.id,
        title: tension.title,
        prompt: tension.prompt,
        description: tension.description,
        isActive: i === 0
      });

      return {
        id: nodeId,
        type: 'customBox',
        position: { x: xPos, y: startY }, // Use relative Y position
        data: {
          id: nodeId, // BoxNode expects data.id
          boxId: tension.id,
          label: tension.title,
          prompt: tension.prompt || tension.question || tension.tension, // Handle different field names
          description: tension.description,
          type: BOX_TYPES.TENSION,
          status: i === 0 ? BOX_STATUS.ACTIVE : BOX_STATUS.PENDING,
          content: '',
          onActivate: (id) => setActiveBoxId(id),
          onChange: (id, value) => handleContentChange(id, value),
          onComplete: (id) => handleComplete(id)
        }
      };
    });

    // Generate edges using reusable helper
    const edges = synthesisNode
      ? generateSectionEdges([synthesisNode.id], nodes, nodes.length)
      : nodes.map(node => ({
          id: `e-box4-${node.id}`,
          source: 'box4',
          target: node.id,
          type: 'smoothstep',
          style: { stroke: '#eeeae6', strokeOpacity: 1 }
        }));

    console.log(`✅ [NODE GEN] Created ${FIXED_BOX_COUNT} tension nodes`);
    return { nodes, edges, tensions };
  } catch (error) {
    console.error('Failed to generate tension boxes:', error);
    return generateDefaultTensionBoxes(handleContentChange, handleComplete, setActiveBoxId);
  }
};

/**
 * Generate iteration questions based on tensions
 */
export const generateIterationQuestionsWithAI = async (
  sessionData,
  handleContentChange,
  handleComplete,
  setActiveBoxId,
  iterationRound
) => {
  try {
    // Get refined questions from AI
    const questions = await aiService.generateIterationQuestions(sessionData);

    const idealPositions = getIdealPositions();
    const yOffset = 1100 + (iterationRound * 200);

    const nodes = questions.map((q, i) => {
      const nodeId = `box${q.id}`;
      return {
        id: nodeId,
        type: 'customBox',
        position: { x: 350 + (i % 3) * 200, y: yOffset + Math.floor(i / 3) * 150 },
        data: {
          id: nodeId, // BoxNode expects data.id
          boxId: q.id,
          label: q.title,
          prompt: q.prompt,
          type: BOX_TYPES.MEANINGMAKING,
          status: i === 0 ? BOX_STATUS.ACTIVE : BOX_STATUS.PENDING,
          content: '',
          iterationRound,
          onActivate: (id) => setActiveBoxId(id),
          onChange: (id, value) => handleContentChange(id, value),
          onComplete: (id) => handleComplete(id)
        }
      };
    });

    // Connect from previous tension boxes
    const edges = [];
    const tensionBoxIds = sessionData.tensions.map(t => `box${t.id}`);

    tensionBoxIds.forEach(sourceId => {
      nodes[0] && edges.push({
        id: `e-${sourceId}-${nodes[0].id}`,
        source: sourceId,
        target: nodes[0].id,
        type: 'smoothstep',
        style: { stroke: '#eeeae6', strokeOpacity: 1 }
      });
    });

    return { nodes, edges };
  } catch (error) {
    console.error('Failed to generate iteration questions:', error);
    return { nodes: [], edges: [] };
  }
};

/**
 * Generate final decision box
 */
export const generateDecisionBoxWithAI = async (
  handleContentChange,
  handleComplete,
  setActiveBoxId,
  precedingBoxIds,
  startY = 1600, // Default Y if not provided
  tensionNodes = [] // Tension nodes for edge generation
) => {
  // Center the decision box horizontally
  const centerX = 735; // Same as synthesis for consistency
  const boxWidth = 280;
  const xPos = centerX - boxWidth / 2;

  const node = {
    id: 'boxFinal',
    type: 'customBox',
    position: { x: xPos, y: startY }, // Use relative Y position, centered X
    data: {
      id: 'boxFinal', // BoxNode expects data.id
      boxId: 'FINAL',
      label: 'Your Decision',
      prompt: 'Based on everything you\'ve explored, what is your decision? What\'s your first concrete action step?',
      type: BOX_TYPES.DECISION,
      status: BOX_STATUS.ACTIVE,
      content: '',
      onActivate: (id) => setActiveBoxId(id),
      onChange: (id, value) => handleContentChange(id, value),
      onComplete: (id) => handleComplete(id)
    }
  };

  // Generate edges using reusable helper if tension nodes provided
  const edges = tensionNodes && tensionNodes.length > 0
    ? generateSectionEdges(precedingBoxIds, [node], 1)
    : precedingBoxIds.map(sourceId => ({
        id: `e-${sourceId}-final`,
        source: sourceId,
        target: 'boxFinal',
        type: 'smoothstep',
        style: { stroke: '#eeeae6', strokeOpacity: 1 }
      }));

  return { node, edges };
};

// ===========================
// Fallback generators (default questions)
// ===========================

const generateDefaultContextBoxes = (handleContentChange, handleComplete, setActiveBoxId) => {
  const boxes = [
    { id: 'box1a', boxId: '1a', label: 'Employment', prompt: "What's your current employment status and income?" },
    { id: 'box1b', boxId: '1b', label: 'Financial', prompt: "How much financial runway do you have?" },
    { id: 'box1c', boxId: '1c', label: 'Skills', prompt: "What are your main skills and experience?" },
    { id: 'box1d', boxId: '1d', label: 'Opportunity', prompt: "Do you have a specific idea or opportunity?" }
  ];

  const idealPositions = getIdealPositions();

  const nodes = boxes.map((box, i) => ({
    ...box,
    type: 'customBox',
    position: idealPositions[box.id],
    data: {
      id: box.id, // BoxNode expects data.id
      boxId: box.boxId,
      label: box.label,
      prompt: box.prompt,
      type: BOX_TYPES.CONTEXT,
      status: i === 0 ? BOX_STATUS.ACTIVE : BOX_STATUS.PENDING,
      content: '',
      onActivate: (id) => setActiveBoxId(id),
      onChange: (id, value) => handleContentChange(id, value),
      onComplete: (id) => handleComplete(id)
    }
  }));

  const edges = nodes.map(node => ({
    id: `e-box0-${node.id}`,
    source: 'box0',
    target: node.id,
    type: 'smoothstep',
    style: { stroke: '#eeeae6', strokeOpacity: 1 }
  }));

  return { nodes, edges };
};

const generateDefaultMeaningmakingBoxes = (handleContentChange, handleComplete, setActiveBoxId) => {
  const boxes = [
    { id: 'box2a', boxId: '2a', label: 'Success Vision', prompt: "What would make this the right decision in 5 years?" },
    { id: 'box2b', boxId: '2b', label: 'Failure Fear', prompt: "What's the worst outcome and why would it devastate you?" },
    { id: 'box2c', boxId: '2c', label: 'Sacrifice Ranking', prompt: "Rank what you're willing vs unwilling to sacrifice." },
    { id: 'box2d', boxId: '2d', label: 'Work Energy', prompt: "What work energizes vs drains you?" },
    { id: 'box2e', boxId: '2e', label: 'Impact vs Income', prompt: "High pay but meaningless OR low pay but meaningful?" },
    { id: 'box2f', boxId: '2f', label: 'Risk Tolerance', prompt: "Where's your real risk boundary?" }
  ];

  const idealPositions = getIdealPositions();

  const nodes = boxes.map((box, i) => ({
    ...box,
    type: 'customBox',
    position: idealPositions[box.id],
    data: {
      id: box.id, // BoxNode expects data.id
      boxId: box.boxId,
      label: box.label,
      prompt: box.prompt,
      type: BOX_TYPES.MEANINGMAKING,
      status: i === 0 ? BOX_STATUS.ACTIVE : BOX_STATUS.PENDING,
      content: '',
      onActivate: (id) => setActiveBoxId(id),
      onChange: (id, value) => handleContentChange(id, value),
      onComplete: (id) => handleComplete(id)
    }
  }));

  const edges = [];
  ['box1a', 'box1b', 'box1c', 'box1d'].forEach(sourceId => {
    ['box2a', 'box2b'].forEach(targetId => {
      edges.push({
        id: `e-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        type: 'smoothstep',
        style: { stroke: '#eeeae6', strokeOpacity: 1 }
      });
    });
  });

  return { nodes, edges };
};

const generateDefaultResearchBoxes = (setActiveBoxId) => {
  const idealPositions = getIdealPositions();

  const boxes = [
    {
      id: 'box3a',
      boxId: '3a',
      label: 'Market Data',
      content: '• Market growing 15% YoY\n• 500+ competitors\n• Average CAC: $150',
      position: idealPositions['box3a']
    },
    {
      id: 'box3b',
      boxId: '3b',
      label: 'Case Studies',
      content: '• 18-24 months to $100k ARR\n• 80% kept day job initially',
      position: idealPositions['box3b']
    },
    {
      id: 'box3c',
      boxId: '3c',
      label: 'Financial Model',
      content: '• Break-even: Month 16-20\n• Required runway: $150k',
      position: idealPositions['box3c']
    },
    {
      id: 'box3d',
      boxId: '3d',
      label: 'Alternatives',
      content: '• Consulting model\n• Productized services\n• Partnership options',
      position: idealPositions['box3d']
    }
  ];

  const nodes = boxes.map(box => ({
    ...box,
    type: 'customBox',
    data: {
      id: box.id, // BoxNode expects data.id
      boxId: box.boxId,
      label: box.label,
      type: BOX_TYPES.RESEARCH,
      status: BOX_STATUS.COMPLETE,
      content: box.content,
      readOnly: true,
      onActivate: (id) => setActiveBoxId(id)
    }
  }));

  const edges = [];
  ['box2a', 'box2b', 'box2c', 'box2d', 'box2e', 'box2f'].forEach(sourceId => {
    ['box3a', 'box3b'].forEach(targetId => {
      if (Math.random() > 0.5) {
        edges.push({
          id: `e-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: 'smoothstep',
          style: { stroke: '#eeeae6', strokeOpacity: 1 }
        });
      }
    });
  });

  return { nodes, edges, completedIds: boxes.map(b => b.id) };
};

const generateDefaultSynthesisBox = (handleContentChange, handleComplete, setActiveBoxId, startY = 1100, researchNodes = []) => {
  // Center the synthesis box horizontally (aligned with research section)
  const centerX = 735; // Adjusted to center better
  const boxWidth = 280;
  const xPos = centerX - boxWidth / 2;

  const node = {
    id: 'box4',
    type: 'customBox',
    position: { x: xPos, y: startY }, // Use relative Y position, centered X
    data: {
      id: 'box4', // BoxNode expects data.id
      boxId: '4',
      label: 'Core Non-Negotiables',
      prompt: 'What are your 3-5 absolute requirements for any path forward?',
      type: BOX_TYPES.SYNTHESIS,
      status: BOX_STATUS.ACTIVE,
      content: '',
      onActivate: (id) => setActiveBoxId(id),
      onChange: (id, value) => handleContentChange(id, value),
      onComplete: (id) => handleComplete(id)
    }
  };

  // Generate edges using reusable helper if research nodes provided
  let edges;
  if (researchNodes && researchNodes.length > 0) {
    const researchBoxIds = researchNodes.map(n => n.id);
    edges = generateSectionEdges(researchBoxIds, [node], 1);
  } else {
    // Fallback: hardcoded edge generation for backwards compatibility
    edges = ['box3a', 'box3b', 'box3c'].map(sourceId => ({
      id: `e-${sourceId}-box4`,
      source: sourceId,
      target: 'box4',
      type: 'smoothstep',
      style: { stroke: '#eeeae6', strokeOpacity: 1 }
    }));
  }

  return { node, edges };
};

const generateDefaultTensionBoxes = (handleContentChange, handleComplete, setActiveBoxId) => {
  const idealPositions = getIdealPositions();

  const boxes = [
    {
      id: 'box5a',
      boxId: '5a',
      label: 'Time vs Reality',
      prompt: 'How do you reconcile urgency with the 2+ year timeline?',
      position: idealPositions['box5a']
    },
    {
      id: 'box5b',
      boxId: '5b',
      label: 'Income vs Risk',
      prompt: 'Is your risk tolerance aligned with income expectations?',
      position: idealPositions['box5b']
    },
    {
      id: 'box5c',
      boxId: '5c',
      label: 'Control vs Capability',
      prompt: 'Full control with limits OR shared control with more capability?',
      position: idealPositions['box5c']
    }
  ];

  const nodes = boxes.map((box, i) => ({
    ...box,
    type: 'customBox',
    data: {
      id: box.id, // BoxNode expects data.id
      boxId: box.boxId,
      label: box.label,
      prompt: box.prompt,
      type: BOX_TYPES.TENSION,
      status: i === 0 ? BOX_STATUS.ACTIVE : BOX_STATUS.PENDING,
      content: '',
      onActivate: (id) => setActiveBoxId(id),
      onChange: (id, value) => handleContentChange(id, value),
      onComplete: (id) => handleComplete(id)
    }
  }));

  const edges = boxes.map(box => ({
    id: `e-box4-${box.id}`,
    source: 'box4',
    target: box.id,
    type: 'smoothstep',
    style: { stroke: '#eeeae6', strokeOpacity: 1 }
  }));

  return { nodes, edges };
};