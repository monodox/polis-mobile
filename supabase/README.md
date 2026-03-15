# Supabase Setup for Polis

This directory contains the database schema and storage configuration for Polis.

## Setup Instructions

### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Note your project URL and anon key

### 2. Update Environment Variables
```bash
# In root .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run Database Schema
- Go to your Supabase project dashboard
- Navigate to **SQL Editor**
- Copy and paste the contents of `database.sql`
- Click **Run** to execute

### 4. Create Storage Buckets
- Navigate to **Storage** in Supabase dashboard
- Create three buckets:
  1. **documents** (Private) - for user documents
  2. **avatars** (Public) - for profile pictures
  3. **voice-recordings** (Private) - for voice messages

### 5. Run Storage Policies
- Go back to **SQL Editor**
- Copy and paste the contents of `storage.sql`
- Click **Run** to execute

### 6. Verify Setup
Check the following:
- ✓ Tables created: sessions, messages, agents, user_preferences, service_requests
- ✓ Storage buckets created: documents, avatars, voice-recordings
- ✓ RLS policies enabled on all tables
- ✓ Default agents inserted

## Database Schema

### Tables

**sessions**
- Conversation sessions between users and agents
- Stores title, description, language preference

**messages**
- Individual messages within sessions
- Supports user, assistant, and system roles

**agents**
- Configuration for AI agents (Core, Chat, Voice, Search, Guidance, Memory, Safety, Automation)
- Stores model settings and enabled status

**user_preferences**
- User settings and preferences
- Stored as JSONB for flexibility

**service_requests**
- Tracking of government service applications
- Status: pending, in_progress, completed, failed

### Storage Buckets

**documents**
- User uploaded documents (ID, proof of residence, etc.)
- Private - users can only access their own files
- Path structure: `{user_id}/{filename}`

**avatars**
- User profile pictures
- Public read access
- Path structure: `{user_id}/{filename}`

**voice-recordings**
- Voice message recordings
- Private - users can only access their own recordings
- Path structure: `{user_id}/{filename}`

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Agents table is publicly readable
- Storage policies enforce user isolation
- All policies defined in SQL files

## Usage in Flutter

```dart
import 'package:polis_mobile/services/supabase_service.dart';

final supabaseService = SupabaseService();

// Create a session
final session = await supabaseService.createSession(
  title: 'Passport Renewal Help',
);

// Send a message
await supabaseService.sendMessage(
  sessionId: session['id'],
  content: 'How do I renew my passport?',
  role: 'user',
);

// Get messages
final messages = await supabaseService.getMessages(session['id']);
```

## Integration with Agents

The Supabase database stores:
- User conversations and context (for Memory agent)
- Agent configurations
- Service request tracking
- User authentication and preferences

The TypeScript agents in `/agents` can connect to the same Supabase instance using the Supabase JS client.

## Next Steps

1. Enable email authentication in Supabase Auth settings
2. Configure OAuth providers (Google, Apple, etc.)
3. Set up Supabase Edge Functions for agent integration
4. Configure real-time subscriptions for live chat
5. Add file size limits and allowed MIME types for storage buckets
