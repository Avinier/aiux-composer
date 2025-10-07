import React, { useRef, useCallback, useState } from 'react';
import Canvas from './components/Canvas';
import PromptPanel from './components/PromptPanel';
import { useCanvasState } from './hooks/useCanvasState';

function App() {
  const canvasRef = useRef(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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
    onNodesChange,
    onEdgesChange,
    handleIteration,
    generateDecisionBox,
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

  return (
    <div className="flex h-screen bg-background">
      <PromptPanel
        activeBoxId={activeBoxId}
        activeNode={activeNode}
        responses={responses}
        completedBoxes={completedBoxes}
        totalBoxes={totalBoxes}
        currentRound={currentRound}
        showIterationChoice={showIterationChoice}
        onIteration={handleIteration}
        onDecide={generateDecisionBox}
        resetPositions={handleResetView}
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
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
      />
    </div>
  );
}

export default App;