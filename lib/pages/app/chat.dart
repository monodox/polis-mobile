import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import 'dart:convert';
import '../../widgets/app_navigation_scaffold.dart';
import '../../services/agents_service.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  final AgentsService _agentsService = AgentsService();
  late stt.SpeechToText _speech;
  late FlutterTts _tts;
  
  String? _currentSessionId;
  String? _currentSessionSlug;
  bool _isVoiceMode = true;
  bool _isListening = false;
  bool _isSending = false;
  bool _isSpeaking = false;
  bool _speechAvailable = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
    _tts = FlutterTts();
    _initSpeech();
    _initTts();
    _loadSession();
  }

  Future<void> _initSpeech() async {
    _speechAvailable = await _speech.initialize(
      onError: (error) => setState(() => _error = 'Speech error: ${error.errorMsg}'),
      onStatus: (status) => print('Speech status: $status'),
    );
    setState(() {});
  }

  Future<void> _initTts() async {
    await _tts.setLanguage('en-US');
    await _tts.setSpeechRate(0.5);
    await _tts.setVolume(1.0);
    await _tts.setPitch(1.0);
    
    _tts.setStartHandler(() {
      setState(() => _isSpeaking = true);
    });
    
    _tts.setCompletionHandler(() {
      setState(() => _isSpeaking = false);
    });
    
    _tts.setErrorHandler((msg) {
      setState(() {
        _isSpeaking = false;
        _error = 'TTS error: $msg';
      });
    });
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _tts.stop();
    super.dispose();
  }

  Future<void> _loadSession() async {
    final prefs = await SharedPreferences.getInstance();
    final sessionId = prefs.getString('current_session_id');
    final sessionSlug = prefs.getString('current_session_slug');
    final cachedMessages = prefs.getString('session_messages_$sessionId');

    if (sessionId != null && cachedMessages != null) {
      setState(() {
        _currentSessionId = sessionId;
        _currentSessionSlug = sessionSlug;
        final List<dynamic> decoded = jsonDecode(cachedMessages);
        _messages.addAll(
          decoded.map((m) => ChatMessage.fromJson(m)).toList(),
        );
      });
    } else {
      await _createNewSession();
    }
  }

  Future<void> _createNewSession() async {
    final now = DateTime.now();
    final slug = _generateSlug(now);

    try {
      // Create session via API
      final response = await _agentsService.createSession(
        userId: 'user_001',
        slug: slug,
      );

      if (response.success && response.session != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('current_session_id', response.session!.id);
        await prefs.setString('current_session_slug', slug);

        setState(() {
          _currentSessionId = response.session!.id;
          _currentSessionSlug = slug;
          _messages.clear();
          _error = null;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to create session: $e';
      });
    }
  }

  String _generateSlug(DateTime date) {
    final hour = date.hour;
    String timeOfDay;
    if (hour < 12) {
      timeOfDay = 'morning';
    } else if (hour < 17) {
      timeOfDay = 'afternoon';
    } else {
      timeOfDay = 'evening';
    }

    final topics = [
      'chat',
      'inquiry',
      'assistance',
      'help',
      'support',
      'question',
      'service',
    ];
    final topic = topics[date.second % topics.length];

    return '$timeOfDay-$topic-${date.day}${date.month}';
  }

  Future<void> _saveMessages() async {
    if (_currentSessionId == null) return;

    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(_messages.map((m) => m.toJson()).toList());
    await prefs.setString('session_messages_$_currentSessionId', encoded);
  }

  Future<void> _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty || _isSending || _currentSessionId == null) return;

    setState(() {
      _isSending = true;
      _messages.add(ChatMessage(
        text: text,
        isUser: true,
        timestamp: DateTime.now(),
      ));
      _error = null;
    });

    _messageController.clear();
    _scrollToBottom();
    await _saveMessages();

    try {
      // Send message to agents API
      final response = await _agentsService.sendMessage(
        message: text,
        sessionId: _currentSessionId!,
        userId: 'user_001',
        language: 'en',
      );

      if (response.success && response.response != null) {
        setState(() {
          _messages.add(ChatMessage(
            text: response.response!,
            isUser: false,
            timestamp: DateTime.now(),
          ));
          _isSending = false;
        });
        
        // Speak response in voice mode
        if (_isVoiceMode) {
          await _speakResponse(response.response!);
        }
      } else {
        setState(() {
          _error = response.error ?? 'Failed to get response';
          _isSending = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error: $e';
        _isSending = false;
      });
    }

    _scrollToBottom();
    await _saveMessages();
  }

  Future<void> _speakResponse(String text) async {
    try {
      await _tts.speak(text);
    } catch (e) {
      print('TTS error: $e');
    }
  }

  Future<void> _stopSpeaking() async {
    await _tts.stop();
    setState(() => _isSpeaking = false);
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _toggleVoiceMode() {
    // Stop any ongoing speech when switching modes
    if (_isSpeaking) {
      _stopSpeaking();
    }
    setState(() {
      _isVoiceMode = !_isVoiceMode;
    });
  }

  void _toggleListening() async {
    if (!_speechAvailable) {
      setState(() {
        _error = 'Speech recognition not available';
      });
      return;
    }

    if (_isListening) {
      // Stop listening
      await _speech.stop();
      setState(() {
        _isListening = false;
      });
    } else {
      // Start listening
      setState(() {
        _isListening = true;
        _error = null;
      });

      await _speech.listen(
        onResult: (result) {
          setState(() {
            _messageController.text = result.recognizedWords;
          });
          
          // Auto-send when speech is finalized
          if (result.finalResult && result.recognizedWords.isNotEmpty) {
            setState(() => _isListening = false);
            Future.delayed(const Duration(milliseconds: 500), () {
              if (_messageController.text.isNotEmpty && !_isSending) {
                _sendMessage();
              }
            });
          }
        },
        listenFor: const Duration(seconds: 30),
        pauseFor: const Duration(seconds: 3),
        partialResults: true,
        cancelOnError: true,
        listenMode: stt.ListenMode.confirmation,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppNavigationScaffold(
      title: _currentSessionSlug ?? 'Chat',
      currentIndex: 1,
      child: Column(
        children: [
          // Error banner
          if (_error != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              color: Colors.red.shade100,
              child: Row(
                children: [
                  Icon(Icons.error_outline, color: Colors.red.shade900),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _error!,
                      style: TextStyle(color: Colors.red.shade900),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => setState(() => _error = null),
                  ),
                ],
              ),
            ),
          
          // Mode Toggle Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              border: Border(
                bottom: BorderSide(
                  color: Theme.of(context).dividerColor,
                  width: 1,
                ),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  _isVoiceMode ? Icons.mic : Icons.keyboard,
                  size: 20,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Text(
                  _isVoiceMode ? 'Voice Mode' : 'Text Mode',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                ),
                const Spacer(),
                Switch(
                  value: _isVoiceMode,
                  onChanged: (_) => _toggleVoiceMode(),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.add_circle_outline),
                  onPressed: _createNewSession,
                  tooltip: 'New session',
                ),
              ],
            ),
          ),

          // Messages
          Expanded(
            child: _messages.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              color: Theme.of(context)
                                  .colorScheme
                                  .primaryContainer,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              _isVoiceMode
                                  ? Icons.mic_none_rounded
                                  : Icons.chat_bubble_outline_rounded,
                              size: 40,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            _isVoiceMode
                                ? 'Tap the microphone to start'
                                : 'Start a conversation',
                            style: Theme.of(context).textTheme.headlineSmall,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _isVoiceMode
                                ? 'Voice mode is active - speak naturally'
                                : 'Ask about government services',
                            style:
                                Theme.of(context).textTheme.bodyMedium?.copyWith(
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onSurface
                                          .withOpacity(0.6),
                                    ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      return _MessageBubble(message: _messages[index]);
                    },
                  ),
          ),

          // Input Area
          SafeArea(
            top: false,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                border: Border(
                  top: BorderSide(
                    color: Theme.of(context).dividerColor,
                    width: 1,
                  ),
                ),
              ),
              child: _isVoiceMode
                  ? _buildVoiceInput()
                  : _buildTextInput(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVoiceInput() {
    return Column(
      children: [
        if (_isSpeaking)
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.primary,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'Speaking...',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                ),
                const SizedBox(width: 8),
                TextButton(
                  onPressed: _stopSpeaking,
                  child: const Text('Stop'),
                ),
              ],
            ),
          ),
        if (_isListening)
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'Listening...',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.red,
                        fontWeight: FontWeight.w600,
                      ),
                ),
              ],
            ),
          ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Voice Button (Large and prominent)
            GestureDetector(
              onTap: _toggleListening,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: _isListening ? 80 : 72,
                height: _isListening ? 80 : 72,
                decoration: BoxDecoration(
                  color: _isListening
                      ? Colors.red
                      : Theme.of(context).colorScheme.primary,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: (_isListening ? Colors.red : Theme.of(context).colorScheme.primary)
                          .withOpacity(0.3),
                      blurRadius: _isListening ? 20 : 12,
                      spreadRadius: _isListening ? 4 : 2,
                    ),
                  ],
                ),
                child: Icon(
                  _isListening ? Icons.mic : Icons.mic_none_rounded,
                  color: Colors.white,
                  size: _isListening ? 40 : 36,
                ),
              ),
            ),
            const SizedBox(width: 16),
            // Switch to text mode button
            IconButton(
              onPressed: _toggleVoiceMode,
              icon: const Icon(Icons.keyboard),
              tooltip: 'Switch to text mode',
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildTextInput() {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _messageController,
            decoration: InputDecoration(
              hintText: 'Ask about a government service...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 20,
                vertical: 12,
              ),
            ),
            maxLines: null,
            textInputAction: TextInputAction.send,
            onSubmitted: (_) => _sendMessage(),
          ),
        ),
        const SizedBox(width: 12),
        IconButton.filled(
          onPressed: _isSending ? null : _sendMessage,
          icon: _isSending
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Icon(Icons.send_rounded),
          iconSize: 24,
        ),
        const SizedBox(width: 8),
        IconButton(
          onPressed: _toggleVoiceMode,
          icon: const Icon(Icons.mic_none_rounded),
          tooltip: 'Switch to voice mode',
        ),
      ],
    );
  }
}

class _MessageBubble extends StatelessWidget {
  const _MessageBubble({required this.message});

  final ChatMessage message;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: message.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        decoration: BoxDecoration(
          color: message.isUser
              ? Theme.of(context).colorScheme.primary
              : Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(20).copyWith(
            bottomRight: message.isUser ? const Radius.circular(4) : null,
            bottomLeft: !message.isUser ? const Radius.circular(4) : null,
          ),
        ),
        child: Text(
          message.text,
          style: TextStyle(
            color: message.isUser
                ? Theme.of(context).colorScheme.onPrimary
                : Theme.of(context).colorScheme.onSurface,
            fontSize: 15,
          ),
        ),
      ),
    );
  }
}

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({
    required this.text,
    required this.isUser,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
        'text': text,
        'isUser': isUser,
        'timestamp': timestamp.toIso8601String(),
      };

  factory ChatMessage.fromJson(Map<String, dynamic> json) => ChatMessage(
        text: json['text'],
        isUser: json['isUser'],
        timestamp: DateTime.parse(json['timestamp']),
      );
}
