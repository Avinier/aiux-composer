// Box Types
export const BOX_TYPES = {
  ROOT: 'root',
  CONTEXT: 'context',
  MEANINGMAKING: 'meaningmaking',
  RESEARCH: 'research',
  SYNTHESIS: 'synthesis',
  TENSION: 'tension',
  DECISION: 'decision'
};

// Box Status
export const BOX_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETE: 'complete'
};

// Border Colors
export const BORDER_COLORS = {
  [BOX_TYPES.ROOT]: 'border-gray-400',
  [BOX_TYPES.CONTEXT]: 'border-blue-500',
  [BOX_TYPES.MEANINGMAKING]: 'border-purple-500',
  [BOX_TYPES.RESEARCH]: 'border-teal-500',
  [BOX_TYPES.SYNTHESIS]: 'border-indigo-500',
  [BOX_TYPES.TENSION]: 'border-orange-500',
  [BOX_TYPES.DECISION]: 'border-green-500'
};

// Stage Indicators
export const STAGE_INDICATORS = {
  [BOX_TYPES.ROOT]: {
    icon: null,
    text: 'Define your problem',
    color: 'text-gray-400'
  },
  [BOX_TYPES.CONTEXT]: {
    icon: '💡',
    text: 'Just the facts - no judgments yet',
    color: 'text-blue-600'
  },
  [BOX_TYPES.MEANINGMAKING]: {
    icon: '💭',
    text: 'This is meaningmaking - only YOU can answer',
    color: 'text-purple-600'
  },
  [BOX_TYPES.RESEARCH]: {
    icon: 'ℹ️',
    text: 'READ ONLY - AI has populated this with data',
    color: 'text-teal-600'
  },
  [BOX_TYPES.SYNTHESIS]: {
    icon: '🎯',
    text: 'Integrate your values with reality',
    color: 'text-indigo-600'
  },
  [BOX_TYPES.TENSION]: {
    icon: '⚠️',
    text: 'AI found a contradiction - resolve it',
    color: 'text-orange-600'
  },
  [BOX_TYPES.DECISION]: {
    icon: '✅',
    text: 'Final decision - commit to action',
    color: 'text-green-600'
  }
};

// Questions
export const QUESTIONS = {
  'box0': 'Describe the decision you\'re facing. What problem are you trying to solve?',
  'box1a': 'What\'s your current employment status and income?',
  'box1b': 'How many months could you survive without income?',
  'box1c': 'What\'s your current skill set and experience?',
  'box1d': 'Do you have specific ideas, or are you exploring?',
  'box2a': 'In 5 years, what would make you feel this was the right decision?',
  'box2b': 'What\'s the worst outcome you can imagine, and why would it be devastating?',
  'box2c': 'What are you willing vs unwilling to sacrifice?',
  'box2d': 'What kinds of work energize you vs drain you?',
  'box2e': 'If forced to choose: high pay but meaningless work OR low pay but meaningful work?',
  'box2f': 'Imagine your savings are down to $10k, 8 months in, no revenue. Do you continue?',
  'box4': 'Based on your values and the research, what are your 3 non-negotiables?',
  'box5a': 'You fear wasted time but bootstrapping takes 2+ years. How do you reconcile this?',
  'box5b': 'You need $100k in 3 years but won\'t sacrifice health/relationships. Is this realistic?',
  'box5c': 'You value creative control but have skill gaps. Partner up or go solo?',
  'boxFinal': 'Given everything above, what\'s your ACTUAL decision? If YES: what\'s the FIRST concrete step this week? If NO: what will you do instead?'
};