# Section Generation Guide

This guide shows how to generate new sections (research, synthesis, tensions, decision) using the reusable patterns established for the meaningmaking section.

## Core Principles

1. **Relative Positioning** - Calculate Y position based on parent section, not absolute coordinates
2. **Connection Lines** - Use reusable edge generator for consistent connections
3. **Auto-scroll** - Smoothly scroll to new section (Y-axis only, preserve X and zoom)
4. **Handler References** - Always use `handleCompleteRef.current?.()` for Tab key support

## Reusable Helpers

### 1. Calculate Relative Y Position

Located in: `src/hooks/useCanvasStateAI.js`

```javascript
const calculateRelativeY = useCallback((parentBoxes, parentBoxHeight, gap = 150) => {
  // Returns starting Y position for new section
}, []);
```

**Usage:**
```javascript
// Get parent section boxes
const meaningBoxes = nodes.filter(n => n.data.type === BOX_TYPES.MEANINGMAKING);

// Calculate Y position (meaningmaking boxes are 140px tall, 150px gap)
const researchStartY = calculateRelativeY(meaningBoxes, 140, 150);
```

### 2. Auto-scroll to Section

Located in: `src/hooks/useCanvasStateAI.js`

```javascript
const scrollToSection = useCallback((newNodes, delayMs = 300) => {
  // Smoothly scrolls viewport down to show new section
}, []);
```

**Usage:**
```javascript
// After adding nodes to state
scrollToSection(researchNodes); // Uses default 300ms delay

// Or with custom delay
scrollToSection(synthesisNodes, 500);
```

### 3. Generate Connection Edges

Located in: `src/utils/aiNodeGenerator.js`

```javascript
const generateSectionEdges = (parentBoxIds, childNodes, childCount = 2) => {
  // Returns array of edge objects
};
```

**Usage:**
```javascript
// Connect all meaningmaking boxes to first 2 research boxes
const meaningBoxIds = ['box2a', 'box2b', 'box2c', 'box2d', 'box2e', 'box2f'];
const edges = generateSectionEdges(meaningBoxIds, researchNodes, 2);
```

## Complete Example: Adding Research Section

### Step 1: Modify handleMeaningmakingComplete

```javascript
// In useCanvasStateAI.js
const handleMeaningmakingComplete = async (boxId, response, nodeId) => {
  console.log(`\n📝 [MEANINGMAKING COMPLETE] Box ${boxId}`);
  setSessionData(prev => ({
    ...prev,
    meaningmaking: { ...prev.meaningmaking, [boxId]: response }
  }));

  // Check if all meaningmaking boxes complete
  const meaningBoxes = nodes.filter(n => n.data.type === BOX_TYPES.MEANINGMAKING);
  const allMeaningComplete = meaningBoxes.every(box =>
    completedBoxes.has(box.id) || box.id === nodeId
  );

  if (allMeaningComplete) {
    console.log('✅ [ALL MEANINGMAKING COMPLETE] Generating research...');
    showAIThinking('Researching relevant data based on your values...');

    // Calculate Y position using helper
    const meaningBoxHeight = 140; // Meaningmaking boxes height
    const researchStartY = calculateRelativeY(meaningBoxes, meaningBoxHeight, 150);

    // Generate research boxes
    const { nodes: researchNodes, edges: researchEdges } = await aiGen.generateResearchBoxesWithAI(
      sessionData.problem,
      sessionData.context,
      sessionData.meaningmaking,
      handleContentChange,
      (id) => handleCompleteRef.current?.(id), // Use ref for Tab support
      setActiveBoxId,
      researchStartY // Pass calculated Y position
    );

    console.log(`✨ [GENERATED] ${researchNodes.length} research boxes`);

    // Store research data in session
    setSessionData(prev => ({ ...prev, research: researchNodes }));

    // Add to canvas
    setNodes(prev => [...prev, ...researchNodes]);
    setEdges(prev => [...prev, ...researchEdges]);
    setCurrentStage('RESEARCH');

    hideAIThinking();

    // Auto-scroll to new section
    scrollToSection(researchNodes);

    return true; // Skip auto-advance
  }

  return false; // Allow auto-advance
};
```

### Step 2: Create generateResearchBoxesWithAI

