import { bedrockClient } from '../shared/bedrock.js';
import { config } from '../shared/config.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

// Core orchestrator agent for Polis
export class CoreAgent {
  private systemPrompt = `You are the Core orchestrator agent for Polis, a government services assistant.
Your role is to:
1. Understand user requests
2. Route them to the appropriate specialized agent (chat, voice, search, guidance, memory, safety)
3. Coordinate responses from multiple agents when needed
4. Ensure a smooth user experience

Always be helpful, clear, and efficient in routing requests.`;

  async processRequest(message: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await bedrockClient.invokeModel({
        modelId: config.model.modelId,
        systemPrompt: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: `User message: "${message}"\nContext: Session ${context.sessionId}, Language: ${context.language}`,
          },
        ],
      });

      return {
        success: true,
        data: {
          response: result.content,
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
    
    return bedrockClient.invokeModelStream({
      modelId: config.model.modelId,
      systemPrompt: this.systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
  }
}
