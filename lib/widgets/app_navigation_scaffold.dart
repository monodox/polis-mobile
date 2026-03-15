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

  Widget _buildLogo(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 56, // Match AppBar height
      padding: const EdgeInsets.symmetric(horizontal: 16),
      alignment: Alignment.centerLeft,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: const Color(0xFF2563EB),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.account_balance,
              color: Colors.white,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          const Text(
            'Polis',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final bool mobile = constraints.maxWidth < 768;
        final bool tablet = constraints.maxWidth >= 768 && constraints.maxWidth < 1024;

        if (mobile) {
          return Scaffold(
            appBar: AppBar(
              title: Row(
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: const Color(0xFF2563EB),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Icon(
                      Icons.account_balance,
                      color: Colors.white,
                      size: 18,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(title),
                ],
              ),
            ),
            body: SafeArea(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: child,
              ),
            ),
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
            appBar: AppBar(
              title: Row(
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: const Color(0xFF2563EB),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Icon(
                      Icons.account_balance,
                      color: Colors.white,
                      size: 18,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(title),
                ],
              ),
            ),
            drawer: Drawer(
              child: SafeArea(
                child: Column(
                  children: [
                    _buildLogo(context),
                    Divider(
                      height: 1,
                      thickness: 1,
                      color: Theme.of(context).dividerColor,
                    ),
                    Expanded(
                      child: ListView(
                        children: List.generate(_destinations.length, (index) {
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
                      ),
                    ),
                  ],
                ),
              ),
            ),
            body: SafeArea(
              child: Align(
                alignment: Alignment.topCenter,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 1100),
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: child,
                  ),
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
                SizedBox(
                  width: extendedRail ? 256 : 80,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildLogo(context),
                      Divider(
                        height: 1,
                        thickness: 1,
                        color: Theme.of(context).dividerColor,
                      ),
                      Expanded(
                        child: NavigationRail(
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
                      ),
                    ],
                  ),
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
                            child: AnimatedSwitcher(
                              duration: const Duration(milliseconds: 300),
                              child: child,
                            ),
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
