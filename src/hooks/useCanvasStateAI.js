/**
 * AI-Enhanced Canvas State Management
 * ====================================
 * Manages the entire meaningmaking flow with AI integration.
 * Coordinates between user input, AI generation, and UI updates.
 */

import { useState, useCallback, useRef } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { BOX_TYPES, BOX_STATUS } from '../constants';
import * as aiGen from '../utils/aiNodeGenerator';
import { getIdealPositions } from '../utils/dynamicPositioning';

export const useCanvasStateAI = () => {
  // Core state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [userResponses, setUserResponses] = useState({});
  const [completedBoxes, setCompletedBoxes] = useState(new Set());
  const [currentStage, setCurrentStage] = useState('ROOT');
  const [activeBoxId, setActiveBoxId] = useState('box0');
  const [iterationRound, setIterationRound] = useState(0);

  // ReactFlow viewport control ref
  const reactFlowInstanceRef = useRef(null);

  // AI-specific state
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiThinkingText, setAIThinkingText] = useState('');
  const [sessionData, setSessionData] = useState({
    problem: '',
    context: {},
    meaningmaking: {},
    research: {},
    synthesis: '',
    tensions: []
  });

  // Track box prompts for display
  const [boxPrompts, setBoxPrompts] = useState({});
  const [showIterationChoice, setShowIterationChoice] = useState(false);

  // Use refs to avoid dependency issues
  const handleCompleteRef = useRef();

  // Handle content changes
  const handleContentChange = useCallback((nodeId, content) => {
    console.log(`📝 [CONTENT CHANGE] ${nodeId}: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`);

    setUserResponses(prev => ({
      ...prev,
      [nodeId]: content
    }));

    setNodes(nds =>
      nds.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              content
            }
          };
        }
        return node;
      })
    );
  }, [setNodes, setUserResponses]);

  // Initialize with root box
  const initialize = useCallback(() => {
    console.log('\n🎬 [INITIALIZE] Starting AI-powered meaningmaking canvas');

    const idealPositions = getIdealPositions();
    const rootNode = {
      id: 'box0',
      type: 'customBox',
      position: idealPositions['box0'],
      data: {
        id: 'box0', // BoxNode expects data.id for onChange/onActivate/onComplete
        boxId: '0',
        label: 'Your Decision',
        prompt: 'What decision or problem are you facing?',
        type: BOX_TYPES.ROOT,
        status: BOX_STATUS.ACTIVE,
        content: '',
        onActivate: (id) => setActiveBoxId(id),
        onChange: handleContentChange,
        onComplete: (id) => handleCompleteRef.current?.(id)
      }
    };

    console.log('📦 [NODE CREATED] Root node (box0) at position:', idealPositions['box0']);
    setNodes([rootNode]);
    setEdges([]);
    setActiveBoxId('box0');
    console.log('✅ [INITIALIZE COMPLETE] Canvas ready');
  }, [handleContentChange, setNodes, setEdges, setActiveBoxId]);

  // AI thinking display helper
  const showAIThinking = (message) => {
    setIsAIThinking(true);
    setAIThinkingText(message);
  };

  const hideAIThinking = () => {
    setIsAIThinking(false);
    setAIThinkingText('');
  };

  /**
   * REUSABLE HELPER: Calculate relative Y position for new section
   *
   * Use this when generating ANY new section (meaningmaking, research, synthesis, tensions, etc.)
   * to ensure proper vertical spacing relative to the parent section.
   *
   * @param {Array} parentBoxes - Array of parent section nodes
   * @param {number} parentBoxHeight - Height of parent boxes in pixels
   * @param {number} gap - Vertical gap between sections (default: 150px)
   * @returns {number} Starting Y position for new section
   *
   * @example
   * // For meaningmaking after context
   * const meaningY = calculateRelativeY(contextBoxes, 150, 150);
   *
   * // For research after meaningmaking
   * const researchY = calculateRelativeY(meaningBoxes, 140, 150);
   */
  const calculateRelativeY = useCallback((parentBoxes, parentBoxHeight, gap = 150) => {
    if (!parentBoxes || parentBoxes.length === 0) return 450; // Default if no parent

    const parentYPositions = parentBoxes.map(box => box.position.y);
    const maxParentY = Math.max(...parentYPositions);
    const startY = maxParentY + parentBoxHeight + gap;

    console.log(`📐 [CALC Y] Parent max Y: ${maxParentY}, box height: ${parentBoxHeight}, gap: ${gap} → Start Y: ${startY}`);
    return startY;
  }, []);

  /**
   * REUSABLE HELPER: Auto-scroll to newly generated section (Y-axis only)
   *
   * Use this after generating ANY new section to smoothly scroll the viewport
   * down to show the new boxes. Preserves current X position and zoom level.
   *
   * @param {Array} newNodes - Array of newly generated nodes
   * @param {number} delayMs - Delay before scrolling (default: 300ms to ensure DOM render)
   *
   * @example
   * // After generating meaningmaking boxes
   * scrollToSection(meaningNodes);
   *
   * // After generating research boxes with custom delay
   * scrollToSection(researchNodes, 500);
   */
  const scrollToSection = useCallback((newNodes, delayMs = 300) => {
    setTimeout(() => {
      if (reactFlowInstanceRef.current?.getViewport && reactFlowInstanceRef.current?.setViewport && newNodes.length > 0) {
        const firstBox = newNodes[0];
        const currentViewport = reactFlowInstanceRef.current.getViewport();

        // Calculate viewport Y to show the new section with padding
        const viewportShiftY = -(firstBox.position.y - 100) * currentViewport.zoom;

        const newViewport = {
          x: currentViewport.x,     // Preserve X
          y: viewportShiftY,         // New Y to show section
          zoom: currentViewport.zoom // Preserve zoom
        };

        console.log(`📜 [AUTO-SCROLL] Scrolling to new section at Y: ${firstBox.position.y}`);
        reactFlowInstanceRef.current.setViewport(newViewport, { duration: 800 });
      }
    }, delayMs);
  }, []);

  // Handle box completion with AI integration
  const handleComplete = useCallback(async (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    console.log(`\n✅ [BOX COMPLETE] ${nodeId} (${node.data.type})`);
    console.log('Response:', userResponses[nodeId]);

    // Mark as complete
    setCompletedBoxes(prev => new Set([...prev, nodeId]));
    setNodes(nds =>
      nds.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, status: BOX_STATUS.COMPLETE } }
          : n
      )
    );

    // Store response in session data
    const response = userResponses[nodeId];

    // Handle different box types
    const boxType = node.data.type;
    const boxId = node.data.boxId;

    console.log(`🔄 [PROCESSING] Box type: ${boxType}, Box ID: ${boxId}`);

    // Track if we should auto-advance
    let shouldAutoAdvance = true;

    try {
      switch (boxType) {
        case BOX_TYPES.ROOT:
          await handleRootComplete(response);
          // ROOT explicitly activates the first context box, so don't auto-advance
          shouldAutoAdvance = false;
          break;
        case BOX_TYPES.CONTEXT:
          const shouldSkipAutoAdvance = await handleContextComplete(boxId, response, nodeId);
          if (shouldSkipAutoAdvance) {
            shouldAutoAdvance = false;
          }
          break;
        case BOX_TYPES.MEANINGMAKING:
          const meaningSkipAdvance = await handleMeaningmakingComplete(boxId, response, nodeId);
          if (meaningSkipAdvance) {
            shouldAutoAdvance = false;
          }
          break;
        case BOX_TYPES.SYNTHESIS:
          const synthesisSkipAdvance = await handleSynthesisComplete(response);
          if (synthesisSkipAdvance) {
            shouldAutoAdvance = false;
          }
          break;
        case BOX_TYPES.TENSION:
          await handleTensionComplete(boxId, response, nodeId);
          break;
        case BOX_TYPES.DECISION:
          await handleDecisionComplete(response);
          break;
      }
    } catch (error) {
      console.error('Error handling completion:', error);
      hideAIThinking();
    }

    // Auto-advance to next pending box (only if not ROOT)
    if (shouldAutoAdvance) {
      autoAdvanceToNext();
    }
  }, [nodes, userResponses]); // autoAdvanceToNext uses its own state setters, no dependency needed

  // Assign to ref for use in callbacks
  handleCompleteRef.current = handleComplete;

  // Handle ROOT box completion
  const handleRootComplete = async (problemText) => {
    console.log('\n🌱 [ROOT COMPLETE] Problem:', problemText);

    setSessionData(prev => ({ ...prev, problem: problemText }));

    showAIThinking('Analyzing your problem to generate context questions...');

    console.log('🤖 [AI GENERATION] Generating context boxes...');
    // Generate context boxes with AI
    const { nodes: contextNodes, edges: contextEdges } = await aiGen.generateContextBoxesWithAI(
      problemText,
      handleContentChange,
      (id) => handleCompleteRef.current?.(id), // Use ref to ensure latest handler
      handleActivateBox
    );

    console.log(`✨ [GENERATED] ${contextNodes.length} context boxes`);

    // Store prompts for display
    const prompts = {};
    contextNodes.forEach(node => {
      prompts[node.id] = node.data.prompt;
      console.log(`📌 [PROMPT STORED] ${node.id}: "${node.data.prompt?.substring(0, 50)}..."`);
    });
    setBoxPrompts(prev => ({ ...prev, ...prompts }));
    console.log('📦 [BOX PROMPTS STATE]', prompts);

    setNodes(prev => [...prev, ...contextNodes]);
    setEdges(prev => [...prev, ...contextEdges]);
    setCurrentStage('CONTEXT');

    // Explicitly set the first context box as active
    const firstContextBox = contextNodes.find(n => n.data.status === BOX_STATUS.ACTIVE);
    if (firstContextBox) {
      console.log(`🎯 [EXPLICIT ACTIVATION] Setting active box to: ${firstContextBox.id}`);
      setActiveBoxId(firstContextBox.id);
    }

    console.log('🎯 [STAGE CHANGE] ROOT → CONTEXT');

    hideAIThinking();
  };

  // Handle CONTEXT completion
  const handleContextComplete = async (boxId, response, nodeId) => {
    console.log(`\n📝 [CONTEXT COMPLETE] Box ${boxId} (nodeId: ${nodeId})`);
    setSessionData(prev => ({
      ...prev,
      context: { ...prev.context, [boxId]: response }
    }));

    // Check if all context boxes are complete
    // Include the current nodeId since state update is async
    const contextBoxes = nodes.filter(n => n.data.type === BOX_TYPES.CONTEXT);
    const completedCount = contextBoxes.filter(b => completedBoxes.has(b.id) || b.id === nodeId).length;
    const allContextComplete = contextBoxes.every(box =>
      completedBoxes.has(box.id) || box.id === nodeId
    );
    console.log(`🔍 [CONTEXT CHECK] ${completedCount}/${contextBoxes.length} context boxes complete`);
    console.log(`📊 [CONTEXT BOXES]`, contextBoxes.map(b => `${b.id}(${completedBoxes.has(b.id) ? '✅' : b.id === nodeId ? '⏳' : '❌'})`).join(', '));

    if (allContextComplete) {
      console.log('✅ [ALL CONTEXT COMPLETE] Generating meaningmaking questions...');
      showAIThinking('Generating deep meaningmaking questions based on your context...');

      // Calculate Y position using reusable helper
      const contextBoxHeight = 150; // CONTEXT boxes height
      const meaningmakingStartY = calculateRelativeY(contextBoxes, contextBoxHeight, 150);

      // Generate meaningmaking boxes with AI
      console.log('🤖 [AI GENERATION] Calling generateMeaningmakingBoxesWithAI...');
      const { nodes: meaningNodes, edges: meaningEdges } = await aiGen.generateMeaningmakingBoxesWithAI(
        sessionData.problem,
        sessionData.context,
        handleContentChange,
        (id) => handleCompleteRef.current?.(id), // Use ref to ensure latest handler
        setActiveBoxId,
        meaningmakingStartY
      );

      console.log(`✨ [GENERATED] ${meaningNodes.length} meaningmaking boxes`);

      // Store prompts
      const prompts = {};
      meaningNodes.forEach(node => {
        prompts[node.id] = node.data.prompt;
      });
      setBoxPrompts(prev => ({ ...prev, ...prompts }));

      setNodes(prev => [...prev, ...meaningNodes]);
      setEdges(prev => [...prev, ...meaningEdges]);
      setCurrentStage('MEANINGMAKING');
      console.log('🎯 [STAGE CHANGE] CONTEXT → MEANINGMAKING');

      // Explicitly activate the first meaningmaking box
      const firstMeaningBox = meaningNodes.find(n => n.data.status === BOX_STATUS.ACTIVE);
      if (firstMeaningBox) {
        console.log(`🎯 [EXPLICIT ACTIVATION] Setting active box to: ${firstMeaningBox.id}`);
        setActiveBoxId(firstMeaningBox.id);
      }

      hideAIThinking();

      // Auto-scroll using reusable helper
      scrollToSection(meaningNodes);

      // Return true to skip auto-advance
      return true;
    }

    // Return false to allow auto-advance
    return false;
  };

  // Handle MEANINGMAKING completion
  const handleMeaningmakingComplete = async (boxId, response, nodeId) => {
    console.log(`\n📝 [MEANINGMAKING COMPLETE] Box ${boxId}`);
    setSessionData(prev => ({
      ...prev,
      meaningmaking: { ...prev.meaningmaking, [boxId]: response }
    }));

    // Check if all meaningmaking boxes are complete
    // Include current nodeId since state update is async
    const meaningBoxes = nodes.filter(n =>
      n.data.type === BOX_TYPES.MEANINGMAKING &&
      (!n.data.iterationRound || n.data.iterationRound === iterationRound)
    );
    const allMeaningComplete = meaningBoxes.every(box =>
      completedBoxes.has(box.id) || box.id === nodeId
    );
    console.log(`🔍 [MEANINGMAKING CHECK] ${meaningBoxes.filter(b => completedBoxes.has(b.id) || b.id === nodeId).length}/${meaningBoxes.length} meaningmaking boxes complete`);

    if (allMeaningComplete) {
      if (currentStage === 'MEANINGMAKING') {
        console.log('✅ [ALL MEANINGMAKING COMPLETE] First pass - generating research...');
        // First time through - generate research
        showAIThinking('Researching relevant data based on your values...');

        // Calculate Y position using reusable helper
        const meaningBoxHeight = 140; // Meaningmaking boxes are 140px tall
        const researchStartY = calculateRelativeY(meaningBoxes, meaningBoxHeight, 150);

        console.log('🤖 [AI GENERATION] Calling generateResearchBoxesWithAI...');
        const { nodes: researchNodes, edges: researchEdges, research } =
          await aiGen.generateResearchBoxesWithAI(
            sessionData.problem,
            sessionData.context,
            sessionData.meaningmaking,
            setActiveBoxId,
            setAIThinkingText,
            researchStartY // Pass calculated Y position
          );

        console.log(`✨ [GENERATED] ${researchNodes.length} research boxes`);
        setSessionData(prev => ({ ...prev, research }));
        setNodes(prev => [...prev, ...researchNodes]);
        setEdges(prev => [...prev, ...researchEdges]);
        setCompletedBoxes(prev => {
          const newSet = new Set(prev);
          researchNodes.forEach(n => newSet.add(n.id));
          return newSet;
        });

        // Auto-scroll to research section using reusable helper
        scrollToSection(researchNodes);

        // Calculate Y position for synthesis box using reusable helper
        const researchBoxHeight = 280; // Research boxes are tall (280px)
        const synthesisStartY = calculateRelativeY(researchNodes, researchBoxHeight, 80); // Smaller gap since research boxes are tall

        // Generate synthesis box
        console.log('🤖 [AI GENERATION] Calling generateSynthesisBoxWithAI...');
        const { node: synthNode, edges: synthEdges, synthesisData } =
          await aiGen.generateSynthesisBoxWithAI(
            sessionData.problem,
            sessionData.context,
            sessionData.meaningmaking,
            handleContentChange,
            (id) => handleCompleteRef.current?.(id), // Use ref for Tab support
            setActiveBoxId,
            synthesisStartY, // Pass calculated Y position
            researchNodes // Pass research nodes for edge generation
          );

        console.log(`✨ [GENERATED] Synthesis box: ${synthNode.id}`);
        setBoxPrompts(prev => ({ ...prev, [synthNode.id]: synthNode.data.prompt }));
        setNodes(prev => [...prev, synthNode]);
        setEdges(prev => [...prev, ...synthEdges]);
        setCurrentStage('SYNTHESIS');
        console.log('🎯 [STAGE CHANGE] MEANINGMAKING → SYNTHESIS');

        hideAIThinking();
        return true; // Skip auto-advance, research section was generated
      } else if (currentStage === 'ITERATION') {
        console.log('🔄 [ITERATION COMPLETE] Generating new cycle...');
        // Iteration complete - generate new research and tensions
        await generateNewIterationCycle();
        return true; // Skip auto-advance, new cycle was generated
      }
    }

    return false; // Allow auto-advance for individual box completion
  };

  // Handle SYNTHESIS completion
  const handleSynthesisComplete = async (synthesisText) => {
    console.log('\n📝 [SYNTHESIS COMPLETE]');
    console.log('Synthesis:', synthesisText.substring(0, 100) + '...');
    setSessionData(prev => ({ ...prev, synthesis: synthesisText }));

    showAIThinking('Identifying tensions between your values and reality...');

    // Calculate Y position for tension boxes using reusable helper
    const synthNode = nodes.find(n => n.id === 'box4');
    const synthesisBoxHeight = 160; // Synthesis box is 160px tall
    const tensionStartY = calculateRelativeY([synthNode], synthesisBoxHeight, 150);

    // Generate tension boxes with AI
    console.log('🤖 [AI GENERATION] Calling generateTensionBoxesWithAI...');
    const updatedSessionData = { ...sessionData, synthesis: synthesisText };
    const { nodes: tensionNodes, edges: tensionEdges, tensions } =
      await aiGen.generateTensionBoxesWithAI(
        updatedSessionData,
        handleContentChange,
        (id) => handleCompleteRef.current?.(id), // Use ref for Tab support
        setActiveBoxId,
        setAIThinkingText,
        tensionStartY, // Pass calculated Y position
        synthNode // Pass synthesis node for edge generation
      );

    console.log(`✨ [GENERATED] ${tensionNodes.length} tension boxes`);
    setSessionData(prev => ({ ...prev, tensions }));

    // Store prompts
    const prompts = {};
    tensionNodes.forEach(node => {
      prompts[node.id] = node.data.prompt;
    });
    setBoxPrompts(prev => ({ ...prev, ...prompts }));

    setNodes(prev => [...prev, ...tensionNodes]);
    setEdges(prev => [...prev, ...tensionEdges]);
    setCurrentStage('TENSIONS');
    console.log('🎯 [STAGE CHANGE] SYNTHESIS → TENSIONS');

    // Explicitly activate the first tension box
    const firstTensionBox = tensionNodes.find(n => n.data.status === 'ACTIVE');
    if (firstTensionBox) {
      setActiveBoxId(firstTensionBox.id);
      console.log(`🎯 [EXPLICIT ACTIVATION] Setting active box to: ${firstTensionBox.id}`);
    }

    hideAIThinking();
    return true; // Skip auto-advance, tension boxes were generated
  };

  // Handle TENSION completion
  const handleTensionComplete = async (boxId, response, nodeId) => {
    console.log(`\n📝 [TENSION COMPLETE] Box ${boxId}`);
    // Update tension responses
    const tensionIndex = sessionData.tensions.findIndex(t => t.id === boxId);
    if (tensionIndex !== -1) {
      const updatedTensions = [...sessionData.tensions];
      updatedTensions[tensionIndex].response = response;
      setSessionData(prev => ({ ...prev, tensions: updatedTensions }));
      console.log(`✅ [TENSION UPDATED] Stored response for tension ${tensionIndex + 1}`);
    }

    // Check if all tension boxes are complete
    // Include current nodeId since state update is async
    const tensionBoxes = nodes.filter(n => n.data.type === BOX_TYPES.TENSION);
    const allTensionsComplete = tensionBoxes.every(box =>
      completedBoxes.has(box.id) || box.id === nodeId
    );
    console.log(`🔍 [TENSION CHECK] ${tensionBoxes.filter(b => completedBoxes.has(b.id) || b.id === nodeId).length}/${tensionBoxes.length} tension boxes complete`);

    if (allTensionsComplete) {
      console.log('✅ [ALL TENSIONS COMPLETE] Showing iteration choice modal');
      // Trigger the iteration choice modal
      setShowIterationChoice(true);
    }
  };

  // Handle iteration choice
  const handleIterationChoice = async (choice) => {
    console.log(`\n🔀 [ITERATION CHOICE] User chose: ${choice}`);
    setShowIterationChoice(false); // Close the modal

    if (choice === 'ITERATE') {
      const newRound = iterationRound + 1;
      console.log(`🔄 [ITERATION START] Starting round ${newRound}`);
      setIterationRound(newRound);
      setCurrentStage('ITERATION');

      showAIThinking('Generating deeper questions based on tensions identified...');

      console.log('🤖 [AI GENERATION] Calling generateIterationQuestionsWithAI...');
      const { nodes: iterationNodes, edges: iterationEdges } =
        await aiGen.generateIterationQuestionsWithAI(
          sessionData,
          handleContentChange,
          handleComplete,
          setActiveBoxId,
          newRound
        );

      console.log(`✨ [GENERATED] ${iterationNodes.length} iteration questions for round ${newRound}`);

      // Store prompts
      const prompts = {};
      iterationNodes.forEach(node => {
        prompts[node.id] = node.data.prompt;
      });
      setBoxPrompts(prev => ({ ...prev, ...prompts }));

      setNodes(prev => [...prev, ...iterationNodes]);
      setEdges(prev => [...prev, ...iterationEdges]);
      console.log('🎯 [STAGE CHANGE] TENSIONS → ITERATION');

      hideAIThinking();
    } else {
      console.log('✅ [NO ITERATION] Proceeding to final decision');
      generateDecisionBox();
    }
  };

  // Generate final decision box
  const generateDecisionBox = async () => {
    const tensionNodes = nodes.filter(n => n.data.type === BOX_TYPES.TENSION);
    const tensionBoxIds = tensionNodes.map(n => n.id);

    // Calculate Y position for decision box using reusable helper
    const tensionBoxHeight = 140; // Tension boxes are 140px tall
    const decisionStartY = calculateRelativeY(tensionNodes, tensionBoxHeight, 150);

    const { node: decisionNode, edges: decisionEdges } =
      await aiGen.generateDecisionBoxWithAI(
        handleContentChange,
        (id) => handleCompleteRef.current?.(id), // Use ref for Tab support
        setActiveBoxId,
        tensionBoxIds,
        decisionStartY, // Pass calculated Y position
        tensionNodes // Pass tension nodes for edge generation
      );

    setBoxPrompts(prev => ({ ...prev, [decisionNode.id]: decisionNode.data.prompt }));
    setNodes(prev => [...prev, decisionNode]);
    setEdges(prev => [...prev, ...decisionEdges]);
    setCurrentStage('DECISION');
  };

  // Handle DECISION completion
  const handleDecisionComplete = async (decision) => {
    console.log('\n🎉 [DECISION COMPLETE] Final decision made!');
    console.log('Decision:', decision);
    setSessionData(prev => ({ ...prev, decision }));
    // Canvas is complete!
    console.log('✅ [MEANINGMAKING COMPLETE] Journey finished!');
    console.log('📊 [SESSION SUMMARY]', {
      problem: sessionData.problem,
      contextAnswers: Object.keys(sessionData.context).length,
      meaningmakingAnswers: Object.keys(sessionData.meaningmaking).length,
      tensionsResolved: sessionData.tensions.length,
      iterationRounds: iterationRound,
      finalDecision: decision.substring(0, 100) + '...'
    });
    // Could trigger export or celebration here
  };

  // Generate new iteration cycle
  const generateNewIterationCycle = async () => {
    showAIThinking('Researching based on your refined understanding...');

    // Generate new research based on iteration answers
    const iterationAnswers = {};
    nodes
      .filter(n => n.data.iterationRound === iterationRound)
      .forEach(n => {
        iterationAnswers[n.data.boxId] = userResponses[n.id];
      });

    // Merge with existing meaningmaking
    const updatedMeaningmaking = {
      ...sessionData.meaningmaking,
      ...iterationAnswers
    };

    const { nodes: researchNodes, edges: researchEdges, research } =
      await aiGen.generateResearchBoxesWithAI(
        sessionData.problem,
        sessionData.context,
        updatedMeaningmaking,
        setActiveBoxId,
        setAIThinkingText
      );

    setSessionData(prev => ({
      ...prev,
      research: { ...prev.research, ...research },
      meaningmaking: updatedMeaningmaking
    }));

    setNodes(prev => [...prev, ...researchNodes]);
    setEdges(prev => [...prev, ...researchEdges]);
    setCompletedBoxes(prev => {
      const newSet = new Set(prev);
      researchNodes.forEach(n => newSet.add(n.id));
      return newSet;
    });

    // Generate new synthesis
    const { node: synthNode, edges: synthEdges } =
      await aiGen.generateSynthesisBoxWithAI(
        sessionData.problem,
        sessionData.context,
        updatedMeaningmaking,
        handleContentChange,
        handleComplete,
        setActiveBoxId
      );

    synthNode.id = `box4_iter${iterationRound}`;
    synthNode.data.boxId = `4_iter${iterationRound}`;

    setBoxPrompts(prev => ({ ...prev, [synthNode.id]: synthNode.data.prompt }));
    setNodes(prev => [...prev, synthNode]);
    setEdges(prev => [...prev, ...synthEdges]);
    setCurrentStage('SYNTHESIS');

    hideAIThinking();
  };

  // Handle activating a box (when user clicks on it)
  const handleActivateBox = useCallback((boxId) => {
    console.log(`👆 [MANUAL ACTIVATION] User clicked on box: ${boxId}`);
    setActiveBoxId(boxId);

    // Update the node status to active (works for both pending and completed boxes)
    setNodes(nds => {
      const targetNode = nds.find(n => n.id === boxId);
      if (!targetNode) return nds;

      // Activate if it's pending OR completed (allow re-editing)
      if (targetNode.data.status === BOX_STATUS.PENDING || targetNode.data.status === BOX_STATUS.COMPLETE) {
        console.log(`🔄 [STATUS CHANGE] ${boxId}: ${targetNode.data.status} → active`);
        return nds.map(n =>
          n.id === boxId
            ? { ...n, data: { ...n.data, status: BOX_STATUS.ACTIVE } }
            : n
        );
      }

      return nds;
    });
  }, [setActiveBoxId, setNodes]);

  // Auto-advance to next pending box
  const autoAdvanceToNext = useCallback(() => {
    // Use setTimeout to ensure state updates have been processed
    setTimeout(() => {
      setNodes(nds => {
        const pendingNodes = nds
          .filter(n => n.data.status === BOX_STATUS.PENDING)
          .sort((a, b) => {
            // Sort by boxId to ensure correct order (1a, 1b, 1c, 1d)
            const aId = a.data.boxId || a.id;
            const bId = b.data.boxId || b.id;
            return aId.localeCompare(bId);
          });

        if (pendingNodes.length > 0) {
          const nextNode = pendingNodes[0];
          console.log(`\n➡️ [AUTO-ADVANCE] Moving to next box: ${nextNode.id} (${nextNode.data.type})`);
          setActiveBoxId(nextNode.id);

          // Update the next node to active
          const updatedNodes = nds.map(n =>
            n.id === nextNode.id
              ? { ...n, data: { ...n.data, status: BOX_STATUS.ACTIVE } }
              : n
          );

          console.log(`✅ [ACTIVATED] Box ${nextNode.id} is now active`);
          return updatedNodes;
        } else {
          console.log('ℹ️ [AUTO-ADVANCE] No pending boxes to advance to');
          return nds;
        }
      });
    }, 100);
  }, [setNodes, setActiveBoxId]);

  // Export session data
  const exportSession = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      problem: sessionData.problem,
      context: sessionData.context,
      meaningmaking: sessionData.meaningmaking,
      research: sessionData.research,
      synthesis: sessionData.synthesis,
      tensions: sessionData.tensions,
      decision: sessionData.decision,
      iterationRounds: iterationRound,
      allResponses: userResponses
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meaningmaking-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Set ReactFlow instance for viewport control
  const setReactFlowInstance = useCallback((instance) => {
    reactFlowInstanceRef.current = instance;
    console.log('✅ [REACTFLOW] Instance connected for auto-scroll');
  }, []);

  return {
    // Core state
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    userResponses,
    completedBoxes,
    currentStage,
    activeBoxId,
    iterationRound,

    // AI state
    isAIThinking,
    aiThinkingText,
    sessionData,
    boxPrompts,
    showIterationChoice,

    // Methods
    initialize,
    handleContentChange,
    handleComplete,
    setActiveBoxId,
    handleIterationChoice,
    exportSession,
    setReactFlowInstance,
    reactFlowInstanceRef
  };
};