```javascript
// In aiNodeGenerator.js
export const generateResearchBoxesWithAI = async (
  problem,
  contextAnswers,
  meaningmakingAnswers,
  handleContentChange,
  handleComplete,
  setActiveBoxId,
  startY = 820 // Default Y if not provided
) => {
  const FIXED_BOX_COUNT = 4; // 4 research boxes
  const centerX = 785;

  try {
    // Get AI-generated research
    const aiResearch = await aiService.executeResearch(problem, contextAnswers, meaningmakingAnswers);

    // Create 4 research boxes (read-only)
    const researchData = [
      { id: '3a', label: 'Market Analysis', content: aiResearch.market },
      { id: '3b', label: 'Case Studies', content: aiResearch.cases },
      { id: '3c', label: 'Financial Data', content: aiResearch.financial },
      { id: '3d', label: 'Alternatives', content: aiResearch.alternatives }
    ];

    // Calculate positions (4 boxes in a row)
    const boxWidth = 200;
    const horizontalGap = 50;

    const nodes = researchData.map((r, i) => {
      const nodeId = `box${r.id}`;
      const totalWidth = 4 * boxWidth + 3 * horizontalGap;
      const startX = centerX - totalWidth / 2;
      const xPos = startX + i * (boxWidth + horizontalGap);

      return {
        id: nodeId,
        type: 'customBox',
        position: { x: xPos, y: startY },
        data: {
          id: nodeId,
          boxId: r.id,
          label: r.label,
          content: r.content,
          type: BOX_TYPES.RESEARCH,
          status: BOX_STATUS.COMPLETE, // Research boxes are read-only
          onActivate: (id) => setActiveBoxId(id),
          onChange: null, // No editing
          onComplete: null // No completion
        }
      };
    });

    // Generate edges using helper
    const meaningBoxIds = ['box2a', 'box2b', 'box2c', 'box2d', 'box2e', 'box2f'];
    const edges = generateSectionEdges(meaningBoxIds, nodes, 2);

    console.log(`✅ [NODE GEN] Created ${FIXED_BOX_COUNT} research nodes with ${edges.length} edges`);
    return { nodes, edges };
  } catch (error) {
    console.error('Failed to generate research boxes:', error);
    throw error;
  }
};
```

### Step 3: Update handleComplete Switch

```javascript
// In useCanvasStateAI.js - handleComplete function
switch (boxType) {
  case BOX_TYPES.ROOT:
    await handleRootComplete(response);
    shouldAutoAdvance = false;
    break;

  case BOX_TYPES.CONTEXT:
    const contextSkipAdvance = await handleContextComplete(boxId, response, nodeId);
    if (contextSkipAdvance) shouldAutoAdvance = false;
    break;

  case BOX_TYPES.MEANINGMAKING:
    const meaningSkipAdvance = await handleMeaningmakingComplete(boxId, response, nodeId);
    if (meaningSkipAdvance) shouldAutoAdvance = false;
    break;

  // Add new sections here...
}
```

## Box Height Reference

Use these heights when calling `calculateRelativeY`:

| Box Type | Height (px) | Notes |
|----------|-------------|-------|
| ROOT | 180 | Large starting box |
| CONTEXT | 150 | Medium boxes |
| MEANINGMAKING | 140 | Default size |
| RESEARCH | 280 | Tall vertical boxes |
| SYNTHESIS | 160 | Larger single box |
| TENSION | 140 | Same as meaningmaking |
| DECISION | 160 | Final large box |

## Edge Connection Patterns

### Parent → Child Connections

| From Section | To Section | Pattern |
|--------------|------------|---------|
| ROOT (1) | CONTEXT (4) | 1 → all 4 |
| CONTEXT (4) | MEANINGMAKING (6) | all 4 → first 2 |
| MEANINGMAKING (6) | RESEARCH (4) | all 6 → first 2 |
| RESEARCH (4) | SYNTHESIS (1) | all 4 → 1 |
| SYNTHESIS (1) | TENSION (3) | 1 → all 3 |
| TENSION (3) | DECISION (1) | all 3 → 1 |

## Common Patterns

### Pattern 1: All Parents → First N Children
```javascript
const parentIds = ['box2a', 'box2b', 'box2c', 'box2d', 'box2e', 'box2f'];
const edges = generateSectionEdges(parentIds, childNodes, 2); // Connect to first 2
```

### Pattern 2: All Parents → Single Child
```javascript
const parentIds = ['box3a', 'box3b', 'box3c', 'box3d'];
const edges = generateSectionEdges(parentIds, childNodes, 1); // Connect to first 1
```

### Pattern 3: Single Parent → All Children
```javascript
const parentIds = ['box4']; // Single synthesis box
const edges = generateSectionEdges(parentIds, childNodes, childNodes.length); // Connect to all
```

## Testing Checklist

When adding a new section, test:

- [ ] ✅ Boxes appear at correct Y position (relative to parent)
- [ ] ✅ Connection lines appear from all parent boxes
- [ ] ✅ Auto-scroll moves down smoothly (no horizontal shift)
- [ ] ✅ Tab key completes boxes (for editable boxes)
- [ ] ✅ Left panel shows correct question
- [ ] ✅ Minimap navigation works
- [ ] ✅ User can click completed boxes to edit them
- [ ] ✅ Next section generates after all boxes complete

## Troubleshooting

### Issue: Tab key doesn't work
**Solution**: Use `(id) => handleCompleteRef.current?.(id)` instead of direct `handleComplete`

### Issue: Horizontal shift when scrolling
**Solution**: Use `scrollToSection()` helper, not `setCenter()`

### Issue: Boxes overlap with parent section
**Solution**: Increase gap parameter in `calculateRelativeY(parentBoxes, height, gap)`

### Issue: Connection lines missing
**Solution**: Ensure parent box IDs match actual node IDs in edges generator

### Issue: Section doesn't auto-advance
**Solution**: Return `true` from completion handler to skip auto-advance
