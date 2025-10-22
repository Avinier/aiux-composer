# Meaningmaking Prompts Philosophy

## Based on Vaughn Tan's Framework
https://vaughntan.org/aiux

## Core Principle: The Division of Labor

**Meaningmaking Work (Human Only)**
- Subjective value judgments
- Deciding what's good/bad, worth doing
- Setting priorities and tradeoffs
- Personal definitions of success/failure

**Non-Meaningmaking Work (AI Can Help)**
- Gathering facts and data
- Pattern recognition
- Market analysis
- Case study research

## Our 7-Stage Implementation

### Stage 1: Context Gathering (FACTUAL)
**Prompt Focus**: Gather objective facts about the user's situation
- Employment status, income, savings
- Skills, experience, commitments
- Time constraints, dependencies
- **Critical**: NO value questions - just facts

### Stage 2: Meaningmaking (SUBJECTIVE VALUES)
**Prompt Focus**: Force users to make value judgments
- What does success mean TO YOU?
- What won't you sacrifice?
- How do you prioritize when values conflict?
- **Critical**: No "correct" answers exist

### Stage 3: Research (AI GATHERS DATA)
**Prompt Focus**: Gather relevant data based on user's values
- Market analysis
- Case studies
- Financial projections
- Alternative options
- **Critical**: Present neutrally, don't interpret value

### Stage 4: Synthesis (USER INTEGRATES)
**Prompt Focus**: User identifies non-negotiables
- Combine their values with research data
- Identify absolute boundaries
- **Critical**: User decides what data means to them

### Stage 5: Tensions (SURFACE CONTRADICTIONS)
**Prompt Focus**: Make conflicts visible
- Value vs Value conflicts
- Value vs Reality mismatches
- Timeline contradictions
- Identity vs Action gaps
- **Critical**: Don't resolve - just reveal

### Stage 6: Iteration (DEEPER QUESTIONS)
**Prompt Focus**: Drill into unresolved tensions
- Force clearer prioritization
- Test value stability under pressure
- **Critical**: Build on specific tensions identified

### Stage 7: Decision (USER OWNS IT)
**Prompt Focus**: Structure the decision
- Template for articulation
- First concrete action
- Success criteria
- **Critical**: User makes decision, AI just formats

## Key "Alphas" (Signals) from Tan's Research

1. **The Knife Analogy**: You wouldn't ask a knife what to cook - don't ask AI what to value
2. **Two-Hour Transformation**: Students went from vague to sharp proposals with structured approach
3. **Socratic Mirror**: AI reflects thinking back, doesn't generate meaning
4. **Productive Discomfort**: Tensions and contradictions drive learning
5. **Iterative Scaffolding**: Build on previous answers, not empty boxes
6. **Visible Reasoning**: Externalize the critical thinking process

## What Makes Our Prompts Different

### Traditional AI Prompts
```
"Help me decide whether to start a business"
→ AI gives advice and recommendations
→ User outsources judgment
→ Thinking remains hidden
```

### Our Meaningmaking Prompts
```
Stage 1: "What are your current financial obligations?"
Stage 2: "What would make you feel this was RIGHT in 5 years?"
Stage 3: [AI gathers data about market/competition]
Stage 4: "Given the data, what won't you compromise on?"
Stage 5: "You want X but the data shows Y - how do you reconcile?"
Stage 6: "Under what specific conditions would you choose A over B?"
Stage 7: "Complete: Given that I value [...], I decide to [...]"
```

## The Vaughn Tan Rules We Follow

✅ **Rule 1**: Do NOT outsource subjective value judgments to AI
- Our prompts never suggest what to value

✅ **Rule 2**: Make the human/AI division explicit
- Clear marking of meaningmaking vs non-meaningmaking work

✅ **Rule 3**: Force users to do their own thinking
- Can't skip stages, must answer value questions themselves

✅ **Rule 4**: Surface contradictions productively
- Tensions stage reveals conflicts without resolving them

✅ **Rule 5**: Build iteratively on user's own outputs
- Each stage references previous answers

## Testing the Framework

Run the test script to validate:
```bash
node test-prompts.js
```

This will verify that prompts:
- Separate facts from values correctly
- Force genuine value judgments
- Identify meaningful tensions
- Never tell users what to decide
- Build iteratively through stages

## Result: From Vague to Sharp

Just like Tan's workshop where students achieved clarity in 2 hours, our prompts guide users from:

**Before**: "I want to maybe start a business or something"

**After**: "Given that I value creative control over income, can accept financial uncertainty for 18 months, cannot compromise on family time, and understand the 90% failure rate, I have decided to start a B2B SaaS while keeping my job part-time for the first year."

The difference? The user did the meaningmaking work themselves, with AI handling only the factual research and structure.

## Remember

> "Meaningmaking is making inherently subjective decisions about what's valuable: what's desirable or undesirable, what's right or wrong."
> - Vaughn Tan

Our prompts embody this by never crossing the line from helping users think to thinking for them.