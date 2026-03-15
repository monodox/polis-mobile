# Polis Agents

TypeScript-based AI agents powered by Strands Agents SDK for the Polis government services assistant.

## Architecture

The system consists of 7 specialized agents:

- **Core**: Orchestrator that routes requests to appropriate agents
- **Chat**: Handles natural language conversations
- **Voice**: Processes speech input/output for voice interactions
- **Search**: Retrieves government service information
- **Guidance**: Provides eligibility and document guidance
- **Memory**: Stores conversation context and history
- **Safety**: Ensures responses are safe and compliant

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

const response = await polis.processMessage(
  'How do I renew my passport?',
  context
);

console.log(response.data?.response);
```

## Project Structure

```
agents/
├── core/          # Core orchestrator agent
├── chat/          # Chat conversation agent
├── voice/         # Voice processing agent
├── search/        # Service search agent
├── guidance/      # Eligibility & guidance agent
├── memory/        # Conversation memory agent
├── safety/        # Safety & compliance agent
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
- Voice APIs (Amazon Polly, Google TTS)
- Mobile apps via REST API

## License

MIT
