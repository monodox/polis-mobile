import 'package:flutter/material.dart';
import '../../widgets/app_navigation_scaffold.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool voiceEnabled = true;
  bool notificationsEnabled = true;
  String language = 'English';

  @override
  Widget build(BuildContext context) {
    return AppNavigationScaffold(
      title: 'Settings',
      currentIndex: 4,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Allows users to manage language, voice preferences, and application configuration.',
          ),
          const SizedBox(height: 16),
          Card(
            child: Column(
              children: [
                ListTile(
                  title: const Text('Language'),
                  subtitle: Text(language),
                  trailing: DropdownButton<String>(
                    value: language,
                    underline: const SizedBox.shrink(),
                    items: const [
                      DropdownMenuItem(value: 'English', child: Text('English')),
                      DropdownMenuItem(value: 'Spanish', child: Text('Spanish')),
                      DropdownMenuItem(value: 'French', child: Text('French')),
                    ],
                    onChanged: (value) {
                      if (value == null) {
                        return;
                      }
                      setState(() {
                        language = value;
                      });
                    },
                  ),
                ),
                SwitchListTile(
                  value: voiceEnabled,
                  title: const Text('Voice Interaction'),
                  subtitle: const Text('Enable voice-first conversations'),
                  onChanged: (value) {
                    setState(() {
                      voiceEnabled = value;
                    });
                  },
                ),
                SwitchListTile(
                  value: notificationsEnabled,
                  title: const Text('Notifications'),
                  subtitle: const Text('Receive assistant updates and reminders'),
                  onChanged: (value) {
                    setState(() {
                      notificationsEnabled = value;
                    });
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: () {},
            child: const Text('Save Preferences'),
          ),
        ],
      ),
    );
  }
}
