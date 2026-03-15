import { bedrockClient } from '../shared/bedrock.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

export class VoiceAgent {
  private systemPrompt = `You are the Voice agent for Polis, powered by Amazon Nova Sonic 2.
Your role is to:
1. Process real-time voice input with high accuracy
2. Generate natural, conversational speech responses
3. Detect user intent and emotional context from voice
4. Support multilingual voice interactions (English, Spanish, French)
5. Provide low-latency voice responses for seamless conversation

Always prioritize natural conversation flow and accessibility.`;

  async processVoice(audioData: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await bedrockClient.invokeModel({
        modelId: config.voice.modelId,
        systemPrompt: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Process voice input in ${context.language}`,
          },
        ],
      });

      return {
        success: true,
        data: {
          transcription: 'Transcribed text',
          response: result.content,
        },
        metadata: {
          sessionId: context.sessionId,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Voice processing error',
      };
    }
  }
}
