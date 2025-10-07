import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CompletionModal from './CompletionModal';
import BoxNode from '../BoxNode';

const nodeTypes = {
  customBox: BoxNode
};

// Inner component that uses the ReactFlow provider hooks
const CanvasContent = ({ onReset }) => {
  const { fitView, setCenter, getZoom } = useReactFlow();

  // Expose the functions to parent
  React.useEffect(() => {
    if (onReset) {
      onReset({ fitView, setCenter, getZoom });
    }
  }, [fitView, setCenter, getZoom, onReset]);

  return (
    <>
      <Background color="var(--gray)" gap={20} variant="dots" />
      <Controls className="bg-gray border border-darkgray rounded-sm" />
    </>
  );
};

const Canvas = forwardRef(({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  currentStage,
  onExport,
  onNewCanvas
}, ref) => {
  const fitViewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    resetView: () => {
      if (fitViewRef.current?.fitView) {
        // Zoom out to show all boxes with proper padding
        fitViewRef.current.fitView({ padding: 0.05, duration: 400, minZoom: 0.3, maxZoom: 0.5 });
      }
    },
    fitToNodes: (nodeIds) => {
      if (fitViewRef.current?.setCenter && fitViewRef.current?.getZoom) {
        // Pan to show new nodes while maintaining current zoom level
        const targetNodes = nodeIds ? nodes.filter(n => nodeIds.includes(n.id)) : nodes;

        if (targetNodes.length > 0) {
          // Calculate center position of target nodes
          const avgX = targetNodes.reduce((sum, n) => sum + n.position.x, 0) / targetNodes.length;
          const avgY = targetNodes.reduce((sum, n) => sum + n.position.y, 0) / targetNodes.length;

          // Pan to center of new nodes while keeping current zoom
          const currentZoom = fitViewRef.current.getZoom();
          fitViewRef.current.setCenter(avgX, avgY, { zoom: currentZoom, duration: 800 });
        }
      }
    }
  }));

  const handlePaneClick = () => {
    // Blur any focused textareas when clicking on canvas background
    const activeTextarea = document.querySelector('textarea:focus');
    if (activeTextarea) {
      activeTextarea.blur();
    }
  };

  return (
    <div className="flex-1 relative bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onPaneClick={handlePaneClick}
        fitView
        fitViewOptions={{ padding: 0.1, includeHiddenNodes: false }}
        style={{ backgroundColor: 'var(--primary-bg)' }}
        defaultViewport={{ x: 50, y: 0, zoom: 0.45 }}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <CanvasContent onReset={(functions) => { fitViewRef.current = functions; }} />
      </ReactFlow>

      {/* Completion Message */}
      {currentStage === 'complete' && (
        <CompletionModal
          onExport={onExport}
          onNewCanvas={onNewCanvas}
        />
      )}
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;