import { Agent } from '@strands-agents/sdk';
import { BedrockModel } from '@strands-agents/sdk';
import { config } from '../shared/config.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

export class ChatAgent {
  private agent: Agent;

  constructor() {
    const model = new BedrockModel({
      modelId: config.model.modelId,
      region: config.model.region,
      temperature: 0.8, // Higher temperature for more natural conversation
    });

    this.agent = new Agent({
      model,
      systemPrompt: `You are the Chat agent for Polis, a friendly government services assistant.
Your role is to:
1. Engage in natural, helpful conversations with citizens
2. Answer questions about government services in a clear, accessible way
3. Maintain a warm, professional tone
4. Simplify complex government processes into easy-to-understand language
5. Be empathetic and patient with users who may be confused or frustrated

Always prioritize clarity and helpfulness. Use simple language and avoid jargon.`,
    });
  }

  async chat(message: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await this.agent.invoke(
        `User (${context.language}): ${message}`
      );

      return {
        success: true,
        data: {
          response: result.lastMessage,
          conversationId: context.sessionId,
        },
        metadata: {
          language: context.language,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Chat error',
      };
    }
  }

  async stream(message: string, context: AgentContext) {
    return this.agent.stream(`User (${context.language}): ${message}`);
  }
}
