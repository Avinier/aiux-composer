/**
 * Simple Express API Server for GLM Integration
 * ==============================================
 * Keeps your Vite React app unchanged, just adds API endpoints
 *
 * Run with: node server/index.js
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// GLM API configuration
const GLM_API_KEY = process.env.GLM_API_KEY;
const GLM_ENDPOINT = 'https://api.z.ai/api/paas/v4/chat/completions';

// Exa API configuration
const EXA_API_KEY = process.env.EXA_API_KEY;
const EXA_ENDPOINT = 'https://api.exa.ai/search';

// MOCK MODE configuration
const MOCK_MODE = process.env.MOCK_MODE === 'true';

// Import mock responses
let MOCK_RESPONSES, simulateDelay;
if (MOCK_MODE) {
  const mockModule = await import('./MOCK_RESPONSES.js');
  MOCK_RESPONSES = mockModule.MOCK_RESPONSES;
  simulateDelay = mockModule.simulateDelay;
  console.log('🎭 MOCK MODE ENABLED - Using hardcoded responses (no API calls)');
  console.log('💰 Cost savings: All LLM calls will return mock data');
}

// Load comprehensive prompts
let PROMPTS;
try {
  const promptsPath = path.join(__dirname, 'PROMPTS.js');
  if (fs.existsSync(promptsPath)) {
    // Dynamic import for ES modules
    const promptModule = await import('./PROMPTS.js');
    PROMPTS = promptModule.PROMPTS;
    console.log('✅ Loaded comprehensive meaningmaking prompts');
  } else {
    throw new Error('PROMPTS.js not found');
  }
} catch (error) {
  console.error('⚠️ Failed to load PROMPTS.js, using basic prompts:', error.message);
  // Basic fallback prompts (should rarely be used)
  PROMPTS = {
    CONTEXT: `Generate 4 FACTUAL context questions (not value judgments).
Output JSON: {"questions": [{"id": "1a", "question": "...", "title": "..."}]}`,

    MEANINGMAKING: `Generate 6 meaningmaking questions forcing VALUE JUDGMENTS.
Output JSON: {"questions": [{"id": "2a", "question": "...", "title": "..."}]}`,

    TENSIONS: `Identify tensions between stated values and reality.
Output JSON: {"tensions": [{"id": "5a", "title": "...", "description": "...", "question": "..."}]}`
  };
}

// Helper: Call GLM API
async function callGLM(messages, model = 'glm-4.5-air', temperature = 0.7) {
  const requestPayload = {
    model,
    messages,
    temperature,
    max_tokens: 4096
  };

  console.log('\n🤖 [GLM API REQUEST]');
  console.log('Model:', model);
  console.log('Temperature:', temperature);
  console.log('Messages:', JSON.stringify(messages, null, 2));
  console.log('---');

  const response = await fetch(GLM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GLM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ [GLM API ERROR]', JSON.stringify(error, null, 2));
    throw new Error(`GLM API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  console.log('\n✅ [GLM API RESPONSE]');
  console.log('Response:', content);
  console.log('---\n');

  return content;
}

// Helper: Parse JSON from response
function parseJSON(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Helper: Call Exa API for web search
async function callExa(query, numResults = 5) {
  if (!EXA_API_KEY || EXA_API_KEY === 'your_exa_api_key_here') {
    console.log('⚠️ [EXA API] No API key provided, returning mock results');
    return {
      results: [
        {
          title: `Market analysis for ${query}`,
          url: 'https://example.com/market-analysis',
          publishedDate: new Date().toISOString(),
          summary: `Recent market data shows growing demand for solutions related to ${query}. Industry reports indicate a 15% year-over-year growth.`
        },
        {
          title: `Case studies: ${query} success stories`,
          url: 'https://example.com/case-studies',
          publishedDate: new Date().toISOString(),
          summary: `Multiple companies have successfully implemented solutions for ${query}. Key learnings include early adoption and user feedback.`
        }
      ]
    };
  }

  const requestPayload = {
    query,
    numResults,
    includeDomains: [],
    excludeDomains: [],
    startPublishedDate: null,
    endPublishedDate: null,
    text: true
  };

  console.log('\n🔍 [EXA API REQUEST]');
  console.log('Query:', query);
  console.log('Num results:', numResults);

  const response = await fetch(EXA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EXA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ [EXA API ERROR]', JSON.stringify(error, null, 2));
    // Return mock results on error
    return {
      results: [
        {
          title: `Information about ${query}`,
          url: 'https://example.com/info',
          publishedDate: new Date().toISOString(),
          summary: `Unable to fetch live data. Here's some general information about ${query}.`
        }
      ]
    };
  }

  const data = await response.json();
  console.log('\n✅ [EXA API RESPONSE]');
  console.log('Results found:', data.results?.length || 0);

  return data;
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Foundation endpoint - introduces the tool framework
app.get('/api/foundation', (req, res) => {
  res.json({
    title: "Understanding Your Thinking Tool",
    content: "Think of this system like a knife in cooking - it helps you prepare ingredients (information), but YOU decide what to cook (what matters). I'll help you discover your values through structured questions. There are no 'correct' answers - only YOUR answers.",
    metaphor: "knife",
    principles: [
      "You decide what matters",
      "I help organize information",
      "No correct answers exist",
      "Revision is refinement"
    ]
  });
});

app.post('/api/generate/context', async (req, res) => {
  console.log('\n📨 [API REQUEST] /api/generate/context');
  console.log('Problem Text:', req.body.text);

  try {
    const { text } = req.body;

    // MOCK MODE: Return hardcoded response
    if (MOCK_MODE) {
      await simulateDelay(800); // Simulate API delay
      console.log('🎭 [MOCK] Returning hardcoded context questions');
      console.log('📤 [API RESPONSE] Context questions generated:', MOCK_RESPONSES.context.questions.length);
      console.log('📋 [MOCK] Question IDs:', MOCK_RESPONSES.context.questions.map(q => q.id).join(', '));
      return res.json(MOCK_RESPONSES.context);
    }

    // REAL MODE: Call GLM API
    const messages = [
      { role: 'system', content: PROMPTS.CONTEXT },
      { role: 'user', content: `Problem/Decision to analyze: ${text}` }
    ];

    const response = await callGLM(messages);
    const parsed = parseJSON(response);

    if (!parsed || !parsed.questions) {
      console.error('❌ [PARSE ERROR] Failed to parse JSON from GLM response');
      console.error('Raw response:', response);
      throw new Error('Failed to parse valid JSON from GLM response');
    }

    console.log('📤 [API RESPONSE] Context questions generated:', parsed.questions.length);
    res.json(parsed);
  } catch (error) {
    console.error('❌ [API ERROR]:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message, type: 'context_generation_failed' });
  }
});

app.post('/api/generate/meaningmaking', async (req, res) => {
  console.log('\n📨 [API REQUEST] /api/generate/meaningmaking');
  console.log('Problem:', req.body.problem);
  console.log('Context Answers:', Object.keys(req.body.answers || {}).length, 'answers');

  try {
    const { problem, answers } = req.body;

    // MOCK MODE: Return hardcoded response
    if (MOCK_MODE) {
      await simulateDelay(1000); // Simulate API delay
      console.log('🎭 [MOCK] Returning hardcoded meaningmaking questions');
      console.log('📤 [API RESPONSE] Meaningmaking questions generated:', MOCK_RESPONSES.meaningmaking.questions.length);
      return res.json(MOCK_RESPONSES.meaningmaking);
    }

    // REAL MODE: Call GLM API
    const contextSummary = Object.entries(answers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const messages = [
      { role: 'system', content: PROMPTS.MEANINGMAKING },
      { role: 'user', content: `Initial problem/decision: ${problem}\n\nFactual context provided:\n${contextSummary}` }
    ];

    const response = await callGLM(messages, 'glm-4.5-air', 0.8);
    const parsed = parseJSON(response);

    if (!parsed || !parsed.questions) {
      console.error('❌ [PARSE ERROR] Failed to parse JSON from GLM response');
      console.error('Raw response:', response);
      throw new Error('Failed to parse valid JSON from GLM response');
    }

    console.log('📤 [API RESPONSE] Meaningmaking questions generated:', parsed.questions.length);
    res.json(parsed);
  } catch (error) {
    console.error('❌ [API ERROR]:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message, type: 'meaningmaking_generation_failed' });
  }
});

app.post('/api/generate/tensions', async (req, res) => {
  console.log('\n📨 [API REQUEST] /api/generate/tensions');

  try {
    const { problem, context, meaningmaking, research, synthesis } = req.body;

    // MOCK MODE: Return hardcoded response
    if (MOCK_MODE) {
      await simulateDelay(900);
      console.log('🎭 [MOCK] Returning hardcoded tensions');
      console.log('📤 [API RESPONSE] Tensions generated:', MOCK_RESPONSES.tensions.tensions.length);
      return res.json(MOCK_RESPONSES.tensions);
    }

    // REAL MODE: Call GLM API
    const messages = [
      { role: 'system', content: PROMPTS.TENSIONS },
      {
        role: 'user',
        content: `Initial problem: ${problem}\n\nContext (facts): ${JSON.stringify(context)}\n\nUser's values (meaningmaking answers): ${JSON.stringify(meaningmaking)}\n\nResearch data gathered: ${JSON.stringify(research)}\n\nUser's non-negotiables: ${synthesis}`
      }
    ];

    const response = await callGLM(messages, 'glm-4.5-air');
    const parsed = parseJSON(response);

    if (!parsed || !parsed.tensions) {
      console.error('❌ [PARSE ERROR] Failed to parse JSON from GLM response');
      console.error('Raw response:', response);
      throw new Error('Failed to parse valid JSON from GLM response');
    }

    console.log('📤 [API RESPONSE] Tensions generated:', parsed.tensions.length);
    res.json(parsed);
  } catch (error) {
    console.error('❌ [API ERROR]:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message, type: 'tensions_generation_failed' });
  }
});

app.post('/api/research/execute', async (req, res) => {
  console.log('\n📨 [API REQUEST] /api/research/execute');

  try {
    const { problem, context, meaningmaking } = req.body;

    // MOCK MODE: Return hardcoded response
    if (MOCK_MODE) {
      await simulateDelay(1200); // Longer delay for research
      console.log('🎭 [MOCK] Returning hardcoded research data');
      console.log('📤 [API RESPONSE] Research boxes generated:', MOCK_RESPONSES.research.length);
      return res.json(MOCK_RESPONSES.research);
    }

    // REAL MODE: Call GLM API to generate research queries
    const messages = [
      { role: 'system', content: PROMPTS.RESEARCH },
      {
        role: 'user',
        content: `Problem: ${problem}\n\nContext: ${JSON.stringify(context)}\n\nUser values: ${JSON.stringify(meaningmaking)}\n\nGenerate 4 research queries for web search: market trends, case studies, financial requirements, and alternatives.`
      }
    ];

    const response = await callGLM(messages, 'glm-4.5-air', 0.3); // Lower temp for factual research
    const parsed = parseJSON(response);

    console.log('📊 [RESEARCH] GLM Response structure:');
    console.log('- Has research field:', !!parsed?.research);
    console.log('- Research type:', Array.isArray(parsed?.research) ? 'array' : typeof parsed?.research);
    if (parsed?.research && Array.isArray(parsed?.research) && parsed.research.length > 0) {
      console.log('- First research item keys:', Object.keys(parsed.research[0]));
      console.log('- First specific query:', parsed.research[0]?.specific_queries?.[0]);
    }

    // Extract search queries or use defaults
    // Handle different response formats from GLM
    let searchQueries;

    if (parsed?.research && Array.isArray(parsed.research)) {
      // GLM returned array of research objects
      searchQueries = parsed.research.map((r, index) => ({
        category: r.id || `category_${index}`,
        query: r.specific_queries && r.specific_queries[0] ? r.specific_queries[0] : `${problem} ${r.research_focus || 'research'}`
      }));
    } else if (parsed?.research && typeof parsed.research === 'object') {
      // GLM returned object with categories
      searchQueries = Object.entries(parsed.research).map(([key, value]) => ({
        category: key,
        query: value.specific_queries?.[0] || `${problem} ${key}`
      }));
    } else {
      // Fallback to default queries
      searchQueries = [
        { category: 'market', query: `${problem} market trends analysis` },
        { category: 'case_studies', query: `${problem} case studies success stories` },
        { category: 'financial', query: `${problem} financial requirements funding` },
        { category: 'alternatives', query: `${problem} alternatives options` }
      ];
    }

    // Execute web searches using Exa API
    console.log('🔍 [RESEARCH] Executing web searches...');
    console.log('📝 [RESEARCH] Search queries:', searchQueries.map(q => `${q.category}: ${q.query}`).join(', '));
    const research = {};

    // Search for each category
    for (const searchItem of searchQueries) {
      const { category, query } = searchItem;

      // Skip if category or query is undefined
      if (!category || !query) {
        console.error(`⚠️ [RESEARCH] Skipping invalid search item:`, searchItem);
        continue;
      }

      try {
        console.log(`🔍 [RESEARCH] Searching for ${category}: ${query}`);
        const searchResults = await callExa(query, 3);

        let title = '';
        let findings = [];

        switch(category) {
          case 'market':
            title = 'Market Analysis';
            findings = searchResults.results.map(r => ({
              type: 'trend',
              title: r.title,
              summary: r.text?.slice(0, 300) + '...' || r.summary,
              source: r.url,
              date: r.publishedDate
            }));
            break;
          case 'case_studies':
            title = 'Case Studies';
            findings = searchResults.results.map(r => ({
              type: 'example',
              title: r.title,
              summary: r.text?.slice(0, 300) + '...' || r.summary,
              source: r.url,
              date: r.publishedDate
            }));
            break;
          case 'financial':
            title = 'Financial & Resource Data';
            findings = searchResults.results.map(r => ({
              type: 'data',
              title: r.title,
              summary: r.text?.slice(0, 300) + '...' || r.summary,
              source: r.url,
              date: r.publishedDate
            }));
            break;
          case 'alternatives':
            title = 'Alternatives & Options';
            findings = searchResults.results.map(r => ({
              type: 'option',
              title: r.title,
              summary: r.text?.slice(0, 300) + '...' || r.summary,
              source: r.url,
              date: r.publishedDate
            }));
            break;
          default:
            title = category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            findings = searchResults.results.map(r => ({
              type: 'info',
              title: r.title,
              summary: r.text?.slice(0, 300) + '...' || r.summary,
              source: r.url,
              date: r.publishedDate
            }));
        }

        research[category] = {
          title,
          findings: findings.length > 0 ? findings : [{
            type: 'info',
            title: `No results found for ${category}`,
            summary: `Try adjusting your search terms about ${category}`,
            source: '',
            date: new Date().toISOString()
          }]
        };

        console.log(`✅ [RESEARCH] ${title}: ${findings.length} results found`);
      } catch (error) {
        console.error(`❌ [RESEARCH] Failed search for ${category}:`, error.message);
        research[category] = {
          title: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          findings: [{
            type: 'error',
            title: `Search unavailable`,
            summary: `Unable to fetch ${category} data at this time. Consider this aspect in your decision.`,
            source: '',
            date: new Date().toISOString()
          }]
        };
      }
    }

    console.log('📤 [API RESPONSE] Research categories generated');
    res.json({ research });
  } catch (error) {
    console.error('❌ [API ERROR]:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message, type: 'research_execution_failed' });
  }
});

app.post('/api/generate/synthesis', async (req, res) => {
  console.log('\n📨 [API REQUEST] /api/generate/synthesis');

  try {
    const { problem, context, meaningmaking, research } = req.body;

    // MOCK MODE: Return hardcoded response
    if (MOCK_MODE) {
      await simulateDelay(700);
      console.log('🎭 [MOCK] Returning hardcoded synthesis prompt');
      console.log('📤 [API RESPONSE] Synthesis prompt generated');
      return res.json(MOCK_RESPONSES.synthesis);
    }

    // REAL MODE: Call GLM API
    const messages = [
      { role: 'system', content: PROMPTS.SYNTHESIS },
      {
        role: 'user',
        content: `Problem: ${problem}\n\nValues stated: ${JSON.stringify(meaningmaking)}\n\nResearch findings: ${JSON.stringify(research)}\n\nGenerate synthesis prompt.`
      }
    ];

    const response = await callGLM(messages, 'glm-4.5-air', 0.6);
    const parsed = parseJSON(response);

    console.log('📤 [API RESPONSE] Synthesis prompt generated');
    res.json(parsed || { prompt: "Based on your values and the research, what are your 3-5 absolute non-negotiables?" });
  } catch (error) {
    console.error('❌ [API ERROR]:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message, type: 'synthesis_generation_failed' });
  }
});

app.post('/api/generate/iteration', async (req, res) => {
  console.log('\n📨 [API REQUEST] /api/generate/iteration');

  try {
    const { tensions, previousAnswers } = req.body;

    // MOCK MODE: Return hardcoded response
    if (MOCK_MODE) {
      await simulateDelay(900);
      console.log('🎭 [MOCK] Returning hardcoded iteration questions');
      console.log('📤 [API RESPONSE] Iteration questions generated:', MOCK_RESPONSES.iteration.questions.length);
      return res.json(MOCK_RESPONSES.iteration);
    }

    // REAL MODE: Call GLM API
    const messages = [
      { role: 'system', content: PROMPTS.ITERATION },
      {
        role: 'user',
        content: `Identified tensions: ${JSON.stringify(tensions)}\n\nPrevious answers: ${JSON.stringify(previousAnswers)}\n\nGenerate deeper questions.`
      }
    ];

    const response = await callGLM(messages, 'glm-4.5-air', 0.8);
    const parsed = parseJSON(response);

    console.log('📤 [API RESPONSE] Iteration questions generated');
    res.json(parsed);
  } catch (error) {
    console.error('❌ [API ERROR]:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message, type: 'iteration_generation_failed' });
  }
});

app.post('/api/generate/decision', async (req, res) => {
  console.log('\n📨 [API REQUEST] /api/generate/decision');

  try {
    const { values, tradeoffs, nonNegotiables, tensions } = req.body;

    // MOCK MODE: Return hardcoded response
    if (MOCK_MODE) {
      await simulateDelay(600);
      console.log('🎭 [MOCK] Returning hardcoded decision template');
      console.log('📤 [API RESPONSE] Decision template generated');
      return res.json(MOCK_RESPONSES.decision);
    }

    // REAL MODE: Call GLM API
    const messages = [
      { role: 'system', content: PROMPTS.DECISION },
      {
        role: 'user',
        content: `Top values: ${JSON.stringify(values)}\n\nAccepted tradeoffs: ${JSON.stringify(tradeoffs)}\n\nNon-negotiables: ${JSON.stringify(nonNegotiables)}\n\nKey tensions: ${JSON.stringify(tensions)}\n\nGenerate decision template.`
      }
    ];

    const response = await callGLM(messages, 'glm-4.5-air', 0.5);
    const parsed = parseJSON(response);

    console.log('📤 [API RESPONSE] Decision template generated');
    res.json(parsed);
  } catch (error) {
    console.error('❌ [API ERROR]:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message, type: 'decision_generation_failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 AI API Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);

  if (MOCK_MODE) {
    console.log(`\n🎭 MOCK MODE: ENABLED`);
    console.log(`💰 All LLM calls return hardcoded responses`);
    console.log(`⚡ No API costs, instant responses`);
    console.log(`📝 Edit server/MOCK_RESPONSES.js to customize responses`);
  } else {
    console.log(`\n🤖 LIVE MODE: Using GLM-4.5 via z.ai`);
    console.log(`💸 API calls will incur costs`);
    console.log(`⏱️  Responses may take 2-5 seconds`);
    console.log(`🔄 Set MOCK_MODE=true in .env to use mock data`);
  }

  console.log(`${'='.repeat(60)}\n`);
});
