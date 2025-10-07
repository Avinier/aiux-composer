# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIUX Composer UI is a React-based meaningmaking canvas application that guides users through structured decision-making processes. The project follows Vaughn Tan's meaningmaking framework, where users progress through stages of context gathering, value clarification, research synthesis, and tension resolution.

**Important**: The codebase foundation has been established. All future development should build upon the existing structure rather than starting from scratch. Project completion will occur in two phases:
1. **UI Beautification & Completion** (current phase)
2. **AI Integration** (future phase)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Architecture & Key Concepts

### Core Technologies
- **React 19** with Vite for fast development
- **@xyflow/react** for canvas/node management
- **Framer Motion** for animations
- **Tailwind CSS** with custom design system
- **Lucide React** for icons

### Application Flow
1. **Canvas State Management** (`src/hooks/useCanvasState.js`): Central hook managing all node states, positions, connections, and user responses
2. **Node Generation** (`src/utils/nodeGenerator.js`): Dynamic creation of question boxes based on user progress and responses
3. **Box Types**: ROOT → CONTEXT → MEANINGMAKING → RESEARCH → SYNTHESIS → TENSION → DECISION
4. **Iteration System**: Users can iterate through multiple rounds of deeper questioning

### Component Structure
```
src/
├── components/
│   ├── BoxNode/          # Individual decision box component
│   ├── Canvas/           # Main canvas with ReactFlow
│   └── PromptPanel/      # Left sidebar with instructions
├── hooks/
│   └── useCanvasState.js # Main state management
├── utils/
│   ├── nodeGenerator.js  # Dynamic node creation logic
│   └── shadowUtils.js    # Dynamic shadow effects
└── constants/
    └── index.js          # Box types, statuses, prompts
```

### Design System Implementation

The project follows a comprehensive design system (`design-system.md`) with:
- **Warm minimal aesthetic** with cream backgrounds and elegant typography
- **Libre Baskerville** for headings (weight 400 only)
- **Kollektif** for body text (custom font, weight 400 only)
- **Dynamic colored shadows** matching box types on hover
- **Never use**: accent colors for hover states, bold Kollektif, decorative shapes

Color coding for box types:
- Blue: Context (facts)
- Purple: Meaningmaking (values)
- Teal: Research (AI data)
- Orange: Tensions (contradictions)
- Green: Decision (final)

### State Management Patterns

The application uses a single source of truth through `useCanvasState`:
- Node positions and data managed via ReactFlow's `useNodesState`
- Edge connections managed via `useEdgesState`
- User responses stored in a flat object keyed by node ID
- Stage progression tracked through `currentStage`
- Completion tracking via `completedBoxes` Set

### Key Implementation Details

1. **Auto-progression**: Completing a box automatically activates the next pending box
2. **Dynamic Generation**: New stages generate based on previous responses
3. **Keyboard Shortcuts**: Tab to complete current box
4. **Read-only Research**: Research boxes display AI-generated data without user input
5. **Iteration Choice**: After tensions, users choose to iterate deeper or make final decision

## Context Files

Two critical context documents guide development:
- **CONTEXT_OF_PROJECT.md**: Contains the theoretical framework and user flow examples
- **CONTEXT_OF_UI.md**: Detailed UI specifications and interaction patterns

## Current Implementation Status

### Completed
- Basic canvas with node management
- Box component with all states (pending/active/complete)
- Dynamic shadow system matching design system
- Stage progression through context → meaningmaking
- Prompt panel with instructions and progress

### To Be Implemented
- Remaining stages (research, synthesis, tensions, decision)
- Iteration system with round tracking
- Export functionality
- Keyboard shortcuts
- Completion celebrations
- Mobile responsiveness warning

## Development Guidelines

1. **Maintain existing patterns**: Use the established component structure and state management approach
2. **Follow design system strictly**: Reference `design-system.md` for all styling decisions
3. **Test stage transitions**: Ensure smooth progression between meaningmaking stages
4. **Preserve user data**: Never lose user responses during state transitions
5. **Keep animations subtle**: 200-500ms for UI transitions per design system

## Common Tasks

### Adding a New Box Type
1. Add constant to `src/constants/index.js`
2. Update `getBoxColor` in `src/utils/shadowUtils.js`
3. Add generation logic to `src/utils/nodeGenerator.js`
4. Update stage progression in `useCanvasState`

### Modifying Box Prompts
Edit prompt arrays in `src/constants/index.js`:
- `CONTEXT_PROMPTS`
- `MEANINGMAKING_PROMPTS`
- `TENSION_PROMPTS`

### Adjusting Canvas Layout
Node positions are set in generator functions within `src/utils/nodeGenerator.js`. Modify the position calculations there.

## Testing Approach

Focus testing on:
1. Complete user journey from problem → decision
2. Data persistence across stage transitions
3. Iteration cycles maintaining context
4. Export functionality preserving full decision tree
5. Keyboard navigation and shortcuts