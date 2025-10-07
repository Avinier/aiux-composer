import { BOX_TYPES, BOX_STATUS } from '../constants';
import { getIdealPositions } from './dynamicPositioning';

export const generateMeaningmakingBoxes = (handleContentChange, handleComplete, setActiveBoxId) => {
  const boxes = [
    { id: 'box2a', boxId: '2a', label: 'Success Vision'},
    { id: 'box2b', boxId: '2b', label: 'Failure Fear'},
    { id: 'box2c', boxId: '2c', label: 'Sacrifice Ranking'},
    { id: 'box2d', boxId: '2d', label: 'Work Energy'},
    { id: 'box2e', boxId: '2e', label: 'Impact vs Income'},
    { id: 'box2f', boxId: '2f', label: 'Risk Tolerance'}
  ];

  // Use ideal positions for consistency
  const idealPositions = getIdealPositions();

  boxes.forEach(box => {
    box.position = idealPositions[box.id];
  });

  const nodes = boxes.map((box, i) => ({
    ...box,
    type: 'customBox',
    data: {
      boxId: box.boxId,
      label: box.label,
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

export const generateResearchBoxes = (setActiveBoxId) => {
  const idealPositions = getIdealPositions();

  const boxes = [
    {
      id: 'box3a',
      boxId: '3a',
      label: 'Market Data',
      content: '• Market growing 15% YoY\n• 500+ competitors\n• Average CAC: $150\n• Typical churn: 5% monthly',
      position: idealPositions['box3a']
    },
    {
      id: 'box3b',
      boxId: '3b',
      label: 'Case Studies',
      content: '• 18-24 months to $100k ARR\n• 80% kept day job initially\n• Average seed: $500k\n• Solo founders: 15% success',
      position: idealPositions['box3b']
    },
    {
      id: 'box3c',
      boxId: '3c',
      label: 'Financial Model',
      content: '• Burn rate: $8k/month\n• Break-even: Month 16-20\n• 1000 customers = $15k MRR\n• Required runway: $150k',
      position: idealPositions['box3c']
    },
    {
      id: 'box3d',
      boxId: '3d',
      label: 'Skill Analysis',
      content: '• Strong: Backend, architecture\n• Moderate: Frontend, product\n• Weak: Design, marketing\n• Critical gap: Sales',
      position: idealPositions['box3d']
    }
  ];

  const nodes = boxes.map(box => ({
    ...box,
    type: 'customBox',
    data: {
      boxId: box.boxId,
      label: box.label,
      type: BOX_TYPES.RESEARCH,
      status: BOX_STATUS.COMPLETE,
      content: box.content,
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

  return { nodes, edges, completedIds: ['box3a', 'box3b', 'box3c', 'box3d'] };
};

export const generateSynthesisBox = (handleContentChange, handleComplete, setActiveBoxId) => {
  const idealPositions = getIdealPositions();

  const node = {
    id: 'box4',
    type: 'customBox',
    position: idealPositions['box4'],
    data: {
      boxId: '4',
      label: 'Core Non-Negotiables',
      type: BOX_TYPES.SYNTHESIS,
      status: BOX_STATUS.ACTIVE,
      content: '',
      onActivate: (id) => setActiveBoxId(id),
      onChange: (id, value) => handleContentChange(id, value),
      onComplete: (id) => handleComplete(id)
    }
  };

  const edges = ['box3a', 'box3b', 'box3c', 'box3d'].map(sourceId => ({
    id: `e-${sourceId}-box4`,
    source: sourceId,
    target: 'box4',
    type: 'smoothstep',
    style: { stroke: '#eeeae6', strokeOpacity: 1 }
  }));

  return { node, edges };
};

export const generateTensionBoxes = (handleContentChange, handleComplete, setActiveBoxId) => {
  const idealPositions = getIdealPositions();

  const boxes = [
    { id: 'box5a', boxId: '5a', label: 'Time vs Reality', position: idealPositions['box5a']},
    { id: 'box5b', boxId: '5b', label: 'Income vs Risk', position: idealPositions['box5b']},
    { id: 'box5c', boxId: '5c', label: 'Control vs Capability', position: idealPositions['box5c']}
  ];

  const nodes = boxes.map((box, i) => ({
    ...box,
    type: 'customBox',
    data: {
      boxId: box.boxId,
      label: box.label,
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

export const generateDecisionBox = (handleContentChange, handleComplete, setActiveBoxId) => {
  const idealPositions = getIdealPositions();

  const node = {
    id: 'boxFinal',
    type: 'customBox',
    position: idealPositions['boxFinal'],
    data: {
      boxId: 'FINAL',
      label: 'Your Decision',
      type: BOX_TYPES.DECISION,
      status: BOX_STATUS.ACTIVE,
      content: '',
      onActivate: (id) => setActiveBoxId(id),
      onChange: (id, value) => handleContentChange(id, value),
      onComplete: (id) => handleComplete(id)
    }
  };

  const edges = ['box5a', 'box5b', 'box5c'].map(sourceId => ({
    id: `e-${sourceId}-final`,
    source: sourceId,
    target: 'boxFinal',
    type: 'smoothstep',
    style: { stroke: '#eeeae6', strokeOpacity: 1 }
  }));

  return { node, edges };
};