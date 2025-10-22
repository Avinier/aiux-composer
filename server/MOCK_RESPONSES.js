/**
 * Mock Responses for AI Integration Testing
 * ==========================================
 * Hardcoded responses for all LLM endpoints to save on API costs during development
 * Enable with: MOCK_MODE=true in .env
 */

export const MOCK_RESPONSES = {
  /**
   * Context Questions (Stage 1)
   * Format: { questions: [{id, question, title, why_factual}] }
   */
  context: {
    preamble: "Let's start by understanding the facts of your situation. These questions help establish the practical landscape - think of this as taking inventory before deciding what to build.",
    questions: [
      {
        id: "1a",
        question: "What financial resources do you currently have available to invest in starting a business?",
        title: "Financial Resources",
        why_factual: "This establishes concrete financial constraints without requiring judgment about whether the amount is sufficient"
      },
      {
        id: "1b",
        question: "What specific skills or professional experience do you have that could be applied to running a business?",
        title: "Skills & Experience",
        why_factual: "This identifies verifiable capabilities without evaluating which skills are more valuable for entrepreneurship"
      },
      {
        id: "1c",
        question: "How many hours per week are you currently able to dedicate to developing and running a business?",
        title: "Time Availability",
        why_factual: "This quantifies a measurable resource without assessing whether it's adequate for business success"
      },
      {
        id: "1d",
        question: "What industries or markets do you have direct experience with or knowledge about?",
        title: "Market Knowledge",
        why_factual: "This maps factual knowledge and experience without judging what would be the best market to pursue"
      }
    ]
  },

  /**
   * Meaningmaking Questions (Stage 2)
   * Format: { questions: [{id, question, title, why_values}] }
   */
  meaningmaking: {
    preamble: "Now we shift from WHAT IS (facts) to WHAT MATTERS (values). These questions can't be answered by AI or research - only YOU can decide what's important. There are no right answers.",
    questions: [
      {
        id: "2a",
        question: "In 5 years, looking back at this decision, what would make you feel this was the RIGHT choice? What specific outcomes or experiences?",
        title: "Success Vision",
        why_values: "Forces articulation of personal success criteria that research cannot determine"
      },
      {
        id: "2b",
        question: "What's the worst outcome you can imagine, and WHY would it be devastating to you specifically? What makes that outcome intolerable?",
        title: "Failure Fear",
        why_values: "Reveals personal risk boundaries and what the user truly wants to avoid"
      },
      {
        id: "2c",
        question: "Rank these in order of willingness to sacrifice: Time with family, Financial security, Health/sleep, Creative control, Social status",
        title: "Sacrifice Ranking",
        why_values: "Forces explicit prioritization of competing values - only the user can decide their hierarchy"
      },
      {
        id: "2d",
        question: "What kind of work energizes you versus drains you? Be specific about activities, not just outcomes.",
        title: "Work Energy",
        why_values: "Identifies intrinsic motivations that determine sustainable commitment"
      },
      {
        id: "2e",
        question: "If forced to choose: $200k/year doing something meaningless, or $60k/year doing something deeply meaningful to you?",
        title: "Impact vs Income",
        why_values: "Classic values tradeoff revealing income vs purpose priorities"
      },
      {
        id: "2f",
        question: "Imagine: You're 8 months in, savings down to $10k, no revenue yet but momentum building. Continue or pivot?",
        title: "Risk Tolerance",
        why_values: "Tests actual risk tolerance under realistic pressure scenario"
      }
    ]
  },

  /**
   * Research Data (Stage 3)
   * Format: Array of research boxes with {id, boxId, label, userValue, content}
   */
  research: [
    {
      id: "box3a",
      boxId: "3a",
      label: "Market & Competition",
      userValue: "Because you mentioned creative control matters, here's data on market dynamics",
      content: "**Solo Founder Success Rates:**\n• 18-24 months to first profitable month (median)\n• 65% of successful founders kept day job initially\n• Break-even: 16-20 months average\n\n**Market Reality:**\n• Service businesses: Lower barrier, faster revenue\n• Product businesses: Higher risk, more scalable\n• Competition: Saturated in most markets\n• Differentiation: Critical from day 1"
    },
    {
      id: "box3b",
      boxId: "3b",
      label: "Financial Requirements",
      userValue: "Based on your available resources and financial situation",
      content: "**Realistic Financial Model:**\n• Minimum runway: $40-60k (12-18 months)\n• Monthly burn rate: $3-5k (minimal lifestyle)\n• First revenue: Month 4-8 typical\n• Profitable: Month 14-22 median\n\n**Hidden Costs:**\n• Health insurance: $400-600/mo\n• Business tools/software: $200-500/mo\n• Marketing/ads: $500-2000/mo\n• Unexpected expenses: 30% buffer needed"
    },
    {
      id: "box3c",
      boxId: "3c",
      label: "Time & Lifestyle Impact",
      userValue: "Given your concerns about time with family and health",
      content: "**Time Reality Check:**\n• Year 1: 60-80 hours/week typical\n• Weekends: Usually working\n• Vacation: Rare first 2 years\n• Stress levels: High, especially months 6-18\n\n**Relationship Impact:**\n• 40% report relationship strain\n• Family time: 50-70% reduction reported\n• Social life: Nearly eliminated first year\n• Physical health: Often neglected"
    }
  ],

  /**
   * Synthesis Prompt (Stage 4)
   * Format: { questionPrompt, insights }
   */
  synthesis: {
    questionPrompt: "Based on everything above - your values AND the reality data - what are your 3-5 absolute non-negotiables? What must be true for you to proceed?",
    insights: [
      "You've stated that creative control matters more than high income",
      "The data shows most successful founders sacrifice significant family time",
      "Your risk tolerance test suggests you're willing to push through uncertainty",
      "Financial reality requires 16-20 months runway - do you have this?"
    ]
  },

  /**
   * Tensions (Stage 5)
   * Format: { tensions: [{id, title, description, prompt}] }
   */
  tensions: {
    tensions: [
      {
        id: "5a",
        title: "Time vs Reality",
        description: "You value family time but research shows 60-80hr weeks for 2+ years",
        prompt: "You said family time is important, but the data shows founders typically work 60-80 hours/week for the first 2 years. How do you reconcile wanting to preserve family time with the realistic time demands of building a business?"
      },
      {
        id: "5b",
        title: "Income vs Meaning",
        prompt: "You chose meaningful work over high income ($60k vs $200k), but you need $40-60k runway and 16-20 months to profitability. With potentially $0 income for nearly 2 years, can you actually sustain your choice for meaningful work? What's your real bottom line?"
      },
      {
        id: "5c",
        title: "Control vs Capability",
        description: "You want creative control but may lack some crucial business skills",
        prompt: "You ranked creative control very high in your values. But the research shows that founders with skill gaps who insist on solo control have lower success rates. Would you consider partnership or mentorship to fill gaps, or is solo control truly non-negotiable even if it reduces your chances?"
      }
    ]
  },

  /**
   * Iteration Questions (Stage 6)
   * Format: { questions: [{id, question, title}] }
   */
  iteration: {
    preamble: "Based on the tensions you've identified, let's go deeper. These questions probe the contradictions to help you find your real boundaries.",
    questions: [
      {
        id: "2g",
        question: "You said family time is important, but accepting 60-80hr weeks. What's the MINIMUM family time per week you'd need to feel okay? Be specific: hours, which days, what activities?",
        title: "Minimum Family Time"
      },
      {
        id: "2h",
        question: "At what exact dollar amount in savings would you stop and get a job? $5k? $10k? $20k? What's your real shutdown number?",
        title: "Financial Floor"
      },
      {
        id: "2i",
        question: "If you had to partner with someone to fill your skill gaps, what would you absolutely NOT compromise on? What must you retain control over?",
        title: "Control Boundaries"
      }
    ]
  },

  /**
   * Decision Template (Stage 7)
   * Format: { template, sections }
   */
  decision: {
    template: "Given everything you've explored - your stated values, the reality data, and the tensions you've worked through - what is your ACTUAL decision?",
    sections: [
      "If YES to starting the business:",
      "  - What's your FIRST concrete action this week?",
      "  - What's your shutdown threshold (specific $ or date)?",
      "  - What's your minimum weekly family time commitment?",
      "",
      "If NO to starting the business:",
      "  - What will you do instead?",
      "  - What did this process reveal about what you actually want?",
      "  - Is there a modified version that addresses the tensions?"
    ]
  }
};

/**
 * Helper function to simulate API delay (optional, for realism)
 */
export function simulateDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
