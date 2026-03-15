import type { ConversationMessage } from '../shared/types.js';
import { config } from '../shared/config.js';

// In-memory storage (in production, use a database)
const conversationStore = new Map<string, ConversationMessage[]>();

export class MemoryAgent {
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
