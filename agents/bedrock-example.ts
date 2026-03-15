// Load environment variables from root .env.local
import './load-env.js';

import { bedrockClient } from './shared/bedrock.js';

async function main() {
  console.log('🚀 Testing Amazon Bedrock API with Nova Models\n');

  try {
    // Example 1: Nova Pro for conversation
    console.log('📋 Example 1: Nova Pro Conversation');
    const chatResponse = await bedrockClient.invokeModel({
      modelId: 'us.amazon.nova-pro-v1:0',
      messages: [
        {
          role: 'user',
          content: 'What documents do I need to renew my passport?',
        },
      ],
      systemPrompt: 'You are a helpful government services assistant.',
      temperature: 0.7,
      maxTokens: 500,
    });

    console.log('Response:', chatResponse.content);
    console.log('Tokens used:', chatResponse.usage);
    console.log('\n---\n');

    // Example 2: Streaming response
    console.log('📋 Example 2: Streaming Response');
    process.stdout.write('Response: ');
    
    for await (const chunk of bedrockClient.invokeModelStream({
      modelId: 'us.amazon.nova-pro-v1:0',
      messages: [
        {
          role: 'user',
          content: 'Tell me about housing assistance programs in one sentence.',
        },
      ],
      temperature: 0.7,
      maxTokens: 200,
    })) {
      if (chunk.type === 'content') {
        process.stdout.write(chunk.text);
      }
    }
    console.log('\n\n---\n');

    // Example 3: Nova Sonic (mock - adjust based on actual API)
    console.log('📋 Example 3: Nova Sonic Voice (Mock)');
    console.log('Note: Adjust based on actual Nova Sonic API format');
    console.log('Operation: Text-to-Speech');
    console.log('Text: "Welcome to Polis government services assistant"');
    console.log('\n---\n');

    // Example 4: Nova Act (mock - adjust based on actual API)
    console.log('📋 Example 4: Nova Act Automation (Mock)');
    console.log('Note: Adjust based on actual Nova Act API format');
    console.log('Task: Fill passport renewal form');
    console.log('\n---\n');

    console.log('✅ All examples completed!');
    console.log('\n🎯 Key Points:');
    console.log('   ✓ Direct Bedrock API access');
    console.log('   ✓ No additional frameworks needed');
    console.log('   ✓ Streaming support');
    console.log('   ✓ Full control over requests');

  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

main();
