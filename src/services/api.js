/**
 * API Service for Meaningmaking Canvas
 * Connects to Express backend with GLM integration
 */

const API_BASE = import.meta.env.VITE_API_URL;

class MeaningmakingAPI {
  constructor() {
    this.sessionId = Date.now().toString();
    this.cache = new Map();
  }

  async request(endpoint, data = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      // Return fallback data during development if API is down
      if (import.meta.env.DEV) {
        return this.getFallbackData(endpoint, data);
      }
      throw error;
    }
  }

  // Get the tool framework introduction
  async getFoundation() {
    try {
      const response = await fetch(`${API_BASE}/api/foundation`);
      if (!response.ok) {
        // Return default foundation if endpoint doesn't exist
        return {
          title: "Understanding Your Thinking Tool",
          content: "Think of this system like a knife in cooking - it helps you prepare ingredients (information), but YOU decide what to cook (what matters). I'll help you discover your values through structured questions. There are no 'correct' answers - only YOUR answers.",
          metaphor: "knife",
          principles: [
            "You decide what matters",
            "I help organize information",
            "No correct answers exist",
            "Revision is refinement"
          ]
        };
      }
      return response.json();
    } catch (error) {
      console.error('Foundation fetch failed:', error);
      // Return default foundation
      return {
        title: "Understanding Your Thinking Tool",
        content: "Think of this system like a knife in cooking - it helps you prepare ingredients (information), but YOU decide what to cook (what matters). I'll help you discover your values through structured questions. There are no 'correct' answers - only YOUR answers.",
        metaphor: "knife",
        principles: [
          "You decide what matters",
          "I help organize information",
          "No correct answers exist",
          "Revision is refinement"
        ]
      };
    }
  }

  // Generate context questions from problem statement
  async generateContextQuestions(problemText) {
    const result = await this.request('/api/generate/context', {
      text: problemText
    });

    // Transform to match frontend expectations
    // IMPORTANT: Context boxes must be box1a, box1b, box1c, box1d (not box1a, box2a, box3a)
    return result.questions.map((q, index) => {
      const boxId = `1${String.fromCharCode(97 + index)}`; // 1a, 1b, 1c, 1d
      return {
        id: `box${boxId}`,
        boxId: boxId,
        label: q.title || `Context ${index + 1}`,
        question: q.question,
        preamble: result.preamble || null,
        whyFactual: q.why_factual || q.why || "Understanding your current situation"
      };
    });
  }

  // Generate meaningmaking questions from context
  async generateMeaningmakingQuestions(problem, contextAnswers) {
    const result = await this.request('/api/generate/meaningmaking', {
      problem,
      answers: contextAnswers
    });

    // IMPORTANT: Meaningmaking boxes must be box2a, box2b, box2c, box2d, box2e, box2f
    return result.questions.map((q, index) => {
      const boxId = `2${String.fromCharCode(97 + index)}`; // 2a, 2b, 2c, 2d, 2e, 2f
      return {
        id: `box${boxId}`,
        boxId: boxId,
        label: q.title || `Values ${index + 1}`,
        question: q.question,
        discoveryGoal: q.discovery_goal || "Discovering what matters to you",
        possibleTension: q.possible_tension,
        followUpNote: q.follow_up_note
      };
    });
  }

  // Generate VALUE-RESPONSIVE research (critical improvement)
  async executeResearch(problem, contextAnswers, meaningmakingAnswers) {
    const result = await this.request('/api/research/execute', {
      problem,
      context: contextAnswers,
      meaningmaking: meaningmakingAnswers
    });

    // Handle both new format and legacy format
    if (result.research && Array.isArray(result.research)) {
      // New format with value-responsive research
      return result.research.map((item, index) => ({
        id: `box3${String.fromCharCode(97 + index)}`, // 3a, 3b, 3c...
        boxId: `3${String.fromCharCode(97 + index)}`,
        label: item.research_focus || item.title || `Research ${index + 1}`,
        userValue: item.user_value || `Based on what you said matters`,
        content: Array.isArray(item.specific_queries)
          ? item.specific_queries.map(q => `• ${q}`).join('\n')
          : (item.findings ? item.findings.join('\n') : 'Research data loading...'),
        neutralityCheck: item.neutrality_check
      }));
    } else if (result.research && typeof result.research === 'object') {
      // Research format with structured findings from Exa API
      return Object.entries(result.research).map(([key, value], index) => {
        // Format the findings from Exa API results
        let formattedFindings = [];

        if (Array.isArray(value.findings)) {
          formattedFindings = value.findings.map(f => {
            if (typeof f === 'object' && f.title && f.summary) {
              // New Exa format - format title and summary
              return `• ${f.title}\n  ${f.summary}${f.source ? `\n  🔗 ${f.source}` : ''}`;
            } else if (typeof f === 'string') {
              // Simple string format
              return `• ${f}`;
            }
            return `• ${JSON.stringify(f)}`;
          });
        } else if (value.findings && typeof value.findings === 'string') {
          formattedFindings = [`• ${value.findings}`];
        }

        return {
          id: `box3${String.fromCharCode(97 + index)}`,
          boxId: `3${String.fromCharCode(97 + index)}`,
          label: value.title || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          userValue: `Research tailored to your values`,
          content: formattedFindings.length > 0 ? formattedFindings.join('\n\n') : 'Research data loading...',
          neutralityCheck: null
        };
      });
    }

    // Fallback if no research data
    return [];
  }

  // Generate synthesis prompt
  async generateSynthesis(problem, context, meaningmaking, research) {
    const result = await this.request('/api/generate/synthesis', {
      problem,
      context,
      meaningmaking,
      research
    });

    return {
      preamble: result.preamble || "Time to identify what's truly non-negotiable for you",
      prompt: result.synthesis_prompt || result.prompt || "Based on your values and the research, what are your 3-5 absolute non-negotiables?",
      tensionsPreview: result.tensions_preview,
      iterationInvitation: result.iteration_invitation
    };
  }

  // Generate tensions
  async generateTensions(problem, context, meaningmaking, research, synthesis) {
    const result = await this.request('/api/generate/tensions', {
      problem,
      context,
      meaningmaking,
      research,
      synthesis
    });

    // IMPORTANT: Tension boxes must be box5a, box5b, box5c
    return result.tensions.map((t, index) => {
      const boxId = `5${String.fromCharCode(97 + index)}`; // 5a, 5b, 5c
      return {
        id: `box${boxId}`,
        boxId: boxId,
        label: t.title || `Tension ${index + 1}`,
        observation: t.observation || t.description,
        tension: t.the_tension || t.tension || "A potential conflict to resolve",
        question: t.productive_question || t.question || "How will you resolve this?",
        learningOpportunity: t.learning_opportunity
      };
    });
  }

  // Generate iteration questions
  async generateIterationQuestions(tensions, sessionData, round) {
    const result = await this.request('/api/generate/iteration', {
      tensions,
      previousAnswers: sessionData,
      round
    });

    return result.questions || [];
  }

  // Generate decision template
  async generateDecisionTemplate(fullJourney) {
    const result = await this.request('/api/generate/decision', {
      values: fullJourney.meaningmaking,
      tradeoffs: fullJourney.tensions,
      nonNegotiables: fullJourney.synthesis,
      tensions: fullJourney.tensions
    });

    return result;
  }

  // Fallback data for development when API is down
  getFallbackData(endpoint, data) {
    console.warn(`Using fallback data for ${endpoint}`);

    switch(endpoint) {
      case '/api/generate/context':
        return {
          questions: [
            { id: "1a", title: "Current Situation", question: "What's your current situation regarding this decision?" },
            { id: "1b", title: "Timeline", question: "What's your timeline for making this decision?" },
            { id: "1c", title: "Resources", question: "What resources (time, money, energy) can you allocate?" },
            { id: "1d", title: "Constraints", question: "What constraints or limitations exist?" }
          ]
        };

      case '/api/generate/meaningmaking':
        return {
          questions: [
            { id: "2a", title: "Core Values", question: "What matters most to you in this situation?" },
            { id: "2b", title: "Success Definition", question: "What would success look like to you?" },
            { id: "2c", title: "Fear Points", question: "What are you most afraid of happening?" },
            { id: "2d", title: "Trade-offs", question: "What are you willing to sacrifice?" },
            { id: "2e", title: "Non-negotiables", question: "What's absolutely non-negotiable for you?" },
            { id: "2f", title: "Future Self", question: "What would your future self thank you for prioritizing?" }
          ]
        };

      case '/api/research/execute':
        return {
          research: [
            {
              research_focus: "Market Analysis",
              user_value: "Based on your emphasis on financial security",
              specific_queries: [
                "Current market conditions",
                "Growth projections",
                "Risk factors"
              ]
            },
            {
              research_focus: "Case Studies",
              user_value: "Related to your concern about work-life balance",
              specific_queries: [
                "Similar situations",
                "Success stories",
                "Common pitfalls"
              ]
            },
            {
              research_focus: "Resource Requirements",
              user_value: "Considering your timeline constraints",
              specific_queries: [
                "Time investment needed",
                "Financial requirements",
                "Support systems required"
              ]
            }
          ]
        };

      case '/api/generate/tensions':
        return {
          tensions: [
            {
              id: "5a",
              title: "Time vs Reality",
              question: "How do you reconcile urgency with realistic timelines?",
              description: "Your expectations vs actual requirements"
            },
            {
              id: "5b",
              title: "Income vs Risk",
              question: "Is your risk tolerance aligned with income expectations?",
              description: "Financial security vs opportunity"
            },
            {
              id: "5c",
              title: "Control vs Capability",
              question: "Full control with limits OR shared control with more capability?",
              description: "Independence vs collaboration"
            }
          ]
        };

      default:
        return {};
    }
  }
}

// Export singleton instance
export const api = new MeaningmakingAPI();