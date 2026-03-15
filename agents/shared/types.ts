import { z } from 'zod';

// Common types used across all agents
export interface AgentContext {
  userId?: string;
  sessionId: string;
  language: string;
  timestamp: Date;
}

export interface ServiceInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  eligibility: string[];
  requiredDocuments: string[];
  steps: string[];
  url?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

// Zod schemas for validation
export const ServiceInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  eligibility: z.array(z.string()),
  requiredDocuments: z.array(z.string()),
  steps: z.array(z.string()),
  url: z.string().optional(),
});

export const AgentContextSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string(),
  language: z.string(),
  timestamp: z.date(),
});
