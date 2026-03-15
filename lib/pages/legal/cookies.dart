import 'package:flutter/material.dart';

class CookiesPage extends StatelessWidget {
  const CookiesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Cookies')),
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            'Explains how cookies are used to improve functionality and user experience.',
          ),
        ),
      ),
    );
  }
}
