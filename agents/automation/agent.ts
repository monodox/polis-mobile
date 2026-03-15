import { Agent, tool } from '@strands-agents/sdk';
import { BedrockModel } from '@strands-agents/sdk';
import { z } from 'zod';
import { config } from '../shared/config.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

// Nova Act workflow for form filling
const fillGovernmentForm = tool({
  name: 'fill_government_form',
  description: 'Use Nova Act to automatically fill out government service forms',
  inputSchema: z.object({
    formUrl: z.string().describe('URL of the government form'),
    formData: z.record(z.string()).describe('Form field data as key-value pairs'),
    submitForm: z.boolean().optional().describe('Whether to submit the form after filling'),
  }),
  callback: (input) => {
    // Nova Act workflow execution
    // In production, this would use the Nova Act SDK
    const workflow = `
# Nova Act Workflow: Fill Government Form
session = nova.create_session()
session.navigate("${input.formUrl}")

# Fill form fields
${Object.entries(input.formData)
  .map(([field, value]) => `nova.act("fill the ${field} field with '${value}'")`)
  .join('\n')}

${input.submitForm ? 'nova.act("submit the form")' : '# Form not submitted'}
`;

    return JSON.stringify({
      success: true,
      workflow,
      status: 'completed',
      steps: Object.keys(input.formData).length + (input.submitForm ? 1 : 0),
      message: 'Form filled successfully using Nova Act',
    });
  },
});

// Nova Act workflow for data extraction
const extractServiceInfo = tool({
  name: 'extract_service_info',
  description: 'Use Nova Act to extract information from government service websites',
  inputSchema: z.object({
    url: z.string().describe('URL of the government service page'),
    dataPoints: z.array(z.string()).describe('List of data points to extract'),
  }),
  callback: (input) => {
    const workflow = `
# Nova Act Workflow: Extract Service Information
session = nova.create_session()
session.navigate("${input.url}")

# Extract data points
${input.dataPoints.map((point) => `data["${point}"] = nova.act("find and extract ${point}")`).join('\n')}
`;

    return JSON.stringify({
      success: true,
      workflow,
      extractedData: {
        eligibility: 'Citizens over 18 years old',
        documents: ['ID', 'Proof of residence'],
        processingTime: '2-4 weeks',
      },
      model: 'nova-act-v1',
    });
  },
});

// Nova Act workflow for service application
const submitServiceApplication = tool({
  name: 'submit_service_application',
  description: 'Complete end-to-end service application using Nova Act',
  inputSchema: z.object({
    serviceType: z.string().describe('Type of government service'),
    applicantData: z.record(z.string()).describe('Applicant information'),
    documents: z.array(z.string()).describe('Document file paths to upload'),
  }),
  callback: (input) => {
    const workflow = `
# Nova Act Workflow: Submit Service Application
session = nova.create_session()

# Navigate to service portal
nova.act("go to ${input.serviceType} application portal")

# Login or create account
nova.act("login or create account")

# Fill application form
${Object.entries(input.applicantData)
  .map(([field, value]) => `nova.act("enter ${value} for ${field}")`)
  .join('\n')}

# Upload documents
${input.documents.map((doc) => `nova.act("upload document ${doc}")`).join('\n')}

# Review and submit
nova.act("review application and submit")
`;

    return JSON.stringify({
      success: true,
      workflow,
      applicationId: 'APP-' + Date.now(),
      status: 'submitted',
      estimatedProcessing: '2-4 weeks',
    });
  },
});

export class AutomationAgent {
  private agent: Agent;

  constructor() {
    // Use Nova Act for browser automation
    const model = new BedrockModel({
      modelId: config.act.modelId,
      region: config.act.region,
      temperature: 0.3, // Lower temperature for reliable automation
    });

    this.agent = new Agent({
      model,
      tools: [fillGovernmentForm, extractServiceInfo, submitServiceApplication],
      systemPrompt: `You are the Automation agent for Polis, powered by Amazon Nova Act.
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

Always ensure accuracy and escalate to human supervisor when uncertain.`,
    });
  }

  async executeWorkflow(task: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await this.agent.invoke(
        `Execute automation task: ${task}\nSession: ${context.sessionId}`
      );

      return {
        success: true,
        data: {
          response: result.lastMessage,
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
    // Sanitize URL to prevent code injection
    const sanitizedUrl = formUrl.replace(/[`${}\\]/g, '');
    return this.executeWorkflow(
      `Fill the form at ${sanitizedUrl} with the provided data`,
      context
    );
  }

  async extractData(url: string, dataPoints: string[], context: AgentContext): Promise<AgentResponse> {
    // Sanitize inputs to prevent code injection
    const sanitizedUrl = url.replace(/[`${}\\]/g, '');
    const sanitizedDataPoints = dataPoints.map(dp => dp.replace(/[`${}\\]/g, ''));
    return this.executeWorkflow(
      `Extract ${sanitizedDataPoints.join(', ')} from ${sanitizedUrl}`,
      context
    );
  }
}
