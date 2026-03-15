import 'dart:convert';
import 'package:http/http.dart' as http;

class BedrockService {
  final String region;
  final String accessKeyId;
  final String secretAccessKey;

  BedrockService({
    required this.region,
    required this.accessKeyId,
    required this.secretAccessKey,
  });

  // Nova Pro - Conversation
  Future<Map<String, dynamic>> invokeNovaPro({
    required List<Map<String, String>> messages,
    String? systemPrompt,
    double temperature = 0.7,
    int maxTokens = 2048,
  }) async {
    return await _invokeModel(
      modelId: 'us.amazon.nova-pro-v1:0',
      messages: messages,
      systemPrompt: systemPrompt,
      temperature: temperature,
      maxTokens: maxTokens,
    );
  }

  // Nova Sonic - Voice
  Future<Map<String, dynamic>> invokeNovaSonic({
    String? audioData,
    String? text,
    required String operation, // 'transcribe' or 'synthesize'
    String language = 'en',
  }) async {
    final body = {
      'operation': operation,
      'language': language,
      if (audioData != null) 'audio': audioData,
      if (text != null) 'text': text,
    };

    return await _invokeModelRaw(
      modelId: 'us.amazon.nova-sonic-v2:0',
      body: body,
    );
  }

  // Nova Act - Browser Automation
  Future<Map<String, dynamic>> invokeNovaAct({
    required String task,
    String? url,
    Map<String, dynamic>? context,
  }) async {
    final body = {
      'task': task,
      if (url != null) 'url': url,
      if (context != null) 'context': context,
    };

    return await _invokeModelRaw(
      modelId: 'us.amazon.nova-act-v1:0',
      body: body,
    );
  }

  // Generic model invocation
  Future<Map<String, dynamic>> _invokeModel({
    required String modelId,
    required List<Map<String, String>> messages,
    String? systemPrompt,
    double temperature = 0.7,
    int maxTokens = 2048,
  }) async {
    final body = {
      'anthropic_version': 'bedrock-2023-05-31',
      'max_tokens': maxTokens,
      'temperature': temperature,
      'messages': messages,
      if (systemPrompt != null) 'system': systemPrompt,
    };

    return await _invokeModelRaw(modelId: modelId, body: body);
  }

  // Raw model invocation
  Future<Map<String, dynamic>> _invokeModelRaw({
    required String modelId,
    required Map<String, dynamic> body,
  }) async {
    final endpoint =
        'https://bedrock-runtime.$region.amazonaws.com/model/$modelId/invoke';

    // Note: In production, use proper AWS Signature V4 signing
    // For now, this is a simplified example
    final response = await http.post(
      Uri.parse(endpoint),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add AWS Signature V4 headers here
      },
      body: jsonEncode(body),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Bedrock API error: ${response.statusCode} ${response.body}');
    }
  }

  // Helper to extract text from Nova Pro response
  String extractTextFromResponse(Map<String, dynamic> response) {
    if (response['content'] != null && response['content'] is List) {
      final content = response['content'] as List;
      if (content.isNotEmpty && content[0]['text'] != null) {
        return content[0]['text'];
      }
    }
    return '';
  }
}
