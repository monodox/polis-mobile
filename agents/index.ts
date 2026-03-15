// Main entry point for Polis Agents
export { CoreAgent } from './core/index.js';
export { ChatAgent } from './chat/index.js';
export { VoiceAgent } from './voice/index.js';
export { SearchAgent } from './search/index.js';
export { GuidanceAgent } from './guidance/index.js';
export { MemoryAgent } from './memory/index.js';
export { SafetyAgent } from './safety/index.js';
export { AutomationAgent } from './automation/index.js';

// Export shared types and config
export * from './shared/types.js';
export { config } from './shared/config.js';

// Orchestrator class that manages all agents
import { CoreAgent } from './core/index.js';
import { ChatAgent } from './chat/index.js';
import { SearchAgent } from './search/index.js';
import { GuidanceAgent } from './guidance/index.js';
import { MemoryAgent } from './memory/index.js';
import { SafetyAgent } from './safety/index.js';
import { VoiceAgent } from './voice/index.js';
import { AutomationAgent } from './automation/index.js';
import type { AgentContext, AgentResponse } from './shared/types.js';

export class PolisOrchestrator {
  private core: CoreAgent;
  private chat: ChatAgent;
  private search: SearchAgent;
  private guidance: GuidanceAgent;
  private memory: MemoryAgent;
  private safety: SafetyAgent;
  private voice: VoiceAgent;
  private automation: AutomationAgent;

  constructor() {
    this.core = new CoreAgent();
    this.chat = new ChatAgent();
    this.search = new SearchAgent();
    this.guidance = new GuidanceAgent();
    this.memory = new MemoryAgent();
    this.safety = new SafetyAgent();
    this.voice = new VoiceAgent();
    this.automation = new AutomationAgent();
  }

  async processMessage(message: string, context: AgentContext): Promise<AgentResponse> {
    // Validate input with safety agent
    const safetyCheck = await this.safety.validateContent(message, 'user_input');
    if (!safetyCheck.safe) {
      return {
        success: false,
        error: 'Content validation failed',
        metadata: { issues: safetyCheck.issues },
      };
    }

    // Store message in memory
    this.memory.storeMessage(context.sessionId, 'user', message);

    // Route to appropriate agent via core orchestrator
    const response = await this.core.processRequest(message, context);

    // Store response in memory
    if (response.success && response.data?.response) {
      this.memory.storeMessage(context.sessionId, 'assistant', response.data.response);
    }

    return response;
  }

  async processVoice(audioData: string, context: AgentContext): Promise<AgentResponse> {
    return this.voice.processVoice(audioData, context);
  }

  async executeAutomation(task: string, context: AgentContext): Promise<AgentResponse> {
    return this.automation.executeWorkflow(task, context);
  }

  getMemory() {
    return this.memory;
  }

  getAutomation() {
    return this.automation;
  }

  getVoice() {
    return this.voice;
  }
}
