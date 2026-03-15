import 'package:flutter/material.dart';
import '../../widgets/app_navigation_scaffold.dart';

class AgentsPage extends StatelessWidget {
  const AgentsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppNavigationScaffold(
      title: 'Agents',
      currentIndex: 3,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Text(
            'Displays the internal AI agents and how they process and respond to user requests.',
          ),
          SizedBox(height: 16),
          _AgentCard(
            title: 'Intent Agent',
            status: 'Active',
            description: 'Classifies what service or question the user is asking about.',
          ),
          _AgentCard(
            title: 'Knowledge Agent',
            status: 'Active',
            description: 'Finds relevant government service guidance and supporting information.',
          ),
          _AgentCard(
            title: 'Response Agent',
            status: 'Ready',
            description: 'Transforms results into a simple, step-by-step explanation for the user.',
          ),
        ],
      ),
    );
  }
}

class _AgentCard extends StatelessWidget {
  const _AgentCard({
    required this.title,
    required this.status,
    required this.description,
  });

  final String title;
  final String status;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: Theme.of(context).textTheme.titleMedium),
                Chip(label: Text(status)),
              ],
            ),
            const SizedBox(height: 8),
            Text(description),
          ],
        ),
      ),
    );
  }
}
