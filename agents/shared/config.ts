// Shared configuration for all agents
export const config = {
  // Model configuration - Using Amazon Nova models
  model: {
    provider: 'bedrock',
    // Nova Pro for general agents
    modelId: 'us.amazon.nova-pro-v1:0',
    region: process.env.AWS_REGION || 'us-east-1',
    temperature: 0.7,
  },

  // Nova Sonic 2 for voice interactions
  voice: {
    modelId: 'us.amazon.nova-sonic-v2:0',
    region: process.env.AWS_REGION || 'us-east-1',
    temperature: 0.8,
  },

  // Nova Act for browser automation
  act: {
    modelId: 'us.amazon.nova-act-v1:0',
    region: 'us-east-1', // Nova Act only available in us-east-1
    maxSteps: 50,
    timeout: 120000, // 2 minutes for complex workflows
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
