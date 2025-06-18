#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define project name and GitHub username
# Pass a project name as the first argument, or use the default.
PROJECT_NAME="${1:-crowe-logic-ai}"
# Optionally set GITHUB_USER environment variable to override the GitHub username.
GITHUB_USER="${GITHUB_USER:-MichaelCrowe11}"

echo "🚀 Creating Crowe Logic AI app: $PROJECT_NAME"

# Scaffold Next.js + Tailwind + TypeScript
npx create-next-app@latest $PROJECT_NAME --typescript --tailwind --eslint --app --src-dir

cd $PROJECT_NAME

# Add ShadCN UI
pnpm add @shadcn/ui clsx tailwind-variants
npx shadcn-ui@latest init

# Install core dependencies
pnpm add openai langchain @supabase/supabase-js react-markdown framer-motion zod react-hook-form

# Optional: Add Pinecone and Whisper support later
pnpm add @pinecone-database/pinecone whisper-openai

# Initialize Git and GitHub
git init
gh repo create $GITHUB_USER/$PROJECT_NAME --public --source=. --remote=origin --push

# Create folders
mkdir -p src/components/ui src/lib/gpt src/schemas src/modules

# Add environment config
cat <<EOT > .env.local
OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
EOT

echo "✅ Project setup complete. Launch with: cd $PROJECT_NAME && pnpm dev"
