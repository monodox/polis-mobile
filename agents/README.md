# Polis Agents

TypeScript-based AI agents powered by Amazon Bedrock API and Nova models for the Polis government services assistant.

## Amazon Nova Models via Bedrock API

This system uses the AWS Bedrock Runtime API to access Amazon Nova models:

- **Nova Pro** (`us.amazon.nova-pro-v1:0`) - Powers general conversation, search, and guidance agents
- **Nova Sonic 2** (`us.amazon.nova-sonic-v2:0`) - Handles real-time voice transcription and speech synthesis
- **Nova Act** (`us.amazon.nova-act-v1:0`) - Automates browser-based workflows and form filling

## Why Bedrock API?

- Direct API access without additional frameworks
- Full control over requests and responses
- Streaming support for real-time interactions
- Native AWS SDK integration
- Lower overhead and dependencies

## Setup

1. Install dependencies:
```bash
cd agents
npm install
```

2. Configure environment variables in the root `.env.local` file:
```bash
# Copy from root .env.example
cp ../.env.example ../.env.local

# Edit .env.local with your AWS credentials
```

Required environment variables:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - AWS region (default: us-east-1)

Optional environment variables:
- `NOVA_PRO_MODEL_ID` - Override Nova Pro model ID
- `NOVA_SONIC_MODEL_ID` - Override Nova Sonic 2 model ID
- `NOVA_ACT_MODEL_ID` - Override Nova Act model ID

Note: Nova Act is only available in `us-east-1` region.

3. Run the Bedrock API example:
```bash
npx tsx bedrock-example.ts
```

Or run the full agent example:
```bash
npm run dev
```

## Usage

### Direct Bedrock API

```typescript
import { bedrockClient } from './shared/bedrock.js';

// Simple conversation
const response = await bedrockClient.invokeModel({
  modelId: 'us.amazon.nova-pro-v1:0',
  messages: [
    { role: 'user', content: 'How do I renew my passport?' }
  ],
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7,
  maxTokens: 500,
});

console.log(response.content);

// Streaming response
for await (const chunk of bedrockClient.invokeModelStream({
  modelId: 'us.amazon.nova-pro-v1:0',
  messages: [
    { role: 'user', content: 'Tell me about housing assistance.' }
  ],
})) {
  if (chunk.type === 'content') {
    process.stdout.write(chunk.text);
  }
}
```

### Using Agent Orchestrator

```typescript
import { PolisOrchestrator } from './index.js';

const polis = new PolisOrchestrator();

const context = {
  sessionId: 'unique-session-id',
  language: 'en',
  timestamp: new Date(),
};

// Text conversation
const response = await polis.processMessage(
  'How do I renew my passport?',
  context
);

// Voice interaction (Nova Sonic 2)
const voiceResponse = await polis.processVoice(
  audioData,
  context
);

// Browser automation (Nova Act)
const automationResponse = await polis.executeAutomation(
  'Fill the passport renewal form',
  context
);
```

## Nova Act Workflows

Nova Act enables reliable browser automation for:

- **Form Filling**: Automatically complete government service forms
- **Data Extraction**: Extract information from government websites
- **Application Submission**: End-to-end application workflows
- **QA Testing**: Automated testing of government portals

Example workflow:
```typescript
const automation = polis.getAutomation();

// Fill a form
await automation.fillForm(
  'https://travel.state.gov/passport',
  { firstName: 'John', lastName: 'Doe' },
  context
);

// Extract data
await automation.extractData(
  'https://benefits.gov/service',
  ['eligibility', 'documents', 'timeline'],
  context
);
```

## Project Structure

```
agents/
├── core/          # Core orchestrator agent (Nova Pro)
├── chat/          # Chat conversation agent (Nova Pro)
├── voice/         # Voice processing agent (Nova Sonic 2)
├── search/        # Service search agent (Nova Pro)
├── guidance/      # Eligibility & guidance agent (Nova Pro)
├── memory/        # Conversation memory agent (Nova Pro)
├── safety/        # Safety & compliance agent (Nova Pro)
├── automation/    # Browser automation agent (Nova Act)
├── shared/        # Shared types and config
├── example.ts     # Usage example
└── index.ts       # Main entry point
```

## Development

Build TypeScript:
```bash
npm run build
```

Run in development mode:
```bash
npm run dev
```

## Integration

These agents can be integrated with:
- Web servers (Express, Fastify)
- WebSocket servers for real-time chat
- Voice APIs for telephony integration
- Mobile apps via REST API
- Browser extensions for automation

## License

MIT
