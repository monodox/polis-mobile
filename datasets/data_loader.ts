import fs from 'fs';
import path from 'path';

export interface GovernmentService {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  processingTime: string;
  cost: string;
  steps: string[];
  url: string;
  keywords: string[];
}

export interface TrainingConversation {
  intent: string;
  userMessage: string;
  agentResponse: string;
  context: string;
  sentiment: string;
}

export interface UserQuery {
  query: string;
  category: string;
  intent: string;
  complexity: string;
}

export interface IntentClassification {
  text: string;
  intent: string;
  entities: string[];
  confidence: number;
}

export interface VoiceTranscription {
  audioId: string;
  transcription: string;
  language: string;
  confidence: number;
  duration: number;
  intent: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export class DatasetLoader {
  private datasetPath: string;

  constructor(datasetPath: string = './datasets') {
    this.datasetPath = datasetPath;
  }

  private loadJSON<T>(filename: string): T {
    const filePath = path.join(this.datasetPath, filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  loadGovernmentServices(): GovernmentService[] {
    return this.loadJSON<GovernmentService[]>('government_services.json');
  }

  loadTrainingConversations(): TrainingConversation[] {
    return this.loadJSON<TrainingConversation[]>('conversation_training.json');
  }

  loadUserQueries(): UserQuery[] {
    return this.loadJSON<UserQuery[]>('user_queries.json');
  }

  loadIntentClassifications(): IntentClassification[] {
    return this.loadJSON<IntentClassification[]>('intent_classification.json');
  }

  loadVoiceTranscriptions(): VoiceTranscription[] {
    return this.loadJSON<VoiceTranscription[]>('voice_transcriptions.json');
  }

  loadFAQs(): FAQ[] {
    return this.loadJSON<FAQ[]>('faq_data.json');
  }

  // Search services by keyword
  searchServices(keyword: string): GovernmentService[] {
    const services = this.loadGovernmentServices();
    const lowerKeyword = keyword.toLowerCase();

    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(lowerKeyword) ||
        service.description.toLowerCase().includes(lowerKeyword) ||
        service.keywords.some((k) => k.toLowerCase().includes(lowerKeyword)) ||
        service.category.toLowerCase().includes(lowerKeyword)
    );
  }

  // Get service by ID
  getServiceById(id: string): GovernmentService | undefined {
    const services = this.loadGovernmentServices();
    return services.find((service) => service.id === id);
  }

  // Find FAQ by question similarity
  findFAQ(query: string): FAQ | undefined {
    const faqs = this.loadFAQs();
    const lowerQuery = query.toLowerCase();

    return faqs.find((faq) =>
      faq.question.toLowerCase().includes(lowerQuery) ||
      lowerQuery.includes(faq.question.toLowerCase())
    );
  }

  // Get training data by intent
  getTrainingByIntent(intent: string): TrainingConversation[] {
    const conversations = this.loadTrainingConversations();
    return conversations.filter((conv) => conv.intent === intent);
  }

  // Get services by category
  getServicesByCategory(category: string): GovernmentService[] {
    const services = this.loadGovernmentServices();
    return services.filter(
      (service) => service.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Get all categories
  getCategories(): string[] {
    const services = this.loadGovernmentServices();
    const categories = new Set(services.map((s) => s.category));
    return Array.from(categories);
  }

  // Get statistics
  getStatistics() {
    return {
      totalServices: this.loadGovernmentServices().length,
      totalConversations: this.loadTrainingConversations().length,
      totalQueries: this.loadUserQueries().length,
      totalIntents: this.loadIntentClassifications().length,
      totalVoiceTranscriptions: this.loadVoiceTranscriptions().length,
      totalFAQs: this.loadFAQs().length,
      categories: this.getCategories(),
    };
  }
}

// Export singleton instance
export const datasetLoader = new DatasetLoader();
