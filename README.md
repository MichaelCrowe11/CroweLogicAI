# Crowe Logic AI

This project is a Next.js application for managing mycology and ecological workflows. It uses Tailwind CSS and ShadCN UI components.

## Setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local` and fill in required values.
3. Start the development server:

```bash
pnpm dev
```

Additional scripts:

```bash
pnpm lint
pnpm build
```

### Production Build

Compile the app and start it in production mode:

```bash
pnpm build
pnpm start
```

## Bootstrap a New Project

You can scaffold a fresh Crowe Logic AI instance using the helper script. Pass a project name as an optional argument:

```bash
./scripts/setup.sh my-new-project
```

This script installs the core dependencies, initializes GitHub, and prepares the
basic folder structure with a local environment file.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for project milestones and future plans.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
