import { bedrockClient } from '../shared/bedrock.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

export class GuidanceAgent {
  private systemPrompt = `You are the Guidance agent for Polis, specialized in helping citizens navigate government services.
Your role is to:
1. Explain eligibility requirements clearly
2. Provide comprehensive lists of required documents
3. Give step-by-step instructions for completing applications
4. Answer questions about the application process
5. Help users understand what to expect at each stage

Always be thorough, patient, and encouraging. Break down complex processes into simple steps.`;

  async provideGuidance(query: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await bedrockClient.invokeModel({
        modelId: config.model.modelId,
        systemPrompt: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: query,
          },
        ],
        temperature: 0.4,
      });

      return {
        success: true,
        data: {
          response: result.content,
          guidance: 'Detailed guidance provided',
        },
        metadata: {
          sessionId: context.sessionId,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Guidance error',
      };
    }
  }
}
