import 'package:flutter/material.dart';

class AppNavigationScaffold extends StatelessWidget {
  const AppNavigationScaffold({
    super.key,
    required this.title,
    required this.currentIndex,
    required this.child,
  });

  final String title;
  final int currentIndex;
  final Widget child;

  static const List<_AppDestination> _destinations = [
    _AppDestination(
      label: 'Dashboard',
      icon: Icons.dashboard_outlined,
      selectedIcon: Icons.dashboard,
      route: '/app/dashboard',
    ),
    _AppDestination(
      label: 'Chat',
      icon: Icons.chat_bubble_outline_rounded,
      selectedIcon: Icons.chat_bubble_rounded,
      route: '/app/chat',
    ),
    _AppDestination(
      label: 'Sessions',
      icon: Icons.history_rounded,
      selectedIcon: Icons.history_toggle_off_rounded,
      route: '/app/sessions',
    ),
    _AppDestination(
      label: 'Agents',
      icon: Icons.hub_outlined,
      selectedIcon: Icons.hub_rounded,
      route: '/app/agents',
    ),
    _AppDestination(
      label: 'Settings',
      icon: Icons.settings_outlined,
      selectedIcon: Icons.settings,
      route: '/app/settings',
    ),
  ];

  void _onSelectDestination(BuildContext context, int index) {
    if (index == currentIndex) {
      return;
    }
    Navigator.pushReplacementNamed(context, _destinations[index].route);
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final bool mobile = constraints.maxWidth < 768;
        final bool tablet = constraints.maxWidth >= 768 && constraints.maxWidth < 1024;

        if (mobile) {
          return Scaffold(
            appBar: AppBar(title: Text(title)),
            body: SafeArea(child: child),
            bottomNavigationBar: NavigationBar(
              selectedIndex: currentIndex,
              onDestinationSelected: (index) =>
                  _onSelectDestination(context, index),
              destinations: _destinations
                  .map(
                    (destination) => NavigationDestination(
                      icon: Icon(destination.icon),
                      selectedIcon: Icon(destination.selectedIcon),
                      label: destination.label,
                    ),
                  )
                  .toList(),
            ),
          );
        }

        if (tablet) {
          return Scaffold(
            appBar: AppBar(title: Text(title)),
            drawer: Drawer(
              child: SafeArea(
                child: ListView(
                  children: [
                    const ListTile(
                      title: Text('Polis'),
                      subtitle: Text('Navigation'),
                    ),
                    const Divider(height: 1),
                    ...List.generate(_destinations.length, (index) {
                      final destination = _destinations[index];
                      return ListTile(
                        leading: Icon(
                          index == currentIndex
                              ? destination.selectedIcon
                              : destination.icon,
                        ),
                        title: Text(destination.label),
                        selected: index == currentIndex,
                        onTap: () {
                          Navigator.pop(context);
                          _onSelectDestination(context, index);
                        },
                      );
                    }),
                  ],
                ),
              ),
            ),
            body: SafeArea(
              child: Align(
                alignment: Alignment.topCenter,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 1100),
                  child: child,
                ),
              ),
            ),
          );
        }

        final bool extendedRail = constraints.maxWidth >= 1150;
        return Scaffold(
          body: SafeArea(
            child: Row(
              children: [
                NavigationRail(
                  selectedIndex: currentIndex,
                  extended: extendedRail,
                  onDestinationSelected: (index) =>
                      _onSelectDestination(context, index),
                  labelType:
                      extendedRail ? null : NavigationRailLabelType.all,
                  destinations: _destinations
                      .map(
                        (destination) => NavigationRailDestination(
                          icon: Icon(destination.icon),
                          selectedIcon: Icon(destination.selectedIcon),
                          label: Text(destination.label),
                        ),
                      )
                      .toList(),
                ),
                const VerticalDivider(width: 1),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(24, 20, 24, 8),
                        child: Text(
                          title,
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                      ),
                      const Divider(height: 1),
                      Expanded(
                        child: Align(
                          alignment: Alignment.topCenter,
                          child: ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 1200),
                            child: child,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _AppDestination {
  const _AppDestination({
    required this.label,
    required this.icon,
    required this.selectedIcon,
    required this.route,
  });

  final String label;
  final IconData icon;
  final IconData selectedIcon;
  final String route;
}
