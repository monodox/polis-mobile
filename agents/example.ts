import { PolisOrchestrator } from './index.js';
import type { AgentContext } from './shared/types.js';

// Example usage of Polis Agents
async function main() {
  console.log('🚀 Starting Polis Agents Example\n');

  // Create orchestrator
  const polis = new PolisOrchestrator();

  // Create context
  const context: AgentContext = {
    sessionId: 'session-123',
    language: 'en',
    timestamp: new Date(),
  };

  // Example 1: Search for services
  console.log('📋 Example 1: Searching for passport services');
  const searchResult = await polis.processMessage(
    'I need to renew my passport. What do I need to do?',
    context
  );
  console.log('Response:', searchResult.data?.response);
  console.log('\n---\n');

  // Example 2: Get guidance
  console.log('📋 Example 2: Getting eligibility guidance');
  const guidanceResult = await polis.processMessage(
    'Am I eligible for housing assistance?',
    context
  );
  console.log('Response:', guidanceResult.data?.response);
  console.log('\n---\n');

  // Example 3: General chat
  console.log('📋 Example 3: General conversation');
  const chatResult = await polis.processMessage(
    'Thank you for your help!',
    context
  );
  console.log('Response:', chatResult.data?.response);
  console.log('\n---\n');

  // Show conversation history
  console.log('💾 Conversation History:');
  const history = polis.getMemory().getContext(context.sessionId);
  history.forEach((msg, i) => {
    console.log(`${i + 1}. [${msg.role}]: ${msg.content.substring(0, 50)}...`);
  });

  console.log('\n✅ Example completed!');
}

main().catch(console.error);
