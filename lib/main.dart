import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/supabase.dart';
import 'core/theme.dart';
import 'core/theme_provider.dart';
import 'pages/app/agents.dart';
import 'pages/app/chat.dart';
import 'pages/app/dashboard.dart';
import 'pages/app/settings.dart';
import 'pages/app/sessions.dart';
import 'pages/auth/forgot.dart';
import 'pages/auth/login.dart';
import 'pages/auth/reset.dart';
import 'pages/auth/signup.dart';
import 'pages/legal/cookies.dart';
import 'pages/legal/privacy.dart';
import 'pages/legal/terms.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase
  await SupabaseConfig.initialize();
  
  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeProvider(),
      child: const PolisApp(),
    ),
  );
}

class PolisApp extends StatelessWidget {
  const PolisApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Polis',
          theme: AppTheme.lightTheme(),
          darkTheme: AppTheme.darkTheme(),
          themeMode: themeProvider.themeMode,
          routes: {
            '/auth/login': (_) => const LoginPage(),
            '/auth/signup': (_) => const SignupPage(),
            '/auth/forgot': (_) => const ForgotPage(),
            '/auth/reset': (_) => const ResetPage(),
            '/app/dashboard': (_) => const DashboardPage(),
            '/app/chat': (_) => const ChatPage(),
            '/app/sessions': (_) => const SessionsPage(),
            '/app/agents': (_) => const AgentsPage(),
            '/app/settings': (_) => const SettingsPage(),
            '/legal/terms': (_) => const TermsPage(),
            '/legal/cookies': (_) => const CookiesPage(),
            '/legal/privacy': (_) => const PrivacyPage(),
          },
          home: const DashboardPage(),
        );
      },
    );
  }
}
