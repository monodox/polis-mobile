# Polis Agents

TypeScript-based AI agents powered by Strands Agents SDK and Amazon Nova models for the Polis government services assistant.

## Amazon Nova Models

This system leverages three Amazon Nova models:

- **Nova Pro** (`us.amazon.nova-pro-v1:0`) - Powers general conversation, search, and guidance agents
- **Nova Sonic 2** (`us.amazon.nova-sonic-v2:0`) - Handles real-time voice transcription and speech synthesis
- **Nova Act** (`us.amazon.nova-act-v1:0`) - Automates browser-based workflows and form filling

## Architecture

The system consists of 8 specialized agents:

- **Core**: Orchestrator that routes requests to appropriate agents (Nova Pro)
- **Chat**: Handles natural language conversations (Nova Pro)
- **Voice**: Processes speech input/output for voice interactions (Nova Sonic 2)
- **Search**: Retrieves government service information (Nova Pro)
- **Guidance**: Provides eligibility and document guidance (Nova Pro)
- **Memory**: Stores conversation context and history (Nova Pro)
- **Safety**: Ensures responses are safe and compliant (Nova Pro)
- **Automation**: Automates browser workflows and form filling (Nova Act)

## Setup

1. Install dependencies:
```bash
cd agents
npm install
```

2. Configure AWS credentials for Amazon Bedrock:
```bash
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
```

Note: Nova Act is only available in `us-east-1` region.

3. Run the example:
```bash
npm run dev
```

Or run directly:
```bash
npx tsx example.ts
```

## Usage

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
