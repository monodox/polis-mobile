import 'package:flutter/material.dart';

import '../../widgets/app_navigation_scaffold.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppNavigationScaffold(
      title: 'Dashboard',
      currentIndex: 0,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _StatusBanner(),
          SizedBox(height: 16),
          _InsightGrid(),
          SizedBox(height: 16),
          _SectionTitle('Recent Activity'),
          SizedBox(height: 8),
          _ActivityTile(
            title: 'Voice assistant started',
            subtitle: 'English session started 2 minutes ago',
            icon: Icons.graphic_eq_rounded,
          ),
          _ActivityTile(
            title: 'Eligibility guidance completed',
            subtitle: 'Housing support flow answered successfully',
            icon: Icons.check_circle_outline_rounded,
          ),
          _ActivityTile(
            title: 'Document checklist shared',
            subtitle: 'Passport renewal guidance sent to user',
            icon: Icons.description_outlined,
          ),
        ],
      ),
    );
  }
}

class _StatusBanner extends StatelessWidget {
  const _StatusBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blueGrey.shade50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.blueGrey.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Assistant Status', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          const Text(
            'A simple overview page showing recent activity, system status, and quick insights about the assistant.',
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: const [
              Chip(label: Text('System Online')),
              Chip(label: Text('Voice Ready')),
              Chip(label: Text('3 Active Sessions')),
            ],
          ),
        ],
      ),
    );
  }
}

class _InsightGrid extends StatelessWidget {
  const _InsightGrid();

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 700) {
          return const Column(
            children: [
              _InsightCard(
                label: 'Requests Today',
                value: '128',
                icon: Icons.bolt_rounded,
              ),
              SizedBox(height: 12),
              _InsightCard(
                label: 'Avg. Response',
                value: '1.4s',
                icon: Icons.timer_outlined,
              ),
            ],
          );
        }

        return const Row(
          children: [
            Expanded(
              child: _InsightCard(
                label: 'Requests Today',
                value: '128',
                icon: Icons.bolt_rounded,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: _InsightCard(
                label: 'Avg. Response',
                value: '1.4s',
                icon: Icons.timer_outlined,
              ),
            ),
          ],
        );
      },
    );
  }
}

class _InsightCard extends StatelessWidget {
  const _InsightCard({
    required this.label,
    required this.value,
    required this.icon,
  });

  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon),
            const SizedBox(height: 12),
            Text(value, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 4),
            Text(label),
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.title);

  final String title;

  @override
  Widget build(BuildContext context) {
    return Text(title, style: Theme.of(context).textTheme.titleMedium);
  }
}

class _ActivityTile extends StatelessWidget {
  const _ActivityTile({
    required this.title,
    required this.subtitle,
    required this.icon,
  });

  final String title;
  final String subtitle;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: Text(subtitle),
      ),
    );
  }
}
