# Mock Mode Guide

## Overview

Mock Mode allows you to test the entire AI integration flow **without making any API calls to GLM/Z.ai**. This saves on API costs during development and provides instant responses for rapid testing.

## Quick Start

### 1. Enable Mock Mode

Add this to your `.env` file in the project root:

```bash
MOCK_MODE=true
```

### 2. Start the Server

```bash
cd server
node index.js
```

You should see:
```
🎭 MOCK MODE: ENABLED
💰 All LLM calls return hardcoded responses
⚡ No API costs, instant responses
```

### 3. Run Your Frontend

```bash
npm run dev
```

The app will now use mock responses for all AI calls!

## What's Mocked

All LLM endpoints return hardcoded responses:

| Endpoint | Mock Response | Simulated Delay |
|----------|--------------|-----------------|
| `/api/generate/context` | 4 factual context questions | 800ms |
| `/api/generate/meaningmaking` | 6 value-based meaningmaking questions | 1000ms |
| `/api/research/execute` | 3 research boxes with realistic data | 1200ms |
| `/api/generate/synthesis` | Synthesis prompt with insights | 700ms |
| `/api/generate/tensions` | 3 tension boxes | 900ms |
| `/api/generate/iteration` | 3 deeper iteration questions | 900ms |
| `/api/generate/decision` | Decision template | 600ms |

## Mock Response Details

### Context Questions (Stage 1)
```json
{
  "preamble": "Let's start by understanding the facts...",
  "questions": [
    {"id": "1a", "title": "Financial Resources", "question": "..."},
    {"id": "1b", "title": "Skills & Experience", "question": "..."},
    {"id": "1c", "title": "Time Availability", "question": "..."},
    {"id": "1d", "title": "Market Knowledge", "question": "..."}
  ]
}
```

### Meaningmaking Questions (Stage 2)
- Success Vision (2a)
- Failure Fear (2b)
- Sacrifice Ranking (2c)
- Work Energy (2d)
- Impact vs Income (2e)
- Risk Tolerance (2f)

### Research Data (Stage 3)
- Market & Competition (box3a)
- Financial Requirements (box3b)
- Time & Lifestyle Impact (box3c)

### Tensions (Stage 5)
- Time vs Reality (5a)
- Income vs Meaning (5b)
- Control vs Capability (5c)

## Customizing Mock Responses

Edit `server/MOCK_RESPONSES.js` to customize the responses:

```javascript
export const MOCK_RESPONSES = {
  context: {
    questions: [
      {
        id: "1a",
        question: "Your custom question here",
        title: "Custom Title",
        why_factual: "Why this is factual"
      }
      // Add more questions...
    ]
  }
  // Customize other stages...
};
```

## Testing Strategy

### Development Workflow

1. **Initial Development** (Mock Mode)
   - Set `MOCK_MODE=true`
   - Build and test UI flow
   - No API costs
   - Fast iteration

2. **Integration Testing** (Live Mode)
   - Set `MOCK_MODE=false`
   - Test with real GLM responses
   - Verify AI quality
   - Check for parsing errors

3. **Production** (Live Mode)
   - `MOCK_MODE=false`
   - Real API calls only

### Testing Scenarios

```bash
# Test entire flow without costs
MOCK_MODE=true npm run dev

# Test one stage with real AI
# (Comment out MOCK_MODE check for specific endpoint in index.js)

# Full integration test
MOCK_MODE=false npm run dev
```

## Advantages of Mock Mode

✅ **Zero API Costs** - No GLM API calls = no billing
✅ **Instant Responses** - Simulated delays (0.6-1.2s) instead of real API latency
✅ **Predictable Testing** - Same responses every time
✅ **Offline Development** - No internet required
✅ **Customizable** - Edit MOCK_RESPONSES.js for different scenarios
✅ **Full Flow Testing** - Test entire meaningmaking journey

## Console Output

### Mock Mode Enabled
```
📨 [API REQUEST] /api/generate/context
🎭 [MOCK] Returning hardcoded context questions
📤 [API RESPONSE] Context questions generated: 4
```

### Live Mode
```
📨 [API REQUEST] /api/generate/context
🤖 [GLM API REQUEST]
Model: glm-4.5
Temperature: 0.7
...
✅ [GLM API RESPONSE]
📤 [API RESPONSE] Context questions generated: 4
```

## Troubleshooting

### Mock mode not working?

1. Check `.env` file:
   ```bash
   cat .env | grep MOCK_MODE
   # Should show: MOCK_MODE=true
   ```

2. Restart the server:
   ```bash
   # Kill existing server (Ctrl+C)
   node server/index.js
   # Look for: 🎭 MOCK MODE: ENABLED
   ```

3. Check server logs:
   - Should see `🎭 [MOCK]` prefix on all responses
   - No `🤖 [GLM API REQUEST]` logs

### Still making API calls?

- Ensure `.env` is in project root (not in server/ folder)
- Check `MOCK_MODE=true` (not "true" with quotes)
- Verify server restart after changing .env

## Cost Comparison

| Mode | Context | Meaningmaking | Research | Synthesis | Tensions | Total |
|------|---------|--------------|----------|-----------|----------|-------|
| **Live** | ~$0.02 | ~$0.03 | ~$0.02 | ~$0.01 | ~$0.02 | ~$0.10/session |
| **Mock** | $0.00 | $0.00 | $0.00 | $0.00 | $0.00 | **$0.00** |

**Savings**: ~$0.10 per complete test session
**10 test sessions**: Save ~$1.00
**100 test sessions**: Save ~$10.00

## When to Use Each Mode

### Use Mock Mode When:
- Building UI/UX
- Testing user flows
- Debugging frontend logic
- Rapid prototyping
- Demo preparations
- CI/CD testing

### Use Live Mode When:
- Testing AI quality
- Validating prompts
- Production deployment
- User acceptance testing
- Quality assurance

## Next Steps

1. Start with Mock Mode for all development
2. Periodically test with Live Mode to verify AI quality
3. Customize MOCK_RESPONSES.js for edge cases
4. Deploy to production with Mock Mode disabled

---

**Pro Tip**: Keep Mock Mode enabled in development, switch to Live Mode only when testing AI responses!
