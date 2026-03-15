import { Agent, tool } from '@strands-agents/sdk';
import { BedrockModel } from '@strands-agents/sdk';
import { z } from 'zod';
import { config } from '../shared/config.js';
import type { AgentContext, AgentResponse } from '../shared/types.js';

const checkEligibility = tool({
  name: 'check_eligibility',
  description: 'Check if a user meets eligibility requirements for a government service',
  inputSchema: z.object({
    serviceId: z.string().describe('The ID of the government service'),
    userInfo: z.string().describe('User information to check against eligibility criteria'),
  }),
  callback: (input) => {
    // Mock eligibility check
    return JSON.stringify({
      eligible: true,
      matchedCriteria: ['Income requirement', 'Citizenship status'],
      missingCriteria: [],
      nextSteps: ['Gather required documents', 'Complete application'],
    });
  },
});

const getRequiredDocuments = tool({
  name: 'get_required_documents',
  description: 'Get the list of required documents for a government service',
  inputSchema: z.object({
    serviceId: z.string().describe('The ID of the government service'),
  }),
  callback: (input) => {
    // Mock document requirements
    return JSON.stringify({
      required: ['Government-issued ID', 'Proof of income', 'Proof of residence'],
      optional: ['Bank statements', 'Tax returns'],
      tips: [
        'Make copies of all documents',
        'Ensure documents are current (within 90 days)',
        'Bring originals for verification',
      ],
    });
  },
});

const getStepByStepGuide = tool({
  name: 'get_step_by_step_guide',
  description: 'Get detailed step-by-step instructions for completing a government service application',
  inputSchema: z.object({
    serviceId: z.string().describe('The ID of the government service'),
  }),
  callback: (input) => {
    return JSON.stringify({
      steps: [
        {
          number: 1,
          title: 'Verify Eligibility',
          description: 'Check that you meet all eligibility requirements',
          estimatedTime: '5 minutes',
        },
        {
          number: 2,
          title: 'Gather Documents',
          description: 'Collect all required documents listed',
          estimatedTime: '1-2 days',
        },
        {
          number: 3,
          title: 'Complete Application',
          description: 'Fill out the application form completely and accurately',
          estimatedTime: '30 minutes',
        },
        {
          number: 4,
          title: 'Submit Application',
          description: 'Submit your application online or in person',
          estimatedTime: '15 minutes',
        },
        {
          number: 5,
          title: 'Wait for Processing',
          description: 'Your application will be reviewed',
          estimatedTime: '2-4 weeks',
        },
      ],
      totalEstimatedTime: '2-4 weeks',
    });
  },
});

export class GuidanceAgent {
  private agent: Agent;

  constructor() {
    const model = new BedrockModel({
      modelId: config.model.modelId,
      region: config.model.region,
      temperature: 0.4,
    });

    this.agent = new Agent({
      model,
      tools: [checkEligibility, getRequiredDocuments, getStepByStepGuide],
      systemPrompt: `You are the Guidance agent for Polis, specialized in helping citizens navigate government services.
Your role is to:
1. Explain eligibility requirements clearly
2. Provide comprehensive lists of required documents
3. Give step-by-step instructions for completing applications
4. Answer questions about the application process
5. Help users understand what to expect at each stage

Always be thorough, patient, and encouraging. Break down complex processes into simple steps.`,
    });
  }

  async provideGuidance(query: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await this.agent.invoke(query);

      return {
        success: true,
        data: {
          response: result.lastMessage,
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
