import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { BOX_TYPES, BOX_STATUS } from '../constants';
import * as nodeGenerator from '../utils/nodeGenerator';
import * as aiNodeGen from '../utils/aiNodeGenerator';
import { getIdealPositions } from '../utils/dynamicPositioning';

// UI TESTING MODE: Set to true to see all boxes at once with ideal positioning
// NOTE: This is for UI development only - set to false for production
const UI_TESTING_MODE = false;

// AI MODE: Set to true to use AI-generated questions instead of hardcoded ones
const AI_MODE = true;

const getInitialNodes = () => {
  // In AI mode, start with just the root box
  if (AI_MODE) {
    return [
      {
        id: 'box0',
        type: 'customBox',
        position: { x: 550, y: 20 },
        data: {
          boxId: '0',
          label: 'Problem',
          type: BOX_TYPES.ROOT,
          status: BOX_STATUS.ACTIVE,
          content: '',
          prompt: "What's the decision or problem you're facing?"
        }
      }
    ];
  }

  // Original hardcoded nodes for non-AI mode
  return [
    {
      id: 'box0',
      type: 'customBox',
      position: { x: 550, y: 20 },  // Visually centered above context boxes
      data: {
        boxId: '0',
        label: 'Problem',
        type: BOX_TYPES.ROOT,
        status: BOX_STATUS.ACTIVE,
        content: ''
      }
    },
    {
      id: 'box1a',
      type: 'customBox',
      position: { x: 100, y: 250 },  // Increased Y spacing from root box
      data: {
        boxId: '1a',
        label: 'Employment',
        type: BOX_TYPES.CONTEXT,
        status: BOX_STATUS.PENDING,
        content: ''
      }
    },
    {
      id: 'box1b',
      type: 'customBox',
      position: { x: 450, y: 250 },  // 350px horizontal spacing
      data: {
        boxId: '1b',
        label: 'Financial',
        type: BOX_TYPES.CONTEXT,
        status: BOX_STATUS.PENDING,
        content: ''
      }
    },
    {
      id: 'box1c',
      type: 'customBox',
      position: { x: 800, y: 250 },  // 350px horizontal spacing
      data: {
        boxId: '1c',
        label: 'Skills',
        type: BOX_TYPES.CONTEXT,
        status: BOX_STATUS.PENDING,
        content: ''
      }
    },
    {
      id: 'box1d',
      type: 'customBox',
      position: { x: 1150, y: 250 },  // 350px horizontal spacing
      data: {
        boxId: '1d',
        label: 'Idea Status',
        type: BOX_TYPES.CONTEXT,
        status: BOX_STATUS.PENDING,
        content: ''
      }
    }
  ];
};

const getInitialEdges = () => {
  // In AI mode, start with no edges (they'll be generated dynamically)
  if (AI_MODE) return [];

  // Original hardcoded edges for non-AI mode
  return [
    { id: 'e0-1a', source: 'box0', target: 'box1a', type: 'smoothstep', animated: false, style: { stroke: '#eeeae6', strokeOpacity: 0.3 }},
    { id: 'e0-1b', source: 'box0', target: 'box1b', type: 'smoothstep', animated: false, style: { stroke: '#eeeae6', strokeOpacity: 0.3 }},
    { id: 'e0-1c', source: 'box0', target: 'box1c', type: 'smoothstep', animated: false, style: { stroke: '#eeeae6', strokeOpacity: 0.3 }},
    { id: 'e0-1d', source: 'box0', target: 'box1d', type: 'smoothstep', animated: false, style: { stroke: '#eeeae6', strokeOpacity: 0.3 }}
  ];
};

