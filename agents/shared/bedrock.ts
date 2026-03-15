import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { fromEnv } from '@aws-sdk/credential-providers';
import { config } from './config.js';

export class BedrockClient {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: config.model.region,
      credentials: fromEnv(),
    });
  }

  async invokeModel(params: {
    modelId: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    const { modelId, messages, systemPrompt, temperature = 0.7, maxTokens = 2048 } = params;

    const body = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: maxTokens,
      temperature,
      messages,
      ...(systemPrompt && { system: systemPrompt }),
    };

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(body),
    });

    const response = await this.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return {
      content: responseBody.content[0].text,
      stopReason: responseBody.stop_reason,
      usage: responseBody.usage,
    };
  }

  async *invokeModelStream(params: {
    modelId: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    const { modelId, messages, systemPrompt, temperature = 0.7, maxTokens = 2048 } = params;

    const body = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: maxTokens,
      temperature,
      messages,
      ...(systemPrompt && { system: systemPrompt }),
    };

    const command = new InvokeModelWithResponseStreamCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(body),
    });

    const response = await this.client.send(command);

    if (response.body) {
      for await (const event of response.body) {
        if (event.chunk) {
          const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes));
          
          if (chunk.type === 'content_block_delta') {
            yield {
              type: 'content',
              text: chunk.delta.text,
            };
          } else if (chunk.type === 'message_stop') {
            yield {
              type: 'stop',
              stopReason: chunk.stop_reason,
            };
          }
        }
      }
    }
  }

  async invokeNovaAct(params: {
    task: string;
    url?: string;
    context?: Record<string, any>;
  }) {
    // Nova Act specific invocation
    const { task, url, context } = params;

    const body = {
      task,
      ...(url && { url }),
      ...(context && { context }),
    };

    const command = new InvokeModelCommand({
      modelId: config.act.modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(body),
    });

    const response = await this.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody;
  }

  async invokeNovaSonic(params: {
    audioData?: string;
    text?: string;
    operation: 'transcribe' | 'synthesize';
    language?: string;
  }) {
    // Nova Sonic specific invocation
    const { audioData, text, operation, language = 'en' } = params;

    const body = {
      operation,
      language,
      ...(audioData && { audio: audioData }),
      ...(text && { text }),
    };

    const command = new InvokeModelCommand({
      modelId: config.voice.modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(body),
    });

    const response = await this.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody;
  }
}

// Singleton instance
export const bedrockClient = new BedrockClient();
