# AIUX Composer

<div align="center">
  <img src="/public/final-logo6.png" alt="AIUX Composer Logo" width="200">

  <p style="font-family: 'Libre Baskerville', serif; font-size: 1.2em; color: #6c757d; margin: 20px 0;">
    A meaningmaking canvas for structured decision-making
  </p>

  <p style="font-family: 'Kollektif', sans-serif; color: #1a1d21; max-width: 600px; line-height: 1.6;">
    Based on Vaughn Tan's framework, AIUX Composer guides you through a thoughtful journey of context gathering, value clarification, and tension resolution to make clearer decisions.
  </p>
</div>

---

## 🧭 The Philosophy

Traditional AI interfaces create a mirage of judgment—they present polished answers as if they can decide what matters to you. **Meaningmaking work** (decisions about subjective value) cannot be outsourced to machines.

AIUX Composer makes this boundary explicit:

- **You decide** what success means, what you're willing to sacrifice, what tradeoffs align with your values
- **AI helps** gather information, identify patterns, and surface contradictions between your stated values and reality

The result is not an answer, but clarity about your own thinking.

---

## 🎨 How It Works

### The Canvas Layout

The interface unfolds as an infinite canvas where your thinking process grows organically:

```
┌─────────────────────────────────────────────┬─────────────────────┐
│              Prompt Panel                   │                     │
│  • Current question & instructions          │   Interactive       │
│  • Stage indicators & progress             │   Canvas            │
│  • Your thinking journey tracker           │                     │
└─────────────────────────────────────────────┴─────────────────────┘
```

### The Journey Flow

**Stage 1: Context** `💡 Just the facts`
- Four foundational boxes about your situation
- Employment, finances, skills, and current idea
- Establishes the factual baseline

**Stage 2: Meaningmaking** `💭 Only YOU can answer`
- Six purple boxes probing values and priorities
- Success vision, fear definition, sacrifice tolerance
- Forces you to decide what actually matters

**Stage 3: Research** `ℹ️ AI-generated data`
- Four teal boxes with objective analysis
- Market data, case studies, financial models
- Information without judgment

**Stage 4: Synthesis** `🎯 Integration point`
- Single indigo box where values meet reality
- Define your 3 non-negotiable requirements
- The convergence of all previous thinking

**Stage 5: Tensions** `⚠️ Contradictions to resolve`
- Orange boxes highlighting conflicts
- AI identifies where your values clash with constraints
- Each tension forces honest reconciliation

**Stage 6: Decision** `✅ Commit to action`
- Final green box for your decision
- Includes concrete first steps
- The culmination of your meaningmaking work

### Iteration Cycles

After resolving tensions, choose:
- **Continue Iterating**: Deeper questions refined from your responses
- **Ready to Decide**: Move to final commitment

Each iteration adds layers of sophistication to your thinking.

---

## 🛠 Technology Stack

### Core Foundation
- **React 19** with modern hooks and concurrent features
- **Vite** for lightning-fast development and builds
- **@xyflow/react** for sophisticated node-based canvas interactions

### Design & Animation
- **Tailwind CSS** with custom design system
- **Framer Motion** for subtle, purposeful animations
- **Custom typography**: Libre Baskerville (headings) + Kollektif (body)

### Architecture
- **State Management**: Centralized through `useCanvasState` hook
- **Dynamic Generation**: Nodes created based on user progression
- **Responsive Design**: Desktop-first with tablet support

---

## 🎯 Visual Design Language

### Color Coding System
Each stage has its visual identity:

| Stage | Color | Purpose |
|-------|-------|---------|
| Context | `#3b82f6` | Factual information |
| Meaningmaking | `#a855f7` | Personal values |
| Research | `#06b6d4` | AI-generated data |
| Synthesis | `#6366f1` | Integration point |
| Tensions | `#f97316` | Contradictions |
| Decision | `#10b981` | Final commitment |

### Design Principles
- **Warm Minimalism**: Cream backgrounds (`#fffffc`) with elegant typography
- **Dynamic Shadows**: Colored shadows that match box types on hover
- **Progressive Disclosure**: Canvas grows as thinking deepens
- **No Decorative Elements**: Clean, functional aesthetic

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aiux-composer-ui.git
cd aiux-composer-ui

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser
# Navigate to http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── BoxNode/          # Individual decision boxes
│   ├── Canvas/           # Main ReactFlow canvas
│   └── PromptPanel/      # Instructions & progress sidebar
├── hooks/
│   └── useCanvasState.js # Central state management
├── utils/
│   ├── nodeGenerator.js  # Dynamic node creation
│   ├── shadowUtils.js    # Dynamic shadow effects
│   └── aiNodeGenerator.js # AI-powered node generation
├── services/
│   ├── aiService.js      # AI integration layer
│   └── api.js           # API utilities
└── constants/
    └── index.js          # Box types, prompts, and configurations
```

---

## 🎮 Interaction Guide

### Keyboard Shortcuts
- **Tab**: Complete current active box
- **Ctrl+Enter**: Submit current response
- **Click boxes**: Activate and view prompts
- **Drag background**: Pan around canvas
- **Drag boxes**: Reposition elements

### Box States
- **Pending**: Faded appearance, waiting to be activated
- **Active**: Scaled up with shadow, ready for input
- **Completed**: Checkmark appears, auto-advances to next
- **Read-only**: Research boxes with AI-generated data

### Canvas Navigation
- Scroll to explore large canvases
- Drag boxes to organize your thinking spatially
- Connections show logical flow between ideas
- Progress bar tracks completion status

---

## 🔧 Development

### Adding New Box Types
1. Define constants in `src/constants/index.js`
2. Update color mapping in `src/utils/shadowUtils.js`
3. Implement generation logic in `src/utils/nodeGenerator.js`
4. Handle state transitions in `useCanvasState.js`

### Modifying Prompts
Edit prompt arrays in `src/constants/index.js`:
- `CONTEXT_PROMPTS`
- `MEANINGMAKING_PROMPTS`
- `RESEARCH_TEMPLATES`
- `TENSION_PROMPTS`

### Customizing Layout
Node positions calculated in generator functions:
- Modify position calculations for different layouts
- Adjust spacing and grid arrangements
- Update responsive breakpoints

---

## 🌟 Features

### Core Functionality
- [x] Dynamic canvas with ReactFlow integration
- [x] Multi-stage meaningmaking journey
- [x] Color-coded box types with dynamic shadows
- [x] Auto-progression through stages
- [x] Iteration system with round tracking
- [x] Tension detection and resolution
- [x] Progress tracking and completion states

### AI Integration
- [x] Context-aware node generation
- [x] Dynamic tension identification
- [x] Personalized research synthesis
- [x] Iterative question refinement

### User Experience
- [x] Smooth animations and transitions
- [x] Keyboard navigation support
- [x] Visual feedback for all interactions
- [x] Export functionality (planned)
- [x] Mobile responsiveness warning

---

## 🤝 Contributing

We welcome thoughtful contributions that align with the project's philosophy.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes with commit messages following conventional format
4. Test thoroughly across all stages
5. Submit a pull request with clear description

### Guidelines
- Maintain the warm, minimal aesthetic
- Test stage transitions carefully
- Preserve user data during state changes
- Keep animations subtle (200-500ms)
- Follow existing code patterns

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Vaughn Tan** for the meaningmaking framework and insightful research on AI interfaces
- **React Flow team** for the excellent canvas library
- **Framer Motion** for smooth animation primitives
- The broader community exploring human-AI collaboration

---

## 📬 Contact

For questions, collaborations, or discussions about meaningmaking in the age of AI:

- Create an issue in this repository
- Share your canvas exports and decision journeys
- Contribute to the conversation about better AI interfaces

---

<div align="center" style="margin-top: 60px; padding: 40px; background: #eeeae6; border-radius: 12px;">
  <p style="font-family: 'Libre Baskerville', serif; font-size: 1.1em; color: #6c757d; margin-bottom: 16px;">
    "The knife cannot decide what to cook for dinner."
  </p>
  <p style="font-family: 'Kollektif', sans-serif; font-size: 0.9em; color: #1a1d21; max-width: 400px;">
    AIUX Composer makes the boundary between tool and judgment clear, helping you do the meaningmaking work that only you can do.
  </p>
</div>