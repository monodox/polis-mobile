import { bedrockClient } from '../shared/bedrock.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

export class ChatAgent {
  private systemPrompt = `You are the Chat agent for Polis, a friendly government services assistant.
Your role is to:
1. Engage in natural, helpful conversations with citizens
2. Answer questions about government services in a clear, accessible way
3. Maintain a warm, professional tone
4. Simplify complex government processes into easy-to-understand language
5. Be empathetic and patient with users who may be confused or frustrated

Always prioritize clarity and helpfulness. Use simple language and avoid jargon.`;

  async chat(message: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await bedrockClient.invokeModel({
        modelId: config.model.modelId,
        systemPrompt: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: `User (${context.language}): ${message}`,
          },
        ],
        temperature: 0.8,
      });

      return {
        success: true,
        data: {
          response: result.content,
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
    return bedrockClient.invokeModelStream({
      modelId: config.model.modelId,
      systemPrompt: this.systemPrompt,
      messages: [
        {
          role: 'user',
          content: `User (${context.language}): ${message}`,
        },
      ],
      temperature: 0.8,
    });
  }
}
