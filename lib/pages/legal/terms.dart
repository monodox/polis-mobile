import 'package:flutter/material.dart';

class TermsPage extends StatelessWidget {
  const TermsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Terms')),
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Displays the terms and conditions governing the use of the application.',
          ),
        ),
      ),
    );
  }
}