// Get all nodes for UI testing mode - shows complete canvas layout
const getAllNodesForTesting = () => {
  const idealPositions = getIdealPositions();

  const allNodes = [
    // Root
    {
      id: 'box0',
      type: 'customBox',
      position: idealPositions['box0'],
      data: {
        boxId: '0',
        label: 'Problem',
        type: BOX_TYPES.ROOT,
        status: BOX_STATUS.COMPLETE,
        content: 'Should I quit my job to start a SaaS?'
      }
    },
    // Context boxes
    {
      id: 'box1a',
      type: 'customBox',
      position: idealPositions['box1a'],
      data: {
        boxId: '1a',
        label: 'Employment',
        type: BOX_TYPES.CONTEXT,
        status: BOX_STATUS.COMPLETE,
        content: 'Stable job, good salary, but unfulfilling'
      }
    },
    {
      id: 'box1b',
      type: 'customBox',
      position: idealPositions['box1b'],
      data: {
        boxId: '1b',
        label: 'Financial',
        type: BOX_TYPES.CONTEXT,
        status: BOX_STATUS.COMPLETE,
        content: '6 months savings, no debt'
      }
    },
    {
      id: 'box1c',
      type: 'customBox',
      position: idealPositions['box1c'],
      data: {
        boxId: '1c',
        label: 'Skills',
        type: BOX_TYPES.CONTEXT,
        status: BOX_STATUS.COMPLETE,
        content: 'Strong technical skills, weak marketing'
      }
    },
    {
      id: 'box1d',
      type: 'customBox',
      position: idealPositions['box1d'],
      data: {
        boxId: '1d',
        label: 'Idea Status',
        type: BOX_TYPES.CONTEXT,
        status: BOX_STATUS.COMPLETE,
        content: 'MVP ready, 10 beta users'
      }
    },
    // Meaningmaking boxes
    {
      id: 'box2a',
      type: 'customBox',
      position: idealPositions['box2a'],
      data: {
        boxId: '2a',
        label: 'Success Vision',
        type: BOX_TYPES.MEANINGMAKING,
        status: BOX_STATUS.COMPLETE,
        content: 'Financial freedom and creative fulfillment'
      }
    },
    {
      id: 'box2b',
      type: 'customBox',
      position: idealPositions['box2b'],
      data: {
        boxId: '2b',
        label: 'Failure Fear',
        type: BOX_TYPES.MEANINGMAKING,
        status: BOX_STATUS.COMPLETE,
        content: 'Running out of money, having to go back'
      }
    },
    {
      id: 'box2c',
      type: 'customBox',
      position: idealPositions['box2c'],
      data: {
        boxId: '2c',
        label: 'Sacrifice Ranking',
        type: BOX_TYPES.MEANINGMAKING,
        status: BOX_STATUS.COMPLETE,
        content: 'Time > Security > Comfort'
      }
    },
    {
      id: 'box2d',
      type: 'customBox',
      position: idealPositions['box2d'],
      data: {
        boxId: '2d',
        label: 'Work Energy',
        type: BOX_TYPES.MEANINGMAKING,
        status: BOX_STATUS.COMPLETE,
        content: 'Most energized by building products'
      }
    },
    {
      id: 'box2e',
      type: 'customBox',
      position: idealPositions['box2e'],
      data: {
        boxId: '2e',
        label: 'Impact vs Income',
        type: BOX_TYPES.MEANINGMAKING,
        status: BOX_STATUS.COMPLETE,
        content: 'Impact matters more than high income'
      }
    },
    {
      id: 'box2f',
      type: 'customBox',
      position: idealPositions['box2f'],
      data: {
        boxId: '2f',
        label: 'Risk Tolerance',
        type: BOX_TYPES.MEANINGMAKING,
        status: BOX_STATUS.COMPLETE,
        content: 'Moderate - can handle 1 year uncertainty'
      }
    },
    // Research boxes
    {
      id: 'box3a',
      type: 'customBox',
      position: idealPositions['box3a'],
      data: {
        boxId: '3a',
        label: 'Market Data',
        type: BOX_TYPES.RESEARCH,
        status: BOX_STATUS.COMPLETE,
        content: '• Market growing 15% YoY\n• 500+ competitors\n• Average CAC: $150\n• Typical churn: 5% monthly'
      }
    },
    {
      id: 'box3b',
      type: 'customBox',
      position: idealPositions['box3b'],
      data: {
        boxId: '3b',
        label: 'Case Studies',
        type: BOX_TYPES.RESEARCH,
        status: BOX_STATUS.COMPLETE,
        content: '• 18-24 months to $100k ARR\n• 80% kept day job initially\n• Average seed: $500k\n• Solo founders: 15% success'
      }
    },
    {
      id: 'box3c',
      type: 'customBox',
      position: idealPositions['box3c'],
      data: {
        boxId: '3c',
        label: 'Financial Model',
        type: BOX_TYPES.RESEARCH,
        status: BOX_STATUS.COMPLETE,
        content: '• Burn rate: $8k/month\n• Break-even: Month 16-20\n• 1000 customers = $15k MRR\n• Required runway: $150k'
      }
    },
    {
      id: 'box3d',
      type: 'customBox',
      position: idealPositions['box3d'],
      data: {
        boxId: '3d',
        label: 'Skill Analysis',
        type: BOX_TYPES.RESEARCH,
        status: BOX_STATUS.COMPLETE,
        content: '• Strong: Backend, architecture\n• Moderate: Frontend, product\n• Weak: Design, marketing\n• Critical gap: Sales'
      }
    },
    // Synthesis
    {
      id: 'box4',
      type: 'customBox',
      position: idealPositions['box4'],
      data: {
        boxId: '4',
        label: 'Core Non-Negotiables',
        type: BOX_TYPES.SYNTHESIS,
        status: BOX_STATUS.COMPLETE,
        content: 'Must have: autonomy, product ownership, 12-month runway'
      }
    },
    // Tension boxes
    {
      id: 'box5a',
      type: 'customBox',
      position: idealPositions['box5a'],
      data: {
        boxId: '5a',
        label: 'Time vs Reality',
        type: BOX_TYPES.TENSION,
        status: BOX_STATUS.COMPLETE,
        content: 'Want to quit now but stats say keep job initially'
      }
    },
    {
      id: 'box5b',
      type: 'customBox',
      position: idealPositions['box5b'],
      data: {
        boxId: '5b',
        label: 'Income vs Risk',
        type: BOX_TYPES.TENSION,
        status: BOX_STATUS.COMPLETE,
        content: 'Need stable income but growth requires full focus'
      }
    },
    {
      id: 'box5c',
      type: 'customBox',
      position: idealPositions['box5c'],
      data: {
        boxId: '5c',
        label: 'Control vs Capability',
        type: BOX_TYPES.TENSION,
        status: BOX_STATUS.COMPLETE,
        content: 'Want full control but lack key skills'
      }
    },
    // Decision
    {
      id: 'boxFinal',
      type: 'customBox',
      position: idealPositions['boxFinal'],
      data: {
        boxId: 'FINAL',
        label: 'Your Decision',
        type: BOX_TYPES.DECISION,
        status: BOX_STATUS.ACTIVE,
        content: 'Keep job for 6 months while growing to 50 customers'
      }
    }
  ];

  return allNodes;
};

// Get all edges for UI testing mode
const getAllEdgesForTesting = () => [
  // Root to Context
  { id: 'e0-1a', source: 'box0', target: 'box1a', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e0-1b', source: 'box0', target: 'box1b', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e0-1c', source: 'box0', target: 'box1c', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e0-1d', source: 'box0', target: 'box1d', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  // Context to Meaningmaking
  { id: 'e-box1a-box2a', source: 'box1a', target: 'box2a', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box1a-box2b', source: 'box1a', target: 'box2b', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box1b-box2a', source: 'box1b', target: 'box2a', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box1b-box2b', source: 'box1b', target: 'box2b', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box1c-box2a', source: 'box1c', target: 'box2a', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box1c-box2b', source: 'box1c', target: 'box2b', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box1d-box2a', source: 'box1d', target: 'box2a', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box1d-box2b', source: 'box1d', target: 'box2b', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  // Meaningmaking to Research
  { id: 'e-box2a-box3a', source: 'box2a', target: 'box3a', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box2a-box3b', source: 'box2a', target: 'box3b', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box2c-box3a', source: 'box2c', target: 'box3a', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box2e-box3b', source: 'box2e', target: 'box3b', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  // Research to Synthesis
  { id: 'e-box3a-box4', source: 'box3a', target: 'box4', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box3b-box4', source: 'box3b', target: 'box4', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box3c-box4', source: 'box3c', target: 'box4', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box3d-box4', source: 'box3d', target: 'box4', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  // Synthesis to Tensions
  { id: 'e-box4-box5a', source: 'box4', target: 'box5a', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box4-box5b', source: 'box4', target: 'box5b', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box4-box5c', source: 'box4', target: 'box5c', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  // Tensions to Decision
  { id: 'e-box5a-final', source: 'box5a', target: 'boxFinal', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box5b-final', source: 'box5b', target: 'boxFinal', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }},
  { id: 'e-box5c-final', source: 'box5c', target: 'boxFinal', type: 'smoothstep', style: { stroke: '#eeeae6', strokeOpacity: 1 }}
];

export const useCanvasState = (canvasRef) => {
  const [activeBoxId, setActiveBoxId] = useState(UI_TESTING_MODE ? 'boxFinal' : 'box0');
  const [responses, setResponses] = useState({});
  const [currentStage, setCurrentStage] = useState(UI_TESTING_MODE ? 'decision' : 'init');
  const [completedBoxes, setCompletedBoxes] = useState(UI_TESTING_MODE ?
    new Set(['box0', 'box1a', 'box1b', 'box1c', 'box1d', 'box2a', 'box2b', 'box2c', 'box2d', 'box2e', 'box2f', 'box3a', 'box3b', 'box3c', 'box3d', 'box4', 'box5a', 'box5b', 'box5c']) :
    new Set()
  );
  const [totalBoxes, setTotalBoxes] = useState(UI_TESTING_MODE ? 21 : 5);
  const [currentRound, setCurrentRound] = useState(1);
  const [showIterationChoice, setShowIterationChoice] = useState(false);

  // Session data for AI context
  const [sessionData, setSessionData] = useState({
    problem: '',
    contextAnswers: {},
    meaningmakingAnswers: {},
    researchData: [],
    synthesisAnswer: '',
    tensionResolutions: {},
    iterationRound: 1
  });

  // Loading states for AI generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState('');

  const [nodes, setNodes, onNodesChange] = useNodesState(UI_TESTING_MODE ? getAllNodesForTesting() : getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(UI_TESTING_MODE ? getAllEdgesForTesting() : getInitialEdges());

  const handleContentChange = useCallback((nodeId, value) => {
    setResponses(prev => ({ ...prev, [nodeId]: value }));
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, content: value }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Helper function to auto-scroll to new nodes
  const autoScrollToNodes = useCallback((newNodeIds) => {
    // Delay to ensure nodes are rendered before scrolling
    setTimeout(() => {
      if (newNodeIds && newNodeIds.length > 0 && canvasRef?.current?.fitToNodes) {
        // Pan to specific new nodes while maintaining current zoom
        canvasRef.current.fitToNodes(newNodeIds);
      }
    }, 100);
  }, [canvasRef]);

  // Use refs to handle circular dependencies
  const handleCompleteRef = useRef();
  const generateMeaningmakingBoxesRef = useRef();
  const generateResearchBoxesRef = useRef();
  const generateTensionBoxesRef = useRef();

  const generateMeaningmakingBoxes = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = nodeGenerator.generateMeaningmakingBoxes(
      handleContentChange,
      (id) => handleCompleteRef.current?.(id),
      setActiveBoxId
    );

    setNodes(prev => [...prev, ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);
    setTotalBoxes(prev => prev + 6);
    setCurrentStage('meaningmaking');

    // Set active box after nodes are rendered
    setTimeout(() => {
      setActiveBoxId('box2a');
      // Auto-scroll to show newly generated meaningmaking boxes
      autoScrollToNodes(newNodes.map(n => n.id));
    }, 50);
  }, [setNodes, setEdges, handleContentChange, autoScrollToNodes]);

  const generateResearchBoxes = useCallback(() => {
    const { nodes: newNodes, edges: newEdges, completedIds } = nodeGenerator.generateResearchBoxes(
      setActiveBoxId
    );

    setNodes(prev => [...prev, ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);
    setCompletedBoxes(prev => new Set([...prev, ...completedIds]));
    setTotalBoxes(prev => prev + 4);

    // Auto-scroll to show newly generated research boxes
    autoScrollToNodes(newNodes.map(n => n.id));

    // Auto-generate synthesis after a delay
    setTimeout(() => generateSynthesisBox(), 2000);
  }, [setNodes, setEdges, autoScrollToNodes]);

  const generateSynthesisBox = useCallback(() => {
    const { node, edges: newEdges } = nodeGenerator.generateSynthesisBox(
      handleContentChange,
      (id) => handleCompleteRef.current?.(id),
      setActiveBoxId
    );

    setNodes(prev => [...prev, node]);
    setEdges(prev => [...prev, ...newEdges]);
    setTotalBoxes(prev => prev + 1);

    // Set active box after node is rendered
    setTimeout(() => {
      setActiveBoxId('box4');
      // Auto-scroll to show newly generated synthesis box
      autoScrollToNodes([node.id]);
    }, 50);
  }, [setNodes, setEdges, handleContentChange, autoScrollToNodes]);

  const generateTensionBoxes = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = nodeGenerator.generateTensionBoxes(
      handleContentChange,
      (id) => handleCompleteRef.current?.(id),
      setActiveBoxId
    );

    setNodes(prev => [...prev, ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);
    setTotalBoxes(prev => prev + 3);

    // Set active box after nodes are rendered
    setTimeout(() => {
      setActiveBoxId('box5a');
      // Auto-scroll to show newly generated tension boxes
      autoScrollToNodes(newNodes.map(n => n.id));
    }, 50);
  }, [setNodes, setEdges, handleContentChange, autoScrollToNodes]);

  const generateDecisionBox = useCallback(() => {
    const { node, edges: newEdges } = nodeGenerator.generateDecisionBox(
      handleContentChange,
      (id) => handleCompleteRef.current?.(id),
      setActiveBoxId
    );

    setNodes(prev => [...prev, node]);
    setEdges(prev => [...prev, ...newEdges]);
    setActiveBoxId('boxFinal');
    setTotalBoxes(prev => prev + 1);
    setShowIterationChoice(false);

    // Auto-scroll to show newly generated decision box
    autoScrollToNodes([node.id]);
  }, [setNodes, setEdges, handleContentChange, autoScrollToNodes]);

  const handleComplete = useCallback(async (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !responses[nodeId]) return;

    setCompletedBoxes(prev => new Set([...prev, nodeId]));

    // Make edge full opacity when parent completes
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === nodeId) {
          return { ...edge, style: { stroke: '#eeeae6', strokeOpacity: 1 }, animated: false };
        }
        return edge;
      })
    );

    // AI Mode: Dynamic generation based on responses
    if (AI_MODE) {
      const nodeType = node.data.type;
      const answer = responses[nodeId];

      if (nodeType === BOX_TYPES.ROOT) {
        // Store problem and generate context questions with AI
        setSessionData(prev => ({ ...prev, problem: answer }));
        setIsGenerating(true);
        setGenerationMessage('Analyzing your problem to generate relevant questions...');

        try {
          const { nodes: newNodes, edges: newEdges } = await aiNodeGen.generateContextBoxesWithAI(
            answer,
            handleContentChange,
            (id) => handleCompleteRef.current?.(id),
            setActiveBoxId
          );

          setNodes(prev => [...prev, ...newNodes]);
          setEdges(prev => [...prev, ...newEdges]);

          if (newNodes.length > 0) {
            setActiveBoxId(newNodes[0].id);
            autoScrollToNodes(newNodes.map(n => n.id));
          }
        } catch (error) {
          console.error('Failed to generate context questions:', error);
        } finally {
          setIsGenerating(false);
          setGenerationMessage('');
        }
        return; // Exit early for AI mode
      }

      // Handle context box completion - generate meaningmaking boxes when last context box is completed
      if (nodeType === BOX_TYPES.CONTEXT && nodeId === 'box1d') {
        // Store all context answers
        setSessionData(prev => ({ ...prev, contextAnswers: responses }));
        setIsGenerating(true);
        setGenerationMessage('Reflecting on your values to generate deeper questions...');

        try {
          const { nodes: newNodes, edges: newEdges } = await aiNodeGen.generateMeaningmakingBoxesWithAI(
            sessionData.problem,
            responses,
            handleContentChange,
            (id) => handleCompleteRef.current?.(id),
            setActiveBoxId
          );

          setNodes(prev => [...prev, ...newNodes]);
          setEdges(prev => [...prev, ...newEdges]);
          setCurrentStage('meaningmaking');

          if (newNodes.length > 0) {
            setActiveBoxId(newNodes[0].id);
            autoScrollToNodes(newNodes.map(n => n.id));
          }
        } catch (error) {
          console.error('Failed to generate meaningmaking questions:', error);
        } finally {
          setIsGenerating(false);
          setGenerationMessage('');
        }
        return;
      }

      // Handle individual context box completion (not box1d)
      if (nodeType === BOX_TYPES.CONTEXT && nodeId !== 'box1d') {
        // Find the next context box
        const contextBoxes = ['box1a', 'box1b', 'box1c', 'box1d'];
        const currentIndex = contextBoxes.indexOf(nodeId);
        if (currentIndex < contextBoxes.length - 1) {
          setActiveBoxId(contextBoxes[currentIndex + 1]);
        }
        return;
      }

      // Handle meaningmaking box completion - generate research when last meaningmaking box is completed
      if (nodeType === BOX_TYPES.MEANINGMAKING && nodeId === 'box2f') {
        // Store all meaningmaking answers
        setSessionData(prev => ({ ...prev, meaningmakingAnswers: responses }));
        setIsGenerating(true);
        setGenerationMessage('Researching based on what YOU said matters...');

        try {
          const { nodes: newNodes, edges: newEdges, research } = await aiNodeGen.generateResearchBoxesWithAI(
            sessionData.problem,
            responses,
            sessionData.meaningmakingAnswers,
            setActiveBoxId,
            (msg) => setGenerationMessage(msg)
          );

          setNodes(prev => [...prev, ...newNodes]);
          setEdges(prev => [...prev, ...newEdges]);
          setCurrentStage('research');

          // Auto-generate synthesis after research is displayed
          setTimeout(async () => {
            setIsGenerating(true);
            setGenerationMessage('Synthesizing your values with the research findings...');

            try {
              const { node, edges: synthesisEdges } = await aiNodeGen.generateSynthesisBoxWithAI(
                sessionData.problem,
                sessionData.contextAnswers,
                sessionData.meaningmakingAnswers,
                handleContentChange,
                (id) => handleCompleteRef.current?.(id),
                setActiveBoxId,
                undefined,
                newNodes
              );

              setNodes(prev => [...prev, node]);
              setEdges(prev => [...prev, ...synthesisEdges]);
              setCurrentStage('synthesis');
              setActiveBoxId(node.id);
              autoScrollToNodes([node.id]);

              // Auto-generate tensions after synthesis
              setTimeout(async () => {
                setIsGenerating(true);
                setGenerationMessage('Identifying tensions and contradictions in your values vs reality...');

                try {
                  const { nodes: tensionNodes, edges: tensionEdges } = await aiNodeGen.generateTensionBoxesWithAI(
                    {
                      problem: sessionData.problem,
                      context: sessionData.contextAnswers,
                      meaningmaking: sessionData.meaningmakingAnswers,
                      research: research,
                      synthesis: responses['box4'] || ''
                    },
                    handleContentChange,
                    (id) => handleCompleteRef.current?.(id),
                    setActiveBoxId,
                    (msg) => setGenerationMessage(msg),
                    undefined,
                    node
                  );

                  setNodes(prev => [...prev, ...tensionNodes]);
                  setEdges(prev => [...prev, ...tensionEdges]);
                  setCurrentStage('tension');

                  if (tensionNodes.length > 0) {
                    setActiveBoxId(tensionNodes[0].id);
                    autoScrollToNodes(tensionNodes.map(n => n.id));
                  }
                } catch (error) {
                  console.error('Failed to generate tension boxes:', error);
                } finally {
                  setIsGenerating(false);
                  setGenerationMessage('');
                }
              }, 1500);
            } catch (error) {
              console.error('Failed to generate synthesis box:', error);
            } finally {
              setIsGenerating(false);
              setGenerationMessage('');
            }
          }, 2000);

        } catch (error) {
          console.error('Failed to generate research boxes:', error);
        } finally {
          setIsGenerating(false);
          setGenerationMessage('');
        }
        return;
      }

      // Handle individual meaningmaking box completion (not box2f)
      if (nodeType === BOX_TYPES.MEANINGMAKING && nodeId !== 'box2f') {
        // Find the next meaningmaking box
        const meaningBoxes = ['box2a', 'box2b', 'box2c', 'box2d', 'box2e', 'box2f'];
        const currentIndex = meaningBoxes.indexOf(nodeId);
        if (currentIndex < meaningBoxes.length - 1) {
          setActiveBoxId(meaningBoxes[currentIndex + 1]);
        }
        return;
      }

      // Handle synthesis box completion - activate first tension
      if (nodeType === BOX_TYPES.SYNTHESIS && nodeId === 'box4') {
        const tensionBoxes = nodes.filter(n => n.data.type === BOX_TYPES.TENSION);
        if (tensionBoxes.length > 0) {
          setActiveBoxId(tensionBoxes[0].id);
        }
        return;
      }

      // Handle tension box completion
      if (nodeType === BOX_TYPES.TENSION) {
        const tensionBoxes = ['box5a', 'box5b', 'box5c'];
        const currentIndex = tensionBoxes.indexOf(nodeId);
        if (currentIndex < tensionBoxes.length - 1) {
          setActiveBoxId(tensionBoxes[currentIndex + 1]);
        } else {
          // All tensions complete - show iteration choice
          setShowIterationChoice(true);
        }
        return;
      }

      return; // Exit early for AI mode
    }

    // Original hardcoded progression for non-AI mode ONLY
    if (!AI_MODE && nodeId === 'box0') {
      setActiveBoxId('box1a');
    } else if (nodeId === 'box1a') {
      setActiveBoxId('box1b');
    } else if (nodeId === 'box1b') {
      setActiveBoxId('box1c');
    } else if (nodeId === 'box1c') {
      setActiveBoxId('box1d');
    } else if (nodeId === 'box1d') {
      generateMeaningmakingBoxesRef.current?.();
    } else if (nodeId.startsWith('box2')) {
      const meaningBoxes = ['box2a', 'box2b', 'box2c', 'box2d', 'box2e', 'box2f'];
      const currentIndex = meaningBoxes.indexOf(nodeId);
      if (currentIndex < meaningBoxes.length - 1) {
        setActiveBoxId(meaningBoxes[currentIndex + 1]);
      } else {
        generateResearchBoxesRef.current?.();
      }
    } else if (nodeId === 'box4') {
      generateTensionBoxesRef.current?.();
    } else if (nodeId.startsWith('box5')) {
      const tensionBoxes = ['box5a', 'box5b', 'box5c'];
      const currentIndex = tensionBoxes.indexOf(nodeId);
      if (currentIndex < tensionBoxes.length - 1) {
        setActiveBoxId(tensionBoxes[currentIndex + 1]);
      } else {
        setShowIterationChoice(true);
      }
    } else if (nodeId === 'boxFinal') {
      setCurrentStage('complete');
    }
  }, [nodes, responses, setEdges, handleContentChange, setActiveBoxId, autoScrollToNodes, sessionData, setNodes]);

  // Assign functions to refs to handle circular dependencies
  useEffect(() => {
    handleCompleteRef.current = handleComplete;
    generateMeaningmakingBoxesRef.current = generateMeaningmakingBoxes;
    generateResearchBoxesRef.current = generateResearchBoxes;
    generateTensionBoxesRef.current = generateTensionBoxes;
  }, [handleComplete, generateMeaningmakingBoxes, generateResearchBoxes, generateTensionBoxes]);

  // Update active box status and attach handlers
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: node.id === activeBoxId ? BOX_STATUS.ACTIVE :
                  completedBoxes.has(node.id) ? BOX_STATUS.COMPLETE : BOX_STATUS.PENDING,
          onActivate: (id) => setActiveBoxId(id),
          onChange: handleContentChange,
          onComplete: handleComplete,
          id: node.id
        }
      }))
    );
  }, [activeBoxId, completedBoxes, setNodes, handleContentChange, handleComplete]);

  const handleIteration = useCallback(() => {
    setCurrentRound(prev => prev + 1);
    setShowIterationChoice(false);
    // Would generate new refined meaningmaking questions here
    // For demo, we'll skip to decision
    generateDecisionBox();
  }, [generateDecisionBox]);

  const handleKeyDown = useCallback((e) => {
    const activeNode = nodes.find(n => n.id === activeBoxId);

    // Tab to complete and move to next
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      if (activeNode && activeNode.data.content && activeNode.data.content.length > 0) {
        handleComplete(activeBoxId);
      }
    }
  }, [activeBoxId, nodes, handleComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset all box positions to their ideal/original positions with smooth animation
  const resetPositions = useCallback(() => {
    const idealPositions = getIdealPositions();

    setNodes((nds) =>
      nds.map((node) => {
        const idealPos = idealPositions[node.id];
        if (idealPos) {
          return {
            ...node,
            position: idealPos,
            // Add position transition for smooth animation
            style: {
              ...node.style,
              transition: 'all 0.3s ease-out'
            }
          };
        }
        return node;
      })
    );

    // Remove transition after animation completes
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            transition: undefined
          }
        }))
      );
    }, 350);
  }, [setNodes]);

  return {
    // State
    nodes,
    edges,
    activeBoxId,
    responses,
    currentStage,
    completedBoxes,
    totalBoxes,
    currentRound,
    showIterationChoice,
    isGenerating,
    generationMessage,

    // Handlers
    onNodesChange,
    onEdgesChange,
    handleIteration,
    generateDecisionBox,
    setActiveBoxId,
    resetPositions
  };
};