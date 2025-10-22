/**
 * AI Service for Meaningmaking Canvas
 * ====================================
 * Handles all communication with the backend AI service.
 * Implements the meaningmaking framework with GLM-4.5.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

class AIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make a request to the API
   */
  async request(endpoint, method = 'GET', body = null) {
    console.log(`\n🌐 [AI SERVICE REQUEST] ${method} ${endpoint}`);
    if (body) {
      console.log('Request Body:', body);
    }

    try {
      const options = {
        method,
        headers: this.headers,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);

      if (!response.ok) {
        const error = await response.json();
        console.error(`❌ [AI SERVICE ERROR] ${endpoint}:`, error);
        throw new Error(error.detail || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ [AI SERVICE RESPONSE] ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`❌ [AI SERVICE FAILED] ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Generate context-gathering questions based on user's problem
   * @param {string} problemText - The user's problem description
   * @returns {Promise<Array>} Array of context questions
   */
  async generateContextQuestions(problemText) {
    const response = await this.request('/api/generate/context', 'POST', {
      text: problemText
    });

    // Transform questions to match the node generator format
    // IMPORTANT: Context boxes must be 1a, 1b, 1c, 1d (not 1a, 2a, 3a, 4a)
    return response.questions.map((q, index) => ({
      id: `1${String.fromCharCode(97 + index)}`, // Force to 1a, 1b, 1c, 1d
      prompt: q.question,
      title: q.title
    }));
  }

  /**
   * Generate meaningmaking questions based on context
   * @param {string} problem - The user's problem
   * @param {Object} contextAnswers - Answers to context questions
   * @returns {Promise<Array>} Array of meaningmaking questions
   */
  async generateMeaningmakingQuestions(problem, contextAnswers) {
    const response = await this.request('/api/generate/meaningmaking', 'POST', {
      problem,
      answers: contextAnswers
    });

    // IMPORTANT: Meaningmaking boxes must be 2a, 2b, 2c, 2d, 2e, 2f
    return response.questions.map((q, index) => ({
      id: `2${String.fromCharCode(97 + index)}`, // Force to 2a, 2b, 2c, etc.
      prompt: q.question,
      title: q.title
    }));
  }

  /**
   * Execute research based on user's values and context
   * @param {string} problem - The user's problem
   * @param {Object} context - Context answers
   * @param {Object} meaningmaking - Meaningmaking answers
   * @returns {Promise<Object>} Research findings
   */
  async executeResearch(problem, context, meaningmaking) {
    const response = await this.request('/research/execute', 'POST', {
      problem,
      context,
      meaningmaking
    });

    // Transform research data into display format
    return {
      market: response.research.market_analysis,
      cases: response.research.case_studies,
      financial: response.research.financial_data,
      alternatives: response.research.alternatives,
      raw: response.raw_response
    };
  }

  /**
   * Generate synthesis prompt
   * @param {string} problem - The user's problem
   * @param {Object} context - Context answers
   * @param {Object} meaningmaking - Meaningmaking answers
   * @returns {Promise<Object>} Synthesis prompt and insights
   */
  async generateSynthesisPrompt(problem, context, meaningmaking) {
    const response = await this.request('/generate/synthesis-prompt', 'POST', {
      problem,
      context,
      meaningmaking
    });

    return {
      prompt: response.synthesis_prompt,
      insights: response.key_insights,
      questionPrompt: response.prompt_for_nonnegotiables
    };
  }

  /**
   * Identify tensions between values and reality
   * @param {Object} data - All user data and research
   * @returns {Promise<Array>} Array of tensions
   */
  async generateTensions(data) {
    const response = await this.request('/api/generate/tensions', 'POST', {
      problem: data.problem,
      context: data.context,
      meaningmaking: data.meaningmaking,
      research_data: data.research,
      synthesis: data.synthesis
    });

    // IMPORTANT: Tension boxes must be 5a, 5b, 5c
    return response.tensions.map((t, index) => ({
      id: `5${String.fromCharCode(97 + index)}`, // Force to 5a, 5b, 5c
      title: t.title || `Tension ${index + 1}`,
      prompt: t.question || t.productive_question || "How will you resolve this tension?",
      description: t.description || t.observation
    }));
  }

  /**
   * Generate iteration questions based on tensions
   * @param {Object} data - All session data including tensions
   * @returns {Promise<Array>} Array of refined questions
   */
  async generateIterationQuestions(data) {
    const response = await this.request('/generate/iteration-questions', 'POST', {
      problem: data.problem,
      context: data.context,
      meaningmaking: data.meaningmaking,
      research_data: { tensions: data.tensions },
      synthesis: data.synthesis
    });

    // IMPORTANT: Iteration questions reuse meaningmaking positions (2a, 2b, etc.)
    // but with iteration round offset handled in node generator
    return response.questions.map((q, index) => ({
      id: `2${String.fromCharCode(97 + index)}`, // 2a, 2b, 2c, etc.
      prompt: q.question,
      title: q.title
    }));
  }

  /**
   * Stream AI thinking process
   * @param {Object} context - Current context
   * @returns {Promise<ReadableStream>} Stream of thinking
   */
  async streamThinking(context) {
    // This would implement actual streaming
    // For now, return a promise that resolves with thinking text
    const response = await this.request('/thinking/stream', 'POST', context);
    return response.thinking;
  }

  /**
   * Export complete session
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} Exported session data
   */
  async exportSession(sessionId) {
    return await this.request(`/export/${sessionId}`);
  }

  /**
   * Health check
   * @returns {Promise<boolean>} Service health status
   */
  async healthCheck() {
    try {
      const response = await this.request('/health');
      return response.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export default new AIService();