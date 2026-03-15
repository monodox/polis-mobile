import 'package:flutter/material.dart';
import '../../widgets/app_navigation_scaffold.dart';

class SessionsPage extends StatelessWidget {
  const SessionsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppNavigationScaffold(
      title: 'Sessions',
      currentIndex: 2,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Text(
            'A list of past conversations so users can review previous questions and responses.',
          ),
          SizedBox(height: 16),
          _SessionTile(
            title: 'Passport renewal guidance',
            subtitle: 'Asked about documents and online process',
            time: 'Today, 10:42 AM',
          ),
          _SessionTile(
            title: 'Child benefit eligibility',
            subtitle: 'Reviewed age rules and supporting documents',
            time: 'Yesterday, 3:18 PM',
          ),
          _SessionTile(
            title: 'Housing assistance options',
            subtitle: 'Compared available public programs',
            time: 'Mar 12, 8:05 PM',
          ),
        ],
      ),
    );
  }
}

class _SessionTile extends StatelessWidget {
  const _SessionTile({
    required this.title,
    required this.subtitle,
    required this.time,
  });

  final String title;
  final String subtitle;
  final String time;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: const CircleAvatar(
          child: Icon(Icons.history_rounded),
        ),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: Text(time, style: Theme.of(context).textTheme.bodySmall),
      ),
    );
  }
}
