// Dynamic positioning utility to prevent overlapping and ensure proper placement

/**
 * Find the bottommost position of existing nodes to place new nodes below
 * @param {Array} nodes - Current nodes array
 * @returns {number} Y position for new nodes
 */
export const getBottomPosition = (nodes) => {
  if (!nodes || nodes.length === 0) return 100;

  let maxY = 0;
  nodes.forEach(node => {
    if (node.position && node.position.y) {
      // Add an estimate for box height based on type
      let boxHeight = 130; // default

      if (node.data?.type) {
        switch(node.data.type) {
          case 'root':
            boxHeight = 130;
            break;
          case 'context':
            boxHeight = 150;
            break;
          case 'research':
            boxHeight = 280;
            break;
          case 'synthesis':
          case 'decision':
            boxHeight = 160;
            break;
          case 'meaningmaking':
          case 'tension':
            boxHeight = 140;
            break;
          default:
            boxHeight = 130;
        }
      }

      const nodeBottom = node.position.y + boxHeight;
      if (nodeBottom > maxY) {
        maxY = nodeBottom;
      }
    }
  });

  // Add padding between sections (increased for better spacing)
  return maxY + 120;
};

/**
 * Calculate positions for a row of boxes
 * @param {number} boxCount - Number of boxes to position
 * @param {number} boxWidth - Width of each box
 * @param {number} spacing - Spacing between boxes
 * @param {number} canvasWidth - Total canvas width (default 1200)
 * @returns {Array} Array of X positions
 */
export const getRowPositions = (boxCount, boxWidth = 280, spacing = 30, canvasWidth = 1200) => {
  const totalWidth = (boxCount * boxWidth) + ((boxCount - 1) * spacing);
  const startX = (canvasWidth - totalWidth) / 2;

  const positions = [];
  for (let i = 0; i < boxCount; i++) {
    positions.push(startX + (i * (boxWidth + spacing)));
  }

  return positions;
};

/**
 * Update node positions dynamically based on current canvas state
 * @param {Array} newNodes - Nodes to be positioned
 * @param {Array} existingNodes - Current nodes on canvas
 * @param {string} nodeType - Type of nodes being added
 * @returns {Array} Updated nodes with dynamic positions
 */
export const positionNodesDynamically = (newNodes, existingNodes, nodeType) => {
  const baseY = getBottomPosition(existingNodes);

  let boxWidth = 280; // default
  switch(nodeType) {
    case 'root':
      boxWidth = 500;
      break;
    case 'context':
      boxWidth = 320;
      break;
    case 'research':
      boxWidth = 200;
      break;
    case 'synthesis':
    case 'decision':
      boxWidth = 400;
      break;
    default:
      boxWidth = 280;
  }

  const xPositions = getRowPositions(newNodes.length, boxWidth);

  return newNodes.map((node, index) => ({
    ...node,
    position: {
      x: xPositions[index] || 100 + (index * (boxWidth + 30)),
      y: baseY
    }
  }));
};

/**
 * Get original/ideal positions for all nodes (for reset functionality)
 * Canvas width is approximately 1400px - all boxes are centered on this width
 * Center axis at x: 700px for perfect symmetry
 */
export const getIdealPositions = () => {
  // Calculate center based on context boxes span
  // Context boxes: 100 to 1150 + box width (~320) = 100 to 1470
  // Center = (100 + 1470) / 2 = 785
  const centerX = 785; // True center of canvas based on context boxes

  return {
    // Root - centered relative to context boxes visual spread
    // Context boxes span from x:100 to x:1470 (last box at 1150 + 320 width)
    // Visual center should be between the middle two boxes (box1b and box1c)
    // box1b is at 450, box1c is at 800, midpoint = 625
    // Adjusting for visual balance
    'box0': { x: 550, y: 50 }, // Visually centered above context boxes

    // Context boxes - evenly spread across canvas (moved down for better connection line spacing)
    'box1a': { x: 100, y: 300 },
    'box1b': { x: 450, y: 300 },
    'box1c': { x: 800, y: 300 },
    'box1d': { x: 1150, y: 300 },

    // Meaningmaking boxes - 2 rows of 3, perfectly centered
    // Row 1 - centered on axis (3 boxes * 280px + 2 gaps * 50px = 940px total)
    // Increased Y position to prevent overlap with context boxes (150px height + 100px gap + connection lines)
    'box2a': { x: centerX - 470, y: 520 },  // 315
    'box2b': { x: centerX - 140, y: 520 },  // 645
    'box2c': { x: centerX + 190, y: 520 },  // 975
    // Row 2 - same X positions (h-[140px] + 30px gap = 170px spacing)
    'box2d': { x: centerX - 470, y: 690 },  // 315
    'box2e': { x: centerX - 140, y: 690 },  // 645
    'box2f': { x: centerX + 190, y: 690 },  // 975

    // Research boxes - 4 boxes centered on axis
    // (4 boxes * 200px + 3 gaps * 50px = 950px total)
    // Adjusted Y position to account for meaningmaking section shift
    'box3a': { x: centerX - 475, y: 890 },  // 310
    'box3b': { x: centerX - 225, y: 890 },  // 560
    'box3c': { x: centerX + 25, y: 890 },   // 810
    'box3d': { x: centerX + 275, y: 890 },  // 1060

    // Synthesis - centered on axis with larger gap from research (moved down to avoid overlap)
    'box4': { x: centerX - 200, y: 1340 },  // 585

    // Tension boxes - 3 boxes centered on axis (same as meaningmaking row)
    'box5a': { x: centerX - 470, y: 1540 }, // 315
    'box5b': { x: centerX - 140, y: 1540 }, // 645
    'box5c': { x: centerX + 190, y: 1540 }, // 975

    // Decision - centered on axis
    'boxFinal': { x: centerX - 200, y: 1740 }  // 585
  };
};