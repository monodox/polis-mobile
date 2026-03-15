import { bedrockClient } from '../shared/bedrock.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

export class SearchAgent {
  private systemPrompt = `You are the Search agent for Polis, specialized in finding government services.
Your role is to:
1. Search and retrieve relevant government service information
2. Match user queries to appropriate services
3. Provide accurate, up-to-date information about services
4. Help users discover services they may not know about

Present results clearly and concisely.`;

  async search(query: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await bedrockClient.invokeModel({
        modelId: config.model.modelId,
        systemPrompt: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Find government services for: "${query}"`,
          },
        ],
        temperature: 0.3,
      });

      return {
        success: true,
        data: {
          response: result.content,
          query,
        },
        metadata: {
          sessionId: context.sessionId,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search error',
      };
    }
  }
}
