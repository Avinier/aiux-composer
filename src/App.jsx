import React, { useRef, useCallback, useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import PromptPanel from './components/PromptPanel';
import { FoundationModal } from './components/FoundationModal';
import { useCanvasState } from './hooks/useCanvasState';

function App() {
  const canvasRef = useRef(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [foundationComplete, setFoundationComplete] = useState(false);

  // Check if foundation has been shown before (persist across sessions)
  useEffect(() => {
    const foundationShown = localStorage.getItem('foundationShown');
    if (foundationShown === 'true') {
      setFoundationComplete(true);
    }
  }, []);

  const handleFoundationComplete = () => {
    setFoundationComplete(true);
    localStorage.setItem('foundationShown', 'true');
  };

  const {
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
    onNodesChange,
    onEdgesChange,
    handleIteration,
    generateDecisionBox,
    setActiveBoxId,
    resetPositions
  } = useCanvasState(canvasRef);

  const activeNode = nodes.find(n => n.id === activeBoxId);

  // Combined reset function that resets positions and fits view
  const handleResetView = useCallback(() => {
    resetPositions();
    // Start zoom shortly after position animation begins for smooth combined effect
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.resetView();
      }
    }, 100);
  }, [resetPositions]);

  const handleExport = () => {
    console.log('Export functionality would be implemented here');
    // TODO: Implement export as image
  };

  const handleNewCanvas = () => {
    window.location.reload();
    // TODO: Implement proper reset
  };

  // Focus on a specific box by setting it as active and panning to it
  const handleFocusBox = useCallback((boxId) => {
    setActiveBoxId(boxId);
    // Pan to the box without changing zoom
    setTimeout(() => {
      if (canvasRef.current?.fitToNodes) {
        canvasRef.current.fitToNodes([boxId]);
      }
    }, 50);
  }, [setActiveBoxId]);

  // Show Foundation Modal first if not completed
  if (!foundationComplete) {
    return <FoundationModal onComplete={handleFoundationComplete} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <PromptPanel
        activeBoxId={activeBoxId}
        activeNode={activeNode}
        responses={responses}
        completedBoxes={completedBoxes}
        nodes={nodes}
        currentRound={currentRound}
        showIterationChoice={showIterationChoice}
        onIteration={handleIteration}
        onDecide={generateDecisionBox}
        onFocusBox={handleFocusBox}
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        isGenerating={isGenerating}
        generationMessage={generationMessage}
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
      />
    </div>
  );
}

export default App;