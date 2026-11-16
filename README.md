# Zeta 2

Zeta 2 is a Next.js dashboard for economic intelligence in **World of Warcraft Forever**. It is intended to combine Auction House data, crafting economics, professions, guild information, and price history in one workspace. The current application provides the dashboard shell and feature routes; Firebase-backed data workflows are being added incrementally.

## Quick start

### Prerequisites

- Node.js 20 or newer (LTS recommended)
- npm
- A Firebase project for authentication and Firestore-backed features

### Run locally

```bash
# Install dependencies
npm install

# Create local configuration
Copy-Item .env.example .env.local
# Edit .env.local with your Firebase values

# Start the development server
npm run dev
```

Open <http://localhost:3000>. Available dashboard routes are:

- `/` — overview and system status
- `/market` — market analysis area
- `/crafting` — crafting analysis area
- `/professions` — professions area
- `/guild` — guild area
- `/settings` — application settings

Other useful commands:

```bash
npm run lint    # Run ESLint
npm run build   # Create a production build
npm run start   # Serve the production build locally
```

## Project structure

```text
.
├── docs/                         # Detailed architecture, database, import, and standards docs
├── public/                       # Static assets
├── src/
│   ├── app/                      # Next.js App Router routes and global styles
│   │   ├── page.tsx              # Dashboard home
│   │   ├── market/page.tsx       # Market route
│   │   ├── crafting/page.tsx     # Crafting route
│   │   ├── professions/page.tsx  # Professions route
│   │   ├── guild/page.tsx        # Guild route
│   │   ├── settings/page.tsx     # Settings route
│   │   ├── layout.tsx            # Root layout and metadata
│   │   └── globals.css           # Tailwind CSS entry and global styles
│   ├── components/layout/        # Header, sidebar, and dashboard layout
│   ├── config/firebase.ts        # Environment-driven Firebase configuration
│   ├── services/firebase/        # Firebase client and Firebase Admin initialization
│   └── types/                    # Shared item, recipe, pricing, user, and guild types
├── .env.example                  # Environment variable template
├── next.config.ts                # Next.js and Turbopack configuration
├── package.json                  # Scripts and dependencies
└── tsconfig.json                 # Strict TypeScript configuration and @/* alias
```

The `docs/` directory contains the more detailed [architecture](docs/ARCHITECTURE.md), [database schema](docs/DATABASE.md), [data import strategy](docs/DATA_IMPORT.md), [coding standards](docs/CODING_STANDARDS.md), and [roadmap](docs/ROADMAP.md).

## Firebase setup

