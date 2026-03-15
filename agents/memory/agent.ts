import { Agent, tool } from '@strands-agents/sdk';
import { BedrockModel } from '@strands-agents/sdk';
import { z } from 'zod';
import { config } from '../shared/config.js';
import type { AgentContext, ConversationMessage } from '../shared/types.js';

// In-memory storage (in production, use a database)
const conversationStore = new Map<string, ConversationMessage[]>();

const storeMessage = tool({
  name: 'store_message',
  description: 'Store a conversation message in memory',
  inputSchema: z.object({
    sessionId: z.string().describe('Session identifier'),
    role: z.enum(['user', 'assistant', 'system']).describe('Message role'),
    content: z.string().describe('Message content'),
  }),
  callback: (input) => {
    const { sessionId, role, content } = input;
    const message: ConversationMessage = {
      role,
      content,
      timestamp: new Date(),
    };

    if (!conversationStore.has(sessionId)) {
      conversationStore.set(sessionId, []);
    }

    const messages = conversationStore.get(sessionId)!;
    messages.push(message);

    // Keep only last N messages
    if (messages.length > config.memory.maxMessages) {
      messages.shift();
    }

    return JSON.stringify({ stored: true, messageCount: messages.length });
  },
});

const retrieveContext = tool({
  name: 'retrieve_context',
  description: 'Retrieve conversation history and context for a session',
  inputSchema: z.object({
    sessionId: z.string().describe('Session identifier'),
    limit: z.number().optional().describe('Maximum number of messages to retrieve'),
  }),
  callback: (input) => {
    const { sessionId, limit = 10 } = input;
    const messages = conversationStore.get(sessionId) || [];
    const recentMessages = messages.slice(-limit);

    return JSON.stringify({
      sessionId,
      messageCount: recentMessages.length,
      messages: recentMessages,
    });
  },
});

export class MemoryAgent {
  private agent: Agent;

  constructor() {
    const model = new BedrockModel({
      modelId: config.model.modelId,
      region: config.model.region,
      temperature: 0.2,
    });

    this.agent = new Agent({
      model,
      tools: [storeMessage, retrieveContext],
      systemPrompt: `You are the Memory agent for Polis, responsible for managing conversation context.
Your role is to:
1. Store conversation messages and context
2. Retrieve relevant past interactions
3. Maintain conversation continuity
4. Help other agents access historical context
5. Manage session data efficiently

Always ensure data privacy and only retrieve relevant context.`,
    });
  }

  storeMessage(sessionId: string, role: 'user' | 'assistant' | 'system', content: string): void {
    const message: ConversationMessage = {
      role,
      content,
      timestamp: new Date(),
    };

    if (!conversationStore.has(sessionId)) {
      conversationStore.set(sessionId, []);
    }

    const messages = conversationStore.get(sessionId)!;
    messages.push(message);

    if (messages.length > config.memory.maxMessages) {
      messages.shift();
    }
  }

  getContext(sessionId: string, limit: number = 10): ConversationMessage[] {
    const messages = conversationStore.get(sessionId) || [];
    return messages.slice(-limit);
  }

  clearSession(sessionId: string): void {
    conversationStore.delete(sessionId);
  }
}
