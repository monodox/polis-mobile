import 'bedrock_service.dart';

class ApiService {
  late BedrockService _bedrockService;

  Future<void> initialize() async {
    // Initialize Bedrock service with credentials from environment
    // In production, use secure credential management
    _bedrockService = BedrockService(
      region: const String.fromEnvironment('AWS_REGION', defaultValue: 'us-east-1'),
      accessKeyId: const String.fromEnvironment('AWS_ACCESS_KEY_ID', defaultValue: ''),
      secretAccessKey: const String.fromEnvironment('AWS_SECRET_ACCESS_KEY', defaultValue: ''),
    );
  }

  Future<String> chat(String message, {String? systemPrompt}) async {
    final response = await _bedrockService.invokeNovaPro(
      messages: [
        {'role': 'user', 'content': message},
      ],
      systemPrompt: systemPrompt ?? 'You are a helpful government services assistant.',
    );

    return _bedrockService.extractTextFromResponse(response);
  }

  Future<String> transcribeAudio(String audioData) async {
    final response = await _bedrockService.invokeNovaSonic(
      audioData: audioData,
      operation: 'transcribe',
    );

    return response['transcription'] ?? '';
  }

  Future<String> synthesizeSpeech(String text) async {
    final response = await _bedrockService.invokeNovaSonic(
      text: text,
      operation: 'synthesize',
    );

    return response['audioUrl'] ?? '';
  }
}
