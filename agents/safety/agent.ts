import { config } from '../shared/config.js';

export class SafetyAgent {
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
