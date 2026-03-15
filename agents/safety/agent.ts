import { Agent, tool } from '@strands-agents/sdk';
import { BedrockModel } from '@strands-agents/sdk';
import { z } from 'zod';
import { config } from '../shared/config.js';

const validateContent = tool({
  name: 'validate_content',
  description: 'Check if content is safe, appropriate, and compliant with guidelines',
  inputSchema: z.object({
    content: z.string().describe('Content to validate'),
    contentType: z.enum(['user_input', 'agent_response']).describe('Type of content'),
  }),
  callback: (input) => {
    const { content, contentType } = input;

    // Basic safety checks
    const issues: string[] = [];
    const lowerContent = content.toLowerCase();

    // Check for inappropriate content
    const inappropriateKeywords = ['hack', 'exploit', 'illegal'];
    for (const keyword of inappropriateKeywords) {
      if (lowerContent.includes(keyword)) {
        issues.push(`Potentially inappropriate keyword: ${keyword}`);
      }
    }

    // Check length
    if (content.length > config.safety.maxResponseLength && contentType === 'agent_response') {
      issues.push('Content exceeds maximum length');
    }

    const isSafe = issues.length === 0;

    return JSON.stringify({
      safe: isSafe,
      issues,
      recommendation: isSafe ? 'Content approved' : 'Content requires review',
    });
  },
});

const checkCompliance = tool({
  name: 'check_compliance',
  description: 'Verify that responses comply with government service guidelines',
  inputSchema: z.object({
    response: z.string().describe('Agent response to check'),
    serviceCategory: z.string().optional().describe('Category of government service'),
  }),
  callback: (input) => {
    // Mock compliance check
    return JSON.stringify({
      compliant: true,
      guidelines: ['Accurate information', 'No legal advice', 'Privacy protected'],
      warnings: [],
    });
  },
});

export class SafetyAgent {
  private agent: Agent;

  constructor() {
    const model = new BedrockModel({
      modelId: config.model.modelId,
      region: config.model.region,
      temperature: 0.1, // Very low temperature for consistent safety checks
    });

    this.agent = new Agent({
      model,
      tools: [validateContent, checkCompliance],
      systemPrompt: `You are the Safety agent for Polis, responsible for ensuring safe and compliant interactions.
Your role is to:
1. Validate all user inputs and agent responses
2. Ensure compliance with government service guidelines
3. Protect user privacy and data
4. Prevent inappropriate or harmful content
5. Flag potential security issues

Always prioritize user safety and data protection. Be thorough but not overly restrictive.`,
    });
  }

  async validateContent(content: string, contentType: 'user_input' | 'agent_response'): Promise<{
    safe: boolean;
    issues: string[];
    recommendation: string;
  }> {
    const issues: string[] = [];
    const lowerContent = content.toLowerCase();

    // Basic safety checks
    const inappropriateKeywords = ['hack', 'exploit', 'illegal', 'fraud'];
    for (const keyword of inappropriateKeywords) {
      if (lowerContent.includes(keyword)) {
        issues.push(`Potentially inappropriate keyword: ${keyword}`);
      }
    }

    // Check length
    if (content.length > config.safety.maxResponseLength && contentType === 'agent_response') {
      issues.push('Content exceeds maximum length');
    }

    const isSafe = issues.length === 0;

    return {
      safe: isSafe,
      issues,
      recommendation: isSafe ? 'Content approved' : 'Content requires review',
    };
  }

  async checkCompliance(response: string): Promise<boolean> {
    // In production, implement comprehensive compliance checks
    return true;
  }
}
