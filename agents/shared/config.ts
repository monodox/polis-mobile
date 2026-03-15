// Shared configuration for all agents
export const config = {
  // Model configuration
  model: {
    provider: 'bedrock',
    modelId: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
    region: process.env.AWS_REGION || 'us-east-1',
    temperature: 0.7,
  },

  // Agent behavior
  agents: {
    maxIterations: 10,
    timeout: 30000, // 30 seconds
  },

  // Memory configuration
  memory: {
    maxMessages: 50,
    ttl: 3600000, // 1 hour in milliseconds
  },

  // Safety configuration
  safety: {
    enableContentFiltering: true,
    maxResponseLength: 2000,
  },

  // Supported languages
  languages: ['en', 'es', 'fr'],
};