1. Create or select a project in the [Firebase Console](https://console.firebase.google.com/).
2. Add a Web App under **Project settings > Your apps**.
3. Enable the Firebase products required by the application, at minimum:
   - **Authentication** (choose the sign-in providers you intend to support).
   - **Cloud Firestore** (create a database in the appropriate region).
4. Copy the Web App configuration into the `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local`.
5. For server-side operations, open **Project settings > Service accounts**, create a private key, and store the complete JSON object in `FIREBASE_ADMIN_SDK_KEY`.
6. Configure Firestore security rules and indexes before using production data. Never commit `.env.local` or service-account credentials.

The browser SDK is initialized by `src/services/firebase/client.ts` and provides Auth and Firestore. Server-side code should use `src/services/firebase/server.ts`, which initializes the Firebase Admin SDK lazily. The Admin SDK key is never intended for client-side exposure.

### Firebase Emulator Suite

For local client testing, install the Firebase CLI and start the emulators in a separate terminal:

```bash
npm install --global firebase-tools
firebase login
firebase emulators:start
```

Then set these values in `.env.local`:

```dotenv
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_AUTH_EMULATOR_HOST=localhost:9099
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost:8080
```

The current client initialization connects Auth and Firestore to those emulator endpoints. The Admin initialization currently expects `FIREBASE_ADMIN_SDK_KEY`; configure Admin emulator routing separately if you add server-side emulator workflows.

## Configuration

Copy `.env.example` to `.env.local`. Values beginning with `NEXT_PUBLIC_` are bundled for browser use, so they must not contain secrets. `FIREBASE_ADMIN_SDK_KEY` is server-only and must contain valid service-account JSON.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client Firebase | Firebase Web App API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client Firebase | Usually `<project-id>.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client and Admin | Firebase project identifier |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client Firebase | Storage bucket from the Web App config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client Firebase | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client Firebase | Firebase Web App ID |
| `FIREBASE_ADMIN_SDK_KEY` | Server features | Complete service-account JSON string |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | Optional | Set to `true` to use client emulators |
| `NEXT_PUBLIC_AUTH_EMULATOR_HOST` | Optional | Auth host and port; defaults to `localhost:9099` |
| `NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST` | Optional | Firestore host and port; defaults to `localhost:8080` |
| `NEXT_PUBLIC_APP_NAME` | Optional | Application display name |
| `NEXT_PUBLIC_APP_VERSION` | Optional | Application version label |

Do not replace `.env.example` with real credentials. Environment files are ignored by Git; use your hosting provider's secret/environment configuration in deployments.

## Architecture overview

The project uses the Next.js App Router with a presentation-oriented dashboard shell:

1. **Routing and rendering** — `src/app` maps URL segments to pages. `layout.tsx` provides metadata, fonts, and global styles.
2. **UI composition** — `DashboardLayout` composes the header, sidebar, and scrollable page content. Feature pages currently provide the navigation destinations and initial interfaces.
3. **Configuration** — `src/config/firebase.ts` translates environment variables into a shared Firebase configuration and emulator settings.
4. **Data access** — browser interactions use the Firebase client SDK; trusted server operations use Firebase Admin. Keep credentials and privileged operations on the server.
5. **Contracts** — domain interfaces in `src/types` establish shared shapes for items, recipes, prices, users, and guilds.
6. **Persistence model** — the planned Firestore model includes items, recipes, item prices, price history, users, characters, guilds, and import logs. See [docs/DATABASE.md](docs/DATABASE.md).

The codebase uses strict TypeScript and the `@/*` alias for imports from `src/*`. Business logic should remain separate from page presentation as feature modules and services are introduced. The documented target architecture includes database, crafting, pricing, professions, guild, arbitrage, disenchant, and NPC domains; not all of those modules exist in the current foundation yet.

## Technology stack

- **Next.js 16** — App Router and server/client rendering
- **React 19** — UI components
- **TypeScript 5** — strict type checking
- **Tailwind CSS 4** with `@tailwindcss/turbopack` — styling and development bundling
- **Firebase 13** — browser Authentication and Firestore SDK
- **Firebase Admin 14** — trusted server-side Firebase access
- **ESLint 9** with `eslint-config-next` — code quality checks
- **Geist** — application font loaded through `next/font`

## Troubleshooting

### `Firebase configuration is missing`

Confirm that `.env.local` exists at the repository root, contains a non-placeholder `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, and that the development server was restarted after editing environment variables.

### `FIREBASE_ADMIN_SDK_KEY environment variable is not set`

Add the complete service-account JSON to `.env.local` for server-side features. In deployment, configure it as a secret rather than committing a JSON file. If the private key is supplied through a platform secret with escaped newlines, preserve the platform's required JSON encoding.

### Emulator connection errors

Make sure the Auth and Firestore emulators are running on the ports in `.env.local`. Verify that `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` is spelled exactly and restart Next.js after changing it. The client connects only in the browser.

### Port 3000 is already in use

Run Next.js on another port:

```bash
npm run dev -- --port 3001
```

Then open <http://localhost:3001>.

### Lint or build failures

Use a clean dependency install and run the checks again:

```bash
Remove-Item -Recurse -Force node_modules
npm ci
npm run lint
npm run build
```

On macOS/Linux, replace the PowerShell removal command with `rm -rf node_modules`. Check the first TypeScript or ESLint error; later messages may be cascading failures.

### Firestore permission denied

Check that the signed-in user and Firestore security rules allow the requested operation, that the app points to the intended Firebase project, and that emulator mode is not accidentally enabled. Admin SDK calls do not bypass a misconfigured project or invalid credentials.

## Security and contribution notes

- Never commit `.env.local`, private keys, or Firebase service-account JSON.
- Treat all `NEXT_PUBLIC_*` values as public.
- Validate imported data before writing it to Firestore; follow [docs/DATA_IMPORT.md](docs/DATA_IMPORT.md).
- Run `npm run lint` and `npm run build` before opening a change for review.
- Keep domain types and Firebase access boundaries explicit and update the documentation when the data model changes.
