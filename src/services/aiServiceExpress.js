/**
 * AI Service for Express Backend
 * ===============================
 * Simplified API client for Express server endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class AIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Make API request
   */
  async request(endpoint, body) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Generate context questions
   */
  async generateContextQuestions(problemText) {
    const response = await this.request('/api/generate/context', {
      text: problemText
    });

    console.log('📥 [AI SERVICE] Received context response:', response);
    console.log('📋 [AI SERVICE] Questions count:', response.questions?.length);

    const mapped = response.questions.map((q, i) => ({
      id: q.id,
      prompt: q.question,
      title: q.title
    }));

    console.log('🔄 [AI SERVICE] Mapped questions:', mapped.map(q => `${q.id}: ${q.title}`).join(', '));
    return mapped;
  }

  /**
   * Generate meaningmaking questions
   */
  async generateMeaningmakingQuestions(problem, contextAnswers) {
    const response = await this.request('/api/generate/meaningmaking', {
      problem,
      answers: contextAnswers
    });

    return response.questions.map(q => ({
      id: q.id,
      prompt: q.question,
      title: q.title
    }));
  }

  /**
   * Execute research
   */
  async executeResearch(problem, context, meaningmaking) {
    const response = await this.request('/api/research/execute', {
      problem,
      context,
      meaningmaking
    });

    return {
      market: response.research.market_analysis,
      cases: response.research.case_studies,
      financial: response.research.financial_data,
      alternatives: response.research.alternatives
    };
  }

  /**
   * Generate tensions
   */
  async generateTensions(sessionData) {
    const response = await this.request('/api/generate/tensions', {
      problem: sessionData.problem,
      context: sessionData.context,
      meaningmaking: sessionData.meaningmaking,
      research: sessionData.research,
      synthesis: sessionData.synthesis
    });

    return response.tensions.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      prompt: t.question
    }));
  }

  /**
   * Generate synthesis prompt
   */
  async generateSynthesisPrompt(problem, context, meaningmaking) {
    // For now, return a static prompt
    // You can add an endpoint for this if needed
    return {
      prompt: "Based on everything you've shared about your values and the research data...",
      insights: [
        "Your timeline expectations may need adjustment",
        "Your skill gaps require a strategic solution",
        "Your risk tolerance suggests a specific approach"
      ],
      questionPrompt: "What are your 3-5 absolute, non-negotiable requirements for any path forward?"
    };
  }

  /**
   * Generate iteration questions
   */
  async generateIterationQuestions(sessionData) {
    // Simplified - reuse meaningmaking endpoint with context from tensions
    const response = await this.request('/api/generate/meaningmaking', {
      problem: sessionData.problem,
      answers: {
        ...sessionData.context,
        tensions: JSON.stringify(sessionData.tensions)
      }
    });

    return response.questions.slice(0, 4).map((q, i) => ({
      id: `6${String.fromCharCode(97 + i)}`, // 6a, 6b, etc.
      prompt: q.question,
      title: q.title
    }));
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

export default new AIService();