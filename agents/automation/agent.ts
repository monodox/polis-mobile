import { bedrockClient } from '../shared/bedrock.js';
import { config } from '../shared/config.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

export class AutomationAgent {
  private systemPrompt = `You are the Automation agent for Polis, powered by Amazon Nova Act.
Your role is to:
1. Automate browser-based government service workflows
2. Fill out complex web forms accurately and reliably
3. Extract data from government websites
4. Complete end-to-end application processes
5. Handle multi-step workflows with high reliability

Nova Act capabilities:
- Navigate websites and interact with UI elements
- Fill forms with natural language instructions
- Extract structured data from web pages
- Handle dynamic content and varied layouts
- Execute reliable workflows at production scale

Always ensure accuracy and escalate to human supervisor when uncertain.`;

  async executeWorkflow(task: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await bedrockClient.invokeModel({
        modelId: config.act.modelId,
        systemPrompt: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Execute automation task: ${task}\nSession: ${context.sessionId}`,
          },
        ],
        temperature: 0.3,
      });

      return {
        success: true,
        data: {
          response: result.content,
          workflowStatus: 'completed',
          model: 'nova-act-v1',
        },
        metadata: {
          sessionId: context.sessionId,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Automation error',
      };
    }
  }

  async fillForm(
    formUrl: string,
    formData: Record<string, string>,
    context: AgentContext
  ): Promise<AgentResponse> {
    return this.executeWorkflow(
      `Fill the form at ${formUrl} with the provided data`,
      context
    );
  }

  async extractData(url: string, dataPoints: string[], context: AgentContext): Promise<AgentResponse> {
    return this.executeWorkflow(
      `Extract ${dataPoints.join(', ')} from ${url}`,
      context
    );
  }
}
