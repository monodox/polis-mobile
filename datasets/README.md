# Polis Synthetic Datasets

This directory contains synthetic datasets for training, testing, and improving the Polis AI agents.

## Dataset Files

### 1. government_services.json
Complete catalog of government services with detailed information.

**Structure:**
- `id`: Unique service identifier
- `name`: Service name
- `category`: Service category
- `description`: Brief description
- `eligibility`: Array of eligibility requirements
- `requiredDocuments`: Array of required documents
- `processingTime`: Expected processing duration
- `cost`: Service cost
- `steps`: Step-by-step process
- `url`: Official service URL
- `keywords`: Search keywords

**Use Cases:**
- Search agent training
- Service recommendation
- Information retrieval
- Knowledge base

### 2. conversation_training.json
Training data for conversational AI with user queries and agent responses.

**Structure:**
- `intent`: User intent classification
- `userMessage`: User's question or statement
- `agentResponse`: Appropriate agent response
- `context`: Conversation context
- `sentiment`: User sentiment

**Use Cases:**
- Chat agent training
- Response generation
- Intent classification
- Context understanding

### 3. user_queries.json
Common user queries with metadata for intent classification.

**Structure:**
- `query`: User question
- `category`: Service category
- `intent`: Classified intent
- `complexity`: Query complexity level

**Use Cases:**
- Intent classification training
- Query understanding
- Routing logic
- Complexity assessment

### 4. agent_responses.json
Template responses for different agent types and scenarios.

**Structure:**
- `agentType`: Which agent (chat, guidance, search, etc.)
- `scenario`: Specific scenario
- `response`: Template response

**Use Cases:**
- Response templates
- Agent behavior definition
- Consistency training

### 5. session_examples.json
Complete conversation sessions with multiple message exchanges.

**Structure:**
- `sessionId`: Unique session identifier
- `userId`: User identifier
- `slug`: Human-readable session name
- `messages`: Array of conversation messages
- `resolved`: Whether issue was resolved

**Use Cases:**
- Multi-turn conversation training
- Session management
- Context retention
- Conversation flow analysis

### 6. intent_classification.json
Training data for intent classification with confidence scores.

**Structure:**
- `text`: User input text
- `intent`: Classified intent
- `entities`: Extracted entities
- `confidence`: Classification confidence

**Use Cases:**
- Intent classifier training
- Entity extraction
- Confidence calibration

### 7. voice_transcriptions.json
Voice input transcriptions with metadata.

**Structure:**
- `audioId`: Audio file identifier
- `transcription`: Transcribed text
- `language`: Language code
- `confidence`: Transcription confidence
- `duration`: Audio duration in seconds
- `intent`: Detected intent

**Use Cases:**
- Voice agent training
- Multilingual support
- Speech recognition testing
- Audio processing

### 8. multilingual_data.json
Parallel text in multiple languages for multilingual support.

**Structure:**
- `language`: Language code (en, es, fr, zh)
- `query`: User query in that language
- `response`: Agent response in that language

**Use Cases:**
- Multilingual training
- Translation validation
- Language detection
- Cross-lingual understanding

### 9. error_scenarios.json
Error handling and edge case scenarios.

**Structure:**
- `scenario`: Error scenario name
- `userInput`: User input causing error
- `agentResponse`: Appropriate error response
- `errorType`: Type of error

**Use Cases:**
- Error handling training
- Edge case testing
- Graceful degradation
- User experience improvement

### 10. faq_data.json
Frequently asked questions with detailed answers.

**Structure:**
- `question`: FAQ question
- `answer`: Detailed answer
- `category`: Service category
- `tags`: Related tags

**Use Cases:**
- Quick response lookup
- Knowledge base
- Search optimization
- Common query handling

## Usage

### Loading Data in TypeScript

```typescript
import fs from 'fs';

// Load government services
const services = JSON.parse(
  fs.readFileSync('./datasets/government_services.json', 'utf-8')
);

// Load training conversations
const conversations = JSON.parse(
  fs.readFileSync('./datasets/conversation_training.json', 'utf-8')
);
```

### Loading Data in Python

```python
import json

# Load government services
with open('./datasets/government_services.json', 'r') as f:
    services = json.load(f)

# Load training conversations
with open('./datasets/conversation_training.json', 'r') as f:
    conversations = json.load(f)
```

### Loading Data in Flutter/Dart

```dart
import 'dart:convert';
import 'package:flutter/services.dart';

// Load from assets
final String jsonString = await rootBundle.loadString('datasets/government_services.json');
final List<dynamic> services = jsonDecode(jsonString);
```

## Data Statistics

- **Government Services**: 3 services with complete details
- **Training Conversations**: 4 conversation examples
- **User Queries**: 8 common queries
- **Agent Responses**: 5 response templates
- **Session Examples**: 1 complete session
- **Intent Classifications**: 8 intent examples
- **Voice Transcriptions**: 5 multilingual examples
- **Multilingual Data**: 4 languages (EN, ES, FR, ZH)
- **Error Scenarios**: 4 error types
- **FAQ Entries**: 4 common questions

## Expanding the Dataset

### Adding New Services

```json
{
  "id": "new-service-id",
  "name": "Service Name",
  "category": "Category",
  "description": "Description",
  "eligibility": ["requirement1", "requirement2"],
  "requiredDocuments": ["doc1", "doc2"],
  "processingTime": "X weeks",
  "cost": "$X",
  "steps": ["step1", "step2"],
  "url": "https://example.gov",
  "keywords": ["keyword1", "keyword2"]
}
```

### Adding Training Conversations

```json
{
  "intent": "intent_name",
  "userMessage": "User's question",
  "agentResponse": "Agent's response",
  "context": "conversation_context",
  "sentiment": "neutral|positive|negative"
}
```

## Data Quality Guidelines

1. **Accuracy**: All information should be factually correct
2. **Completeness**: Include all required fields
3. **Consistency**: Use consistent formatting and terminology
4. **Diversity**: Include varied examples and edge cases
5. **Realism**: Reflect real user queries and scenarios

## Privacy & Compliance

- All data is synthetic and does not contain real user information
- No personally identifiable information (PII) is included
- Data is safe for training and testing purposes
- Complies with data protection regulations

## Future Enhancements

- [ ] Add more government services (50+ services)
- [ ] Expand multilingual support (10+ languages)
- [ ] Include more complex conversation flows
- [ ] Add sentiment analysis data
- [ ] Include accessibility-related queries
- [ ] Add regional variations
- [ ] Include time-sensitive scenarios
- [ ] Add more error scenarios

## Contributing

When adding new data:
1. Follow the existing structure
2. Validate JSON syntax
3. Ensure data quality
4. Update statistics in this README
5. Test with agents before committing
