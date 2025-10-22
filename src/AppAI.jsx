/**
 * AI-Enhanced Meaningmaking Canvas App
 * =====================================
 * Integrates AI generation with the existing canvas layout.
 */

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import PromptPanel from './components/PromptPanel';
import { useCanvasStateAI } from './hooks/useCanvasStateAI';

function AppAI() {
  const canvasRef = useRef(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Use AI-enhanced state management
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    userResponses,
    completedBoxes,
    currentStage,
    activeBoxId,
    iterationRound,
    isAIThinking,
    aiThinkingText,
    boxPrompts,
    showIterationChoice,
    initialize,
    setActiveBoxId,
    handleIterationChoice,
    exportSession,
    setReactFlowInstance,
    reactFlowInstanceRef
  } = useCanvasStateAI();

  // Initialize canvas on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeNode = React.useMemo(() => {
    const node = nodes.find(n => n.id === activeBoxId);
    console.log(`🔍 [ACTIVE NODE] activeBoxId: ${activeBoxId}, found node:`, node?.id);
    return node;
  }, [nodes, activeBoxId]);

  const handleResetView = useCallback(() => {
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.resetView();
      }
    }, 100);
  }, []);

  const handleExport = useCallback(() => {
    exportSession();
  }, [exportSession]);

  const handleNewCanvas = useCallback(() => {
    window.location.reload();
  }, []);

  const handleFocusBox = useCallback((boxId) => {
    console.log(`🎯 [MINIMAP FOCUS] Focusing on box: ${boxId}`);
    setActiveBoxId(boxId);

    // Use the ReactFlow instance for smooth zoom and pan
    setTimeout(() => {
      const node = nodes.find(n => n.id === boxId);
      if (node && reactFlowInstanceRef.current?.setCenter) {
        // Calculate box center
        const boxWidth = 280; // Approximate box width
        const boxHeight = 140; // Approximate box height
        const centerX = node.position.x + boxWidth / 2;
        const centerY = node.position.y + boxHeight / 2;

        console.log(`📜 [MINIMAP SCROLL] Scrolling to (${centerX}, ${centerY}) with zoom`);
        reactFlowInstanceRef.current.setCenter(centerX, centerY, { duration: 800, zoom: 1 });
      }
    }, 50);
  }, [setActiveBoxId, nodes, reactFlowInstanceRef]);

  return (
    <div className="flex h-screen bg-background">
      <PromptPanel
        activeBoxId={activeBoxId}
        activeNode={activeNode}
        responses={userResponses}
        completedBoxes={completedBoxes}
        nodes={nodes}
        currentRound={iterationRound}
        showIterationChoice={showIterationChoice}
        onIteration={() => handleIterationChoice('ITERATE')}
        onDecide={() => handleIterationChoice('DECIDE')}
        onFocusBox={handleFocusBox}
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        isGenerating={isAIThinking}
        generationMessage={aiThinkingText}
      />

      <Canvas
        ref={canvasRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        currentStage={currentStage}
        onExport={handleExport}
        onNewCanvas={handleNewCanvas}
        onResetView={handleResetView}
        onReactFlowInit={setReactFlowInstance}
      />

      </div>
  );
}

export default AppAI;