# Meaningmaking Canvas - Pure UI Description


## 1. Overall Layout

The interface is split into two main sections:

**Left Side (400px wide):**
A fixed sidebar called the "Prompt Panel" that shows instructions, the current question, progress, and controls.

**Right Side (remaining width):**
An infinite scrollable/pannable canvas where boxes appear and connect to each other as you work through the thinking process.

---

## 2. The Prompt Panel (Left Sidebar)

### Top Section - Header
- Title: "INSTRUCTIONS"
- Subtitle: "Click any box on the canvas to see its prompt"
- Clean, bold typography

### Active Box Display (Main Area)
When you click a box on the canvas, this area shows:
- **Box identifier**: Small badge showing the box ID (like "2a" or "5b")
- **Box label**: What type of question it is (like "Success Vision" or "Time vs Reality")
- **The actual prompt/question**: The full text of what you need to answer
- **Stage indicator**: Shows which stage you're in (Context, Meaningmaking, Research, etc.)
- **Special badges**:
  - For context boxes: "💡 Just the facts - no judgments yet"
  - For meaningmaking boxes: "💭 This is meaningmaking - only YOU can answer"
  - For research boxes: "ℹ️ READ ONLY - AI has populated this with data"
  - For tension boxes: "⚠️ AI found a contradiction - resolve it"
  - For decision box: "✅ Final decision - commit to action"

### Progress Section (Bottom)
- Title: "PROGRESS"
- Text showing: "X / Y boxes completed"
- Visual progress bar (empty white box with black border, fills with black as you progress)
- Shows current iteration round number

### Iteration Choice (Appears When Tensions Complete)
A special modal-like section that appears in the panel with:
- Title: "ITERATION CHOICE"
- Two prominent buttons stacked vertically:
  - "CONTINUE ITERATION (Round X)" - to keep thinking deeper
  - "READY TO DECIDE" - to move to final decision
- Yellow/highlighted background to draw attention

---

## 3. The Canvas Area (Right Side)

### Visual Appearance
- Light gray background (#fafafa or similar)
- Feels like an infinite workspace
- Can pan by dragging the background
- Shows a legend box in top-right corner explaining:
  - Blue borders = Facts you provide (Context)
  - Purple borders = Values you decide (Meaningmaking)
  - Teal borders = AI research data (read-only)
  - Orange borders = Tensions to resolve
  - Green border = Final decision

### The Boxes

Each box is a white rectangle with:

**Header (top border section):**
- Left side: Box ID (like "1a", "2b", "3c") in monospace font
- Center: Box label (like "Employment", "Success Vision")
- Right side: Checkmark ✓ when completed, or arrow → when active

**Content area (main body):**
- If box is NOT active and NOT completed: Gray text saying "Click to answer..."
- If box IS active: A textarea where you type your answer
- If box is completed: Shows your answer in small text
- If box is read-only (research boxes): Shows bullet-pointed data that AI populated

**Footer (if active and not completed):**
- Button labeled "COMPLETE (Ctrl+Enter)" 
- Only shows when you've typed something

**Visual states:**
- **Pending**: Normal size, thin border, faded appearance
- **Active**: Slightly larger (scaled up 5%), thicker border with shadow, prominent
- **Completed**: Normal size, checkmark in header, slightly faded
- **Read-only**: Gray background, no input field, just displays data

### The Connections

Lines connecting boxes to show logical flow:
- Black curved lines (bezier curves) connecting parent boxes to child boxes
- Start from bottom center of parent box
- End at top center of child box
- When parent box is completed: Solid black line
- When parent box is pending: Dashed line, very faint/transparent
- Multiple boxes can connect to one box (convergence - like all research boxes → synthesis)
- One box can connect to multiple boxes (divergence - like synthesis → 3 tension boxes)

---

## 4. Initial State (When User Arrives)

You see:

**On canvas:**
- **Box 0** at the top center: Large box (500px wide) labeled "Problem"
- **Four boxes below it** in a row:
  - Box 1a: "Employment"
  - Box 1b: "Financial"  
  - Box 1c: "Skills"
  - Box 1d: "Idea Status"
- **Lines connecting** Box 0 to each of the four boxes
- All boxes have thin borders, no shadows

**In prompt panel:**
- Box 0's prompt showing: "Describe the decision you're facing"
- Progress: 0 / 5 boxes completed
- Empty progress bar

**Box 0 is automatically active** (highlighted with shadow and scale)

---

## 5. User Flow - Step by Step Journey

### Step 1: Define the Problem
**What you see:**
- Box 0 is active and highlighted
- Prompt panel shows the question
- Cursor automatically in the textarea

**What you do:**
- Type your problem/decision description
- Press Ctrl+Enter or click "COMPLETE"

**What happens:**
- Box 0 gets a checkmark
- Box 0 shrinks back to normal size
- Box 1a automatically becomes active (lights up)
- Connection line from Box 0 to 1a turns solid black
- Progress updates to 1/5

### Step 2: Fill Context Boxes (1a through 1d)
**What you see:**
- Each box activates in sequence
- Prompt panel updates to show each box's specific question
- Four factual questions about your situation

**What you do:**
- Answer Box 1a about employment → Complete
- Auto-advances to Box 1b about finances → Answer and complete
- Auto-advances to Box 1c about skills → Answer and complete  
- Auto-advances to Box 1d about idea validation → Answer and complete

**What happens:**
- Each completed box gets a checkmark
- Connection lines turn solid black as you complete each
- Progress bar fills: 2/5, then 3/5, then 4/5, then 5/5
- When you complete Box 1d (the last context box), there's a 1-2 second pause

### Step 3: Meaningmaking Questions Appear
**What happens automatically:**
- The prompt panel shows "Generating next questions..." for a moment
- Six new purple-bordered boxes appear below the context boxes
  - Box 2a: "Success Vision" (left side)
  - Box 2b: "Failure Fear" (next to it)
  - Box 2c: "Sacrifice Ranking" (next to that)
  - Box 2d: "Work Energy" (row below, left)
  - Box 2e: "Impact vs Income" (next to it)
  - Box 2f: "Risk Tolerance" (next to that)
- Lines draw from context boxes to these new boxes (animated)
- Box 2a automatically becomes active
- Progress bar resets to show: 0/6 meaningmaking boxes completed

**What you see:**
- These boxes have purple borders (different from blue context boxes)
- Prompt panel shows a special badge: "💭 This is meaningmaking - only YOU can answer"
- Questions are deeper, asking about values and feelings, not facts

**What you do:**
- Spend 10-15 minutes answering all six meaningmaking questions
- Each completion auto-advances to the next
- These are harder questions requiring reflection

### Step 4: Research Boxes Appear
**What happens automatically after you complete all meaningmaking:**
- Prompt panel shows "Generating next questions..." again
- Four teal-bordered boxes appear below meaningmaking boxes
  - Box 3a: "📊 Market Data"
  - Box 3b: "👥 Case Studies"
  - Box 3c: "💰 Financial Model"
  - Box 3d: "📈 Skill Analysis"
- Lines draw from meaningmaking boxes to these research boxes
- These boxes are **different** - they have gray backgrounds

**What you see:**
- Each research box contains 4 bullet points of information
- A title at the top (like "Market Reality" or "Similar Founders")
- Data that relates to your specific context and values
- NO textarea - you cannot type in these boxes
- Automatically marked as complete with checkmarks
- Badge in prompt panel: "ℹ️ READ ONLY - AI research data"

**What you do:**
- Click each research box to read the data
- Prompt panel shows the research findings
- You're just absorbing information, not answering

**Why this matters:**
- This is the AI's contribution: objective data and patterns
- You can see facts and case studies relevant to your situation
- But you're not making judgments - just reading

### Step 5: Synthesis Box Appears
**What happens automatically after research boxes appear (2 second delay):**
- A single indigo-bordered box appears below the research boxes
  - Box 4: "🎯 Core Non-Negotiables" (centered, wider than others)
- Four lines connect from ALL research boxes to this one box (convergence!)
- This box automatically becomes active

**What you see:**
- This is a convergence point - all research feeds into this one question
- Prompt: "You've seen YOUR values (boxes 2a-2f) AND the reality (boxes 3a-3d). Now: What are your 3 absolute non-negotiables?"
- This is where you integrate what you want with what reality shows

**What you do:**
- Write down your 3 non-negotiable requirements
- These are things that if not true, you won't pursue this decision
- This forces you to prioritize given the constraints
- Complete the box

### Step 6: Tension Boxes Appear
**What happens automatically after synthesis completion:**
- Three orange-bordered boxes appear below synthesis
  - Box 5a: "⚠️ Tension" (left)
  - Box 5b: "⚠️ Tension" (middle)
  - Box 5c: "💡 Gap" (right)
- Lines connect from synthesis box to each tension box (divergence!)
- Box 5a automatically becomes active

**What you see:**
- Each tension box contains a pointed question highlighting a contradiction
- Example tension: "You said wasted time is your fear, but data shows 18-24 months is typical. You want part-time. How do you reconcile wanting speed with part-time effort?"
- These are uncomfortable questions
- Badge in prompt panel: "⚠️ AI found a contradiction - resolve it"

**What you do:**
- Answer each tension question honestly
- Have to confront where your stated values conflict with reality
- Or where you're missing critical information
- Complete all three boxes

### Step 7: Iteration Choice Appears
**What happens automatically after all tensions completed:**
- A special section appears in the prompt panel
- Highlighted in yellow/orange to grab attention
- Two large buttons:
  - "CONTINUE ITERATION (Round 2)" - top button
  - "READY TO DECIDE" - bottom button

**What you see:**
- The canvas has grown significantly - you can scroll/pan to see all boxes
- You have Box 0 at top, then context, then meaningmaking, then research, then synthesis, then tensions
- Progress shows all boxes completed
- The iteration counter shows "Round 1 complete"

**Decision point - you choose:**

#### Option A: If you click "CONTINUE ITERATION"
**What happens:**
- The iteration choice disappears
- After a moment, 2-3 new purple meaningmaking boxes appear
- These are REFINED questions based on how you resolved the tensions
- Example: "Based on your tension resolutions, what's your NEW primary constraint?"
- These new boxes connect from your tension boxes
- You answer these new meaningmaking questions
- Then the cycle repeats:
  - New research boxes appear (with updated data)
  - New synthesis box appears
  - New tension boxes appear  
  - Iteration choice appears again
- The canvas grows downward/outward
- You can iterate 2, 3, 4+ times until you feel ready

#### Option B: If you click "READY TO DECIDE"
**What happens:**
- The iteration choice disappears
- A single large green-bordered box appears
  - Box FINAL: "✅ Your Decision" (centered, largest box)
- Lines connect from ALL tension boxes to this final box (convergence!)
- This box automatically becomes active

**What you see:**
- Prompt: "Given everything above - the tensions, gaps, and tradeoffs - what's your ACTUAL decision? If YES: what's the FIRST concrete step you'll take this week? If NO: what will you do instead?"
- This is the culmination of all your thinking
- Badge: "✅ Final decision - commit to action"

**What you do:**
- Write your final decision
- Include concrete next steps
- Complete the box
- The canvas is now complete!

---

## 6. Interaction Patterns

### Clicking a Box
- Click any box to activate it
- The box scales up slightly (5% larger)
- Gets a shadow and thicker border
- Prompt panel updates to show that box's question
- If box is not completed, textarea appears
- Previous active box returns to normal size

### Typing in a Box
- When box is active, you see a textarea
- Type freely - multiline supported
- As soon as you type anything, "COMPLETE" button appears at bottom
- Can use Shift+Enter for line breaks
- Ctrl+Enter completes the box immediately

### Completing a Box
- Press Ctrl+Enter or click "COMPLETE" button
- Box gets a checkmark in header
- Box shrinks back to normal size
- Your answer is saved and displayed
- Cannot edit after completing (in this version)
- Automatically advances to next incomplete box
- Progress bar updates

### Dragging Boxes
- Click and hold anywhere on a box (except textarea)
- Drag to reposition the box
- Connections stay attached and follow the box
- Release to place the box
- Useful for organizing your thinking spatially

### Panning the Canvas
- Click and drag on the gray background (not on a box)
- The entire canvas moves with your drag
- All boxes and connections move together
- Useful for navigating large canvases with many iterations

### Reading Research Boxes
- Click on a research box (teal border)
- Prompt panel shows the data
- Cannot type or edit these boxes
- They're just information displays
- Already marked complete automatically
- Can click to read, then click elsewhere to continue

### Viewing Connections
- Lines automatically draw when boxes appear
- Hover or look at lines to see relationships
- Solid lines = parent box is completed
- Dashed/faint lines = parent box not yet completed
- Follow the tree structure to understand the reasoning flow

---

## 7. Visual Hierarchy and Flow

### Vertical Layout Pattern
The canvas naturally flows downward in stages:

**Top (Y: 0-150px):**
- Box 0 (Problem statement)

**Layer 1 (Y: 200-350px):**
- Context boxes (1a, 1b, 1c, 1d) in a horizontal row

**Layer 2 (Y: 400-750px):**
- Meaningmaking boxes (2a-2f) in two rows of three
- Purple borders signal different type of thinking

**Layer 3 (Y: 780-950px):**
- Research boxes (3a-3d) in a horizontal row
- Teal borders signal read-only information
- Visually distinct with gray background

**Layer 4 (Y: 1000-1150px):**
- Synthesis box (Box 4) centered
- Indigo border
- Wider than other boxes to show importance

**Layer 5 (Y: 1220-1370px):**
- Tension boxes (5a, 5b, 5c) in a horizontal row
- Orange borders signal contradictions
- All same width, evenly spaced

**Layer 6 (Y: 1430-1620px):**
- Decision box (FINAL) centered
- Green border
- Largest box
- End of the flow

**If iteration continues, add ~400px and repeat layers 2-5**

### Horizontal Spacing
- Small boxes (200-260px wide) have 40-60px gaps
- Wider boxes (320-500px) are centered
- Four-box rows (context, research) span full width
- Three-box rows (tensions) are centered with even spacing

### Connection Flow Visualization
```
         Box 0
       /  |  |  \
      /   |  |   \
    1a   1b 1c   1d
    |    |  |    |
   2a   2b 2c   2d
    \   |  |   /
     \  |  | /
       3a 3b 3c 3d
        \ | | /
         \| |/
          Box 4
          / | \
         /  |  \
       5a  5b  5c
         \ | /
          \|/
         FINAL
```

---

## 8. Responsive Behavior

### Desktop (1200px+ width)
- Optimal experience
- Prompt panel: 400px fixed
- Canvas area: Remaining width
- All boxes visible at comfortable sizes
- Can see multiple stages at once

### Tablet (768px - 1200px)
- Prompt panel collapses to a drawer (slides in/out)
- Canvas takes full width
- Boxes slightly smaller
- More panning/scrolling needed

### Mobile (<768px)
- **NOT SUPPORTED with canvas view**
- Show a message: "This tool works best on desktop. Please use a larger screen for the full canvas experience."
- Alternative: Could show a linear step-by-step view (no canvas, just one box at a time)

---

## 9. States and Feedback

### Loading/Generating State
When new boxes are being generated:
- Prompt panel shows: "Generating next questions..."
- Small animation (spinner or pulse)
- Lasts 1-2 seconds
- Then new boxes fade in with a slight animation

### Empty State
When canvas first loads:
- Just Box 0 and context boxes visible
- Subtle hint text: "Start by describing your decision in Box 0"
- Arrow pointing to Box 0

### Completion State
When final decision box is completed:
- Confetti animation or subtle celebration
- Message appears: "Your thinking journey is complete!"
- Options shown:
  - "Export as image"
  - "Start new canvas"
  - "Review your reasoning"

### Error State
If something goes wrong:
- Red border flashes on relevant box
- Message in prompt panel explaining the issue
- Suggest retry or contact support

---

## 10. Key Visual Principles

### Clarity Over Beauty
- Clean lines, minimal decoration
- Black borders on white boxes
- Simple typography
- Focus on content, not styling
- Wireframe aesthetic is intentional

### Progressive Disclosure
- Only show what's needed now
- Future boxes don't exist yet
- Reduces cognitive load
- Canvas grows as thinking deepens

### Visual Chunking
- Color-coded stages help segment thinking
- Connections show relationships
- Convergence/divergence patterns visible
- Can see "this feeds into that"

### Spatial Reasoning
- Can rearrange boxes to match your mental model
- Physical positioning = conceptual relationship
- Your canvas becomes unique to your thinking
- Export shows your reasoning map

### Feedback Loops
- Every action has immediate visual response
- Completed boxes fade slightly
- Progress bar fills continuously
- Active box is always obvious
- Never confused about what to do next

---

## 11. The Complete Picture

Imagine looking at a completed canvas after 2 iterations:

**Top of canvas:**
- Your problem statement in a large box
- Four small factual boxes below it

**Upper middle:**
- Six purple value-judgment boxes in two rows
- Four teal read-only data boxes below them
- One indigo synthesis box
- Three orange tension boxes

**Lower middle (iteration 2):**
- Two new purple refined question boxes
- Four new teal research boxes with updated data
- One new indigo synthesis box
- Three new orange tension boxes

**Bottom:**
- One large green decision box

**Connections:**
- ~30-40 lines connecting everything
- Forms a tree that grew organically
- Can trace your reasoning path from top to bottom
- Convergence points show integration
- Divergence points show exploration

**Overall feeling:**
- Like a mind map meets a flow chart
- Your thinking process made visible
- Not intimidating despite complexity
- Clear progression from vague → specific
- Can see where AI helped vs where you decided

This is what makes the tool powerful: the structure itself teaches critical thinking by making the process explicit and visual.