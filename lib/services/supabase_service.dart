import 'package:supabase_flutter/supabase_flutter.dart';
import '../core/supabase.dart';

class SupabaseService {
  final SupabaseClient _client = supabase;

  // Authentication methods
  Future<AuthResponse> signUp({
    required String email,
    required String password,
  }) async {
    return await _client.auth.signUp(
      email: email,
      password: password,
    );
  }

  Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    return await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<void> signOut() async {
    await _client.auth.signOut();
  }

  Future<void> resetPassword(String email) async {
    await _client.auth.resetPasswordForEmail(email);
  }

  User? get currentUser => _client.auth.currentUser;

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;

  // Chat/Session methods
  Future<List<Map<String, dynamic>>> getSessions() async {
    final response = await _client
        .from('sessions')
        .select()
        .order('created_at', ascending: false);
    return List<Map<String, dynamic>>.from(response);
  }

  Future<Map<String, dynamic>> createSession({
    required String title,
    String? description,
  }) async {
    final response = await _client.from('sessions').insert({
      'title': title,
      'description': description,
      'user_id': currentUser?.id,
    }).select().single();
    return response;
  }

  Future<List<Map<String, dynamic>>> getMessages(String sessionId) async {
    final response = await _client
        .from('messages')
        .select()
        .eq('session_id', sessionId)
        .order('created_at', ascending: true);
    return List<Map<String, dynamic>>.from(response);
  }

  Future<Map<String, dynamic>> sendMessage({
    required String sessionId,
    required String content,
    required String role,
  }) async {
    final response = await _client.from('messages').insert({
      'session_id': sessionId,
      'content': content,
      'role': role,
      'user_id': currentUser?.id,
    }).select().single();
    return response;
  }

  // Agent configuration methods
  Future<List<Map<String, dynamic>>> getAgents() async {
    final response = await _client
        .from('agents')
        .select()
        .order('name', ascending: true);
    return List<Map<String, dynamic>>.from(response);
  }

  Future<Map<String, dynamic>> updateAgentConfig({
    required String agentId,
    required Map<String, dynamic> config,
  }) async {
    final response = await _client
        .from('agents')
        .update({'config': config})
        .eq('id', agentId)
        .select()
        .single();
    return response;
  }

  // User preferences
  Future<Map<String, dynamic>?> getUserPreferences() async {
    if (currentUser == null) return null;
    
    final response = await _client
        .from('user_preferences')
        .select()
        .eq('user_id', currentUser!.id)
        .maybeSingle();
    return response;
  }

  Future<void> updateUserPreferences({
    required Map<String, dynamic> preferences,
  }) async {
    if (currentUser == null) return;

    await _client.from('user_preferences').upsert({
      'user_id': currentUser!.id,
      'preferences': preferences,
    });
  }
}
