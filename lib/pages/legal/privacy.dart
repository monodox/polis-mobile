import 'package:flutter/material.dart';

class PrivacyPage extends StatelessWidget {
  const PrivacyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Privacy')),
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Outlines how user data is collected, stored, and protected within the platform.',
          ),
        ),
      ),
    );
  }
}
