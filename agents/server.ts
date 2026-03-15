import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { createClient } from '@supabase/supabase-js';
import { config as dotenvConfig } from 'dotenv';
import { PolisOrchestrator } from './index.js';
import { NovaSonicWebSocketHandler } from './voice/nova-sonic-stream.js';
import type { AgentContext } from './shared/types.js';

// Load environment variables from .env.local
dotenvConfig({ path: '../.env.local' });

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;
const MOCK_MODE = process.env.MOCK_MODE === 'true';

// Middleware
app.use(cors());
app.use(express.json());

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

if (!MOCK_MODE && (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)) {
  console.error('❌ Error: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in .env.local');
  console.error('💡 Tip: Set MOCK_MODE=true in .env.local to test without AWS Bedrock');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Initialize Polis Orchestrator
const orchestrator = new PolisOrchestrator();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, userId, language = 'en' } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    // Create context
    const context: AgentContext = {
      sessionId,
      userId: userId || 'anonymous',
      language,
      timestamp: new Date(),
    };

    let response;

    if (MOCK_MODE) {
      // Mock response for testing without Bedrock
      response = {
        success: true,
        data: {
          response: `[MOCK MODE] I understand you're asking about "${message}". To renew your passport, you'll need to complete Form DS-82, provide a recent passport photo, your current passport, and payment of $130. Standard processing takes 6-8 weeks.`,
        },
        metadata: {
          sessionId,
          timestamp: new Date(),
        },
      };
    } else {
      // Process message through orchestrator
      response = await orchestrator.processMessage(message, context);
    }

    // Save to Supabase
    if (response.success) {
      // Save user message
      await supabase.from('messages').insert({
        session_id: sessionId,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      });

      // Save assistant response
      if (response.data?.response) {
        await supabase.from('messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: response.data.response,
          created_at: new Date().toISOString(),
        });
      }

      // Update session
      await supabase
        .from('sessions')
        .upsert({
          id: sessionId,
          user_id: userId || 'anonymous',
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    }

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Voice endpoint
app.post('/api/voice', async (req, res) => {
  try {
    const { audioData, sessionId, userId, language = 'en' } = req.body;

    if (!audioData || !sessionId) {
      return res.status(400).json({ error: 'AudioData and sessionId are required' });
    }

    const context: AgentContext = {
      sessionId,
      userId: userId || 'anonymous',
      language,
      timestamp: new Date(),
    };

    const response = await orchestrator.processVoice(audioData, context);

    res.json(response);
  } catch (error) {
    console.error('Voice error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Get session history
app.get('/api/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({ success: true, messages: data });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Get user sessions
app.get('/api/users/:userId/sessions', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, sessions: data });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Create new session
app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, slug } = req.body;

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        id: sessionId,
        user_id: userId || 'anonymous',
        slug: slug || `chat-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, session: data });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// WebSocket handler for Nova Sonic 2 streaming
wss.on('connection', (ws) => {
  console.log('🎤 Nova Sonic WebSocket client connected');
  
  const handler = new NovaSonicWebSocketHandler(process.env.AWS_REGION || 'us-east-1');
  
  // Initialize session
  handler.initialize(
    'You are a friendly government services assistant. Keep responses concise and natural for voice conversation.'
  );

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'audio') {
        // Handle audio chunk
        const audioBuffer = Buffer.from(message.data, 'base64');
        await handler.handleAudioChunk(audioBuffer);
        
        // Send acknowledgment
        ws.send(JSON.stringify({ type: 'ack' }));
      } else if (message.type === 'end') {
        // End session
        await handler.cleanup();
        ws.send(JSON.stringify({ type: 'session_ended' }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  });

  ws.on('close', async () => {
    console.log('🎤 Nova Sonic WebSocket client disconnected');
    await handler.cleanup();
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Polis Agents API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎤 WebSocket: ws://localhost:${PORT} (Nova Sonic streaming)`);
  
  if (MOCK_MODE) {
    console.log(`🧪 MOCK MODE: Using simulated responses (Bedrock disabled)`);
  } else {
    console.log(`🤖 Bedrock: Connected to ${process.env.AWS_REGION}`);
  }
  
  console.log(`💾 Supabase: Connected to ${process.env.SUPABASE_URL}`);
});
