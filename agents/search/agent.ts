import { Agent, tool } from '@strands-agents/sdk';
import { BedrockModel } from '@strands-agents/sdk';
import { z } from 'zod';
import { config } from '../shared/config.js';
import type { AgentContext, AgentResponse, ServiceInfo } from '../shared/types.js';

// Mock government services database
const servicesDatabase: ServiceInfo[] = [
  {
    id: 'passport-renewal',
    name: 'Passport Renewal',
    description: 'Renew your passport for international travel',
    category: 'Travel Documents',
    eligibility: ['Current passport holder', 'Passport not damaged', 'Over 16 years old'],
    requiredDocuments: ['Current passport', 'Recent photo', 'Renewal form', 'Payment'],
    steps: [
      'Complete renewal form online or in person',
      'Provide recent passport photo',
      'Submit current passport',
      'Pay renewal fee',
      'Wait 4-6 weeks for processing',
    ],
    url: 'https://travel.state.gov/passport',
  },
  {
    id: 'housing-assistance',
    name: 'Housing Assistance Program',
    description: 'Financial assistance for low-income families to afford housing',
    category: 'Housing',
    eligibility: ['Income below 50% of area median', 'US citizen or eligible immigrant', 'Need assistance with rent'],
    requiredDocuments: ['Proof of income', 'ID', 'Lease agreement', 'Bank statements'],
    steps: [
      'Check eligibility requirements',
      'Gather required documents',
      'Complete application form',
      'Submit to local housing authority',
      'Attend interview if required',
    ],
    url: 'https://www.hud.gov/housing',
  },
];

const searchServices = tool({
  name: 'search_services',
  description: 'Search for government services by keyword, category, or service name',
  inputSchema: z.object({
    query: z.string().describe('Search query for government services'),
    category: z.string().optional().describe('Filter by service category'),
  }),
  callback: (input) => {
    const { query, category } = input;
    const lowerQuery = query.toLowerCase();

    let results = servicesDatabase.filter(
      (service) =>
        service.name.toLowerCase().includes(lowerQuery) ||
        service.description.toLowerCase().includes(lowerQuery) ||
        service.category.toLowerCase().includes(lowerQuery)
    );

    if (category) {
      results = results.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    return JSON.stringify(results.slice(0, 5)); // Return top 5 results
  },
});

export class SearchAgent {
  private agent: Agent;

  constructor() {
    const model = new BedrockModel({
      modelId: config.model.modelId,
      region: config.model.region,
      temperature: 0.3, // Lower temperature for more factual responses
    });

    this.agent = new Agent({
      model,
      tools: [searchServices],
      systemPrompt: `You are the Search agent for Polis, specialized in finding government services.
Your role is to:
1. Search and retrieve relevant government service information
2. Match user queries to appropriate services
3. Provide accurate, up-to-date information about services
4. Help users discover services they may not know about

Always use the search_services tool to find information. Present results clearly and concisely.`,
    });
  }

  async search(query: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const result = await this.agent.invoke(
        `Find government services for: "${query}"`
      );

      return {
        success: true,
        data: {
          response: result.lastMessage,
          query,
        },
        metadata: {
          sessionId: context.sessionId,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search error',
      };
    }
  }
}
