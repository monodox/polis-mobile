import { Agent, tool } from '@strands-agents/sdk';
import { BedrockModel } from '@strands-agents/sdk';
import { z } from 'zod';
import { config } from '../shared/config.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

// Tool to route requests to appropriate agents
const routeRequest = tool({
  name: 'route_request',
  description: 'Analyze user request and determine which specialized agent should handle it',
  inputSchema: z.object({
    userMessage: z.string().describe('The user message to analyze'),
    context: z.string().describe('Additional context about the conversation'),
  }),
  callback: (input) => {
    const { userMessage } = input;
    const lowerMessage = userMessage.toLowerCase();

    // Simple routing logic based on keywords
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('what is')) {
      return JSON.stringify({ agent: 'search', reason: 'User is looking for information' });
    } else if (lowerMessage.includes('eligible') || lowerMessage.includes('qualify') || lowerMessage.includes('documents')) {
      return JSON.stringify({ agent: 'guidance', reason: 'User needs eligibility or document guidance' });
    } else if (lowerMessage.includes('voice') || lowerMessage.includes('speak')) {
      return JSON.stringify({ agent: 'voice', reason: 'User wants voice interaction' });
    } else {
      return JSON.stringify({ agent: 'chat', reason: 'General conversation' });
    }
  },
});

// Create the Core orchestrator agent
export class CoreAgent {
  private agent: Agent;

  constructor() {
    const model = new BedrockModel({
      modelId: config.model.modelId,
      region: config.model.region,
      temperature: config.model.temperature,
    });

    this.agent = new Agent({
      model,
      tools: [routeRequest],
      systemPrompt: `You are the Core orchestrator agent for Polis, a government services assistant.
Your role is to:
1. Understand user requests
2. Route them to the appropriate specialized agent (chat, voice, search, guidance, memory, safety)
3. Coordinate responses from multiple agents when needed
4. Ensure a smooth user experience

Always be helpful, clear, and efficient in routing requests.`,
    });
  }

  async processRequest(message: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await this.agent.invoke(
        `User message: "${message}"\nContext: Session ${context.sessionId}, Language: ${context.language}`
      );

      return {
        success: true,
        data: {
          response: result.lastMessage,
          routing: 'Determined by routing logic',
        },
        metadata: {
          sessionId: context.sessionId,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async stream(message: string, context: AgentContext) {
    const prompt = `User message: "${message}"\nContext: Session ${context.sessionId}, Language: ${context.language}`;
    return this.agent.stream(prompt);
  }
}
