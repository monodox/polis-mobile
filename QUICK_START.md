# Polis Quick Start Guide

## Current Status

✅ Flutter app running  
✅ Agents server running  
✅ AWS Bedrock connected  
✅ Supabase connected  
⚠️ Database schema needs update

## Fix the Database Schema Issue

The server is running but getting errors because the database schema doesn't match. Follow these steps:

### Step 1: Update Supabase Database

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/sdgbuhauylyffpjgeabm
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste this migration script:

```sql
-- Drop existing tables (if you don't have important data)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
```

5. Click **Run** (or press Ctrl+Enter)
6. Create a new query and copy the entire content from `supabase/database.sql`
7. Click **Run** to create all tables with the correct schema

### Step 2: Verify Tables

Go to **Table Editor** in Supabase and verify:
- `sessions` table has a `slug` column (TEXT type)
- `sessions.id` is TEXT type (not UUID)
- `sessions.user_id` is TEXT type (not UUID)

### Step 3: Restart Server

The agents server should already be running. If not:

```bash
cd agents
npm run server
```

You should see:
```
🚀 Polis Agents API running on http://localhost:3000
📊 Health check: http://localhost:3000/health
🤖 Bedrock: Connected to us-east-1
💾 Supabase: Connected to https://sdgbuhauylyffpjgeabm.supabase.co
```

### Step 4: Test the App

1. Refresh your Flutter app in the browser
2. Go to the Chat page
3. Try sending a message or using voice mode
4. Check the server logs for any errors

## Common Issues

### "Could not find the 'slug' column"
- The database schema hasn't been updated yet
- Follow Step 1 above to update the schema

### "Too many tokens per day"
- AWS Bedrock has rate limits
- Set `MOCK_MODE=true` in `.env.local` to test without Bedrock
- Restart the server after changing the env file

### "SUPABASE_URL is required"
- Make sure `.env.local` exists in the root directory
- Verify it has `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- The server reads from `../.env.local` (parent directory)

### Server not starting
```bash
cd agents
npm install  # Install dependencies if needed
npm run server
```

## Project Structure

```
polis-mobile/
├── .env.local              # Environment variables (gitignored)
├── .env.example            # Template for environment variables
├── lib/                    # Flutter app code
│   ├── pages/app/chat.dart # Chat page with voice mode
│   └── services/           # API services
├── agents/                 # TypeScript agents
│   ├── server.ts          # Express API server
│   ├── core/              # Core orchestrator agent
│   ├── chat/              # Chat agent
│   ├── voice/             # Voice agent
│   └── shared/            # Shared utilities
├── supabase/              # Database schema
│   ├── database.sql       # Main schema
│   ├── storage.sql        # Storage policies
│   ├── README.md          # Setup guide
│   └── MIGRATION.md       # Migration guide
└── datasets/              # Synthetic training data
```

## Running the Full Stack

### Terminal 1: Agents Server
```bash
cd agents
npm run server
```

### Terminal 2: Flutter Web
```bash
flutter run -d chrome
```

## Testing

### Test Health Endpoint
```bash
curl http://localhost:3000/health
```

### Test Chat (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"message": "Hello", "sessionId": "test_123", "userId": "user_001"}'
```

### Test Chat (Bash)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "sessionId": "test_123", "userId": "user_001"}'
```

## Next Steps

Once the database is updated and working:

1. Test voice mode in the Flutter app
2. Create multiple chat sessions
3. Verify messages are saved to Supabase
4. Test session history loading
5. Configure AWS Bedrock quota if needed
6. Deploy to AWS Amplify (optional)

## Need Help?

- Check server logs in the terminal
- Check browser console for Flutter errors
- Verify Supabase tables in Table Editor
- Check `.env.local` has all required variables
- See `supabase/MIGRATION.md` for detailed migration steps
