import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RotateCcw } from 'lucide-react';
import CompletionModal from './CompletionModal';
import BoxNode from '../BoxNode';

const nodeTypes = {
  customBox: BoxNode
};

// Inner component that uses the ReactFlow provider hooks
const CanvasContent = ({ onReset, onReactFlowInit }) => {
  const { fitView, setCenter, getZoom, getViewport, setViewport } = useReactFlow();

  // Expose the functions to parent
  React.useEffect(() => {
    if (onReset) {
      onReset({ fitView, setCenter, getZoom, getViewport, setViewport });
    }
  }, [fitView, setCenter, getZoom, getViewport, setViewport, onReset]);

  // Pass ReactFlow instance to parent for auto-scroll
  React.useEffect(() => {
    if (onReactFlowInit) {
      onReactFlowInit({ fitView, setCenter, getZoom, getViewport, setViewport });
    }
  }, [fitView, setCenter, getZoom, getViewport, setViewport, onReactFlowInit]);

  return (
    <>
      <Background color="var(--gray)" gap={20} variant="dots" />
      {/* <Controls className="bg-gray border border-darkgray rounded-sm" /> */}
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
  onNewCanvas,
  onResetView,
  onReactFlowInit
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
      {/* Show All Boxes Button */}
      <button
        onClick={onResetView}
        className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-background border border-gray hover:border-darkgray text-text text-xs rounded-sm flex items-center gap-1.5 transition-all duration-200 font-body hover:bg-gray shadow-sm"
        title="Reset view to show all boxes"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Show All</span>
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onPaneClick={handlePaneClick}
        fitView
        fitViewOptions={{ padding: 0.2, includeHiddenNodes: false, maxZoom: 0.7 }}
        style={{ backgroundColor: 'var(--primary-bg)' }}
        defaultViewport={{ x: 50, y: 0, zoom: 0.45 }}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <CanvasContent
          onReset={(functions) => { fitViewRef.current = functions; }}
          onReactFlowInit={onReactFlowInit}
        />
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