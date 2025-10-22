# Testing AI Integration

## Quick Test Instructions

1. **Clear Browser State** (to see Foundation Modal)
   - Open Developer Tools (F12)
   - Go to Application > Local Storage
   - Clear `foundationShown` key
   - Refresh the page

2. **Test the AI Flow**
   - Foundation modal should appear with knife metaphor
   - Click "Begin Your Journey"
   - In Box 0, you should see: "What's the decision or problem you're facing?"
   - Type your problem (e.g., "Should I quit my job to start a startup?")
   - Press **Tab** to complete Box 0

3. **Expected Behavior**
   - ✅ You should see "Analyzing your problem..." message
   - ✅ Backend logs should show API call
   - ✅ NEW context boxes should appear (NOT Employment/Financial/Skills/Opportunity)
   - ✅ Questions should be specific to YOUR problem

## Troubleshooting

If you still see hardcoded boxes:
1. Check browser console for errors
2. Verify backend is running: `cd server && node index.js`
3. Check server logs for API calls
4. Ensure GLM_API_KEY is set in .env

## What Was Fixed

- The AI mode now properly prevents fallthrough to hardcoded logic
- Box 0 now shows the prompt question
- The flow correctly triggers AI generation after Box 0 completion