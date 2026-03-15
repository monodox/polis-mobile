import 'dart:convert';
import 'package:http/http.dart' as http;

class AgentsService {
  final String baseUrl;

  AgentsService({this.baseUrl = 'http://localhost:3000'});

  Future<ChatResponse> sendMessage({
    required String message,
    required String sessionId,
    String? userId,
    String language = 'en',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/chat'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'message': message,
          'sessionId': sessionId,
          'userId': userId ?? 'anonymous',
          'language': language,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return ChatResponse.fromJson(data);
      } else {
        throw Exception('Failed to send message: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error sending message: $e');
    }
  }

  Future<VoiceResponse> sendVoice({
    required String audioData,
    required String sessionId,
    String? userId,
    String language = 'en',
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/voice'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'audioData': audioData,
          'sessionId': sessionId,
          'userId': userId ?? 'anonymous',
          'language': language,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return VoiceResponse.fromJson(data);
      } else {
        throw Exception('Failed to process voice: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error processing voice: $e');
    }
  }

  Future<SessionResponse> createSession({
    String? userId,
    String? slug,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/sessions'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId ?? 'anonymous',
          'slug': slug,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return SessionResponse.fromJson(data);
      } else {
        throw Exception('Failed to create session: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error creating session: $e');
    }
  }

  Future<List<Message>> getSessionMessages(String sessionId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/sessions/$sessionId/messages'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final messages = (data['messages'] as List)
            .map((m) => Message.fromJson(m))
            .toList();
        return messages;
      } else {
        throw Exception('Failed to get messages: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error getting messages: $e');
    }
  }

  Future<List<Session>> getUserSessions(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/users/$userId/sessions'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final sessions = (data['sessions'] as List)
            .map((s) => Session.fromJson(s))
            .toList();
        return sessions;
      } else {
        throw Exception('Failed to get sessions: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error getting sessions: $e');
    }
  }
}

class ChatResponse {
  final bool success;
  final String? response;
  final String? error;

  ChatResponse({
    required this.success,
    this.response,
    this.error,
  });

  factory ChatResponse.fromJson(Map<String, dynamic> json) {
    return ChatResponse(
      success: json['success'] ?? false,
      response: json['data']?['response'],
      error: json['error'],
    );
  }
}

class VoiceResponse {
  final bool success;
  final String? transcription;
  final String? response;
  final String? error;

  VoiceResponse({
    required this.success,
    this.transcription,
    this.response,
    this.error,
  });

  factory VoiceResponse.fromJson(Map<String, dynamic> json) {
    return VoiceResponse(
      success: json['success'] ?? false,
      transcription: json['data']?['transcription'],
      response: json['data']?['response'],
      error: json['error'],
    );
  }
}

class SessionResponse {
  final bool success;
  final Session? session;
  final String? error;

  SessionResponse({
    required this.success,
    this.session,
    this.error,
  });

  factory SessionResponse.fromJson(Map<String, dynamic> json) {
    return SessionResponse(
      success: json['success'] ?? false,
      session: json['session'] != null ? Session.fromJson(json['session']) : null,
      error: json['error'],
    );
  }
}

class Message {
  final String id;
  final String sessionId;
  final String role;
  final String content;
  final DateTime createdAt;

  Message({
    required this.id,
    required this.sessionId,
    required this.role,
    required this.content,
    required this.createdAt,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'],
      sessionId: json['session_id'],
      role: json['role'],
      content: json['content'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}

class Session {
  final String id;
  final String userId;
  final String? slug;
  final DateTime createdAt;
  final DateTime? lastMessageAt;

  Session({
    required this.id,
    required this.userId,
    this.slug,
    required this.createdAt,
    this.lastMessageAt,
  });

  factory Session.fromJson(Map<String, dynamic> json) {
    return Session(
      id: json['id'],
      userId: json['user_id'],
      slug: json['slug'],
      createdAt: DateTime.parse(json['created_at']),
      lastMessageAt: json['last_message_at'] != null
          ? DateTime.parse(json['last_message_at'])
          : null,
    );
  }
}
