import 'package:flutter/material.dart';
import '../../widgets/app_navigation_scaffold.dart';

class ChatPage extends StatelessWidget {
  const ChatPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppNavigationScaffold(
      title: 'Chat',
      currentIndex: 1,
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            color: Colors.blueGrey.shade50,
            child: const Text(
              'The main interaction screen where users talk to the AI assistant using voice or text.',
            ),
          ),
          const Expanded(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  _MessageBubble(
                    text: 'What documents do I need to renew my passport?',
                    isUser: true,
                  ),
                  _MessageBubble(
                    text: 'You typically need your current passport, recent photos, proof of identity, and the renewal form.',
                    isUser: false,
                  ),
                  _MessageBubble(
                    text: 'Can I complete it online?',
                    isUser: true,
                  ),
                  _MessageBubble(
                    text: 'That depends on the service rules in your region, but I can guide you through the next steps.',
                    isUser: false,
                  ),
                ],
              ),
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Ask about a government service...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  IconButton.filled(
                    onPressed: () {},
                    icon: const Icon(Icons.mic_none_rounded),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  const _MessageBubble({required this.text, required this.isUser});

  final String text;
  final bool isUser;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        constraints: const BoxConstraints(maxWidth: 320),
        decoration: BoxDecoration(
          color: isUser ? Colors.blueGrey.shade900 : Colors.blueGrey.shade100,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Text(
          text,
          style: TextStyle(
            color: isUser ? Colors.white : Colors.black87,
          ),
        ),
      ),
    );
  }
}
