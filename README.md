# polis-mobile

Polis is a voice-first AI assistant that helps citizens understand and access government services through natural conversation. Using real-time voice interaction powered by Amazon Nova 2 Sonic, users can ask questions about public programs, eligibility, and required documents in their own language. The system interprets the request, retrieves relevant information, and provides simple step-by-step guidance. Instead of navigating complex government websites or forms, citizens can speak to Polis and receive clear answers instantly.

## Project Status

This project is currently in early development (WIP) and is not feature-complete yet.

## Vision

Polis aims to reduce friction for citizens by offering:

- Natural voice interaction for government-service questions
- Clear eligibility and required-document guidance
- Step-by-step, easy-to-follow support in the user’s language

## Current Scope

- Flutter frontend scaffold for Android, iOS, and Web
- Minimal route-based pages for legal, auth, and app sections
- Initial theme setup with Google Fonts

## Planned

- Voice-first assistant flow
- Multilingual conversation support
- Government service discovery and guidance
- Eligibility/document guidance experience

## Project Structure

Current folder structure snapshot:

```text
polis-mobile/
├─ .env.example
├─ .env.local
├─ .gitignore
├─ analysis_options.yaml
├─ CHANGELOG.md
├─ CODE_OF_CONDUCT.md
├─ CONTRIBUTING.md
├─ LICENSE
├─ pubspec.yaml
├─ pubspec.lock
├─ README.md
├─ ROADMAP.md
├─ SECURITY.md
├─ android/
│  ├─ app/
│  ├─ local.properties
│  └─ README.md
├─ ios/
│  ├─ Flutter/
│  ├─ Runner/
│  └─ README.md
├─ lib/
│  ├─ main.dart
│  ├─ core/
│  │  ├─ theme.dart
│  │  └─ router.dart
│  ├─ pages/
│  │  ├─ app/
│  │  │  ├─ dashboard.dart
│  │  │  ├─ chat.dart
│  │  │  ├─ sessions.dart
│  │  │  ├─ agents.dart
│  │  │  └─ settings.dart
│  │  ├─ auth/
│  │  │  ├─ login.dart
│  │  │  ├─ signup.dart
│  │  │  ├─ forgot.dart
│  │  │  └─ reset.dart
│  │  └─ legal/
│  │     ├─ terms.dart
│  │     ├─ cookies.dart
│  │     └─ privacy.dart
│  ├─ services/
│  │  ├─ voice_service.dart
│  │  └─ api_service.dart
│  └─ widgets/
└─ web/
	├─ flutter_bootstrap.js
	├─ index.html
	└─ manifest.json
```

## Getting Started

### Quick Start (Current Development)

**⚠️ Database Schema Update Required**

If you're continuing from a previous setup, the database schema has been updated. Follow the quick fix:

1. **See [QUICK_START.md](QUICK_START.md) for step-by-step instructions**
2. Run `supabase/quick-fix.sql` in Supabase SQL Editor
3. Restart the agents server: `cd agents && npm run server`
4. Refresh the Flutter app

### Prerequisites

- Flutter SDK (stable)
- Dart SDK (comes with Flutter)
- Android Studio/Xcode (for mobile targets)
- Node.js 18+ (for TypeScript agents)
- Supabase account
- AWS account with Bedrock access

### Setup

1. Install dependencies:
	- `flutter pub get`
	- `cd agents && npm install`
2. Configure environment:
	- Copy `.env.example` to `.env.local`
	- Add your Supabase URL and anon key
	- Add your AWS credentials
3. Setup database:
	- Run `supabase/quick-fix.sql` in Supabase SQL Editor
	- See `supabase/README.md` for details
4. Start agents server:
	- `cd agents && npm run server`
5. Run Flutter app:
	- `flutter run -d chrome` (web)
	- `flutter run -d <device-id>` (mobile)

## Environment

- Use `.env.example` as the template for expected variables.
- Use `.env.local` for local machine values.
- Do not commit sensitive credentials.

## Open Source Docs

- Contributing guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)
- Roadmap: [ROADMAP.md](ROADMAP.md)

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
