import { PolisOrchestrator } from './index.js';
import type { AgentContext } from './shared/types.js';

// Example usage of Polis Agents with Amazon Nova models
async function main() {
  console.log('🚀 Starting Polis Agents with Amazon Nova Models\n');
  console.log('📦 Models:');
  console.log('   - Nova Pro: General agents');
  console.log('   - Nova Sonic 2: Voice interactions');
  console.log('   - Nova Act: Browser automation\n');

  // Create orchestrator
  const polis = new PolisOrchestrator();

  // Create context
  const context: AgentContext = {
    sessionId: 'session-' + Date.now(),
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

  // Example 2: Voice interaction with Nova Sonic 2
  console.log('🎤 Example 2: Voice interaction (Nova Sonic 2)');
  const voiceResult = await polis.processVoice(
    'base64_encoded_audio_data_here',
    context
  );
  console.log('Voice Response:', voiceResult.data?.response);
  console.log('\n---\n');

  // Example 3: Browser automation with Nova Act
  console.log('🤖 Example 3: Form automation (Nova Act)');
  const automationResult = await polis.executeAutomation(
    'Fill out the passport renewal form at travel.state.gov with my information',
    context
  );
  console.log('Automation Response:', automationResult.data?.response);
  console.log('\n---\n');

  // Example 4: Get guidance
  console.log('📋 Example 4: Getting eligibility guidance');
  const guidanceResult = await polis.processMessage(
    'Am I eligible for housing assistance?',
    context
  );
  console.log('Response:', guidanceResult.data?.response);
  console.log('\n---\n');

  // Example 5: Extract data with Nova Act
  console.log('🔍 Example 5: Data extraction (Nova Act)');
  const extractionResult = await polis.getAutomation().extractData(
    'https://www.benefits.gov/benefit/1234',
    ['eligibility', 'required_documents', 'processing_time'],
    context
  );
  console.log('Extracted Data:', extractionResult.data);
  console.log('\n---\n');

  // Show conversation history
  console.log('💾 Conversation History:');
  const history = polis.getMemory().getContext(context.sessionId);
  history.forEach((msg, i) => {
    console.log(`${i + 1}. [${msg.role}]: ${msg.content.substring(0, 60)}...`);
  });

  console.log('\n✅ Example completed!');
  console.log('\n🎯 Key Features Demonstrated:');
  console.log('   ✓ Nova Pro for intelligent conversation');
  console.log('   ✓ Nova Sonic 2 for voice processing');
  console.log('   ✓ Nova Act for browser automation');
  console.log('   ✓ Multi-agent orchestration');
  console.log('   ✓ Memory management');
}

main().catch(console.error);
