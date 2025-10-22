## Tinycardo — Simple flashcards for language learning

Tinycardo is a lightweight flashcard app inspired by Tinycards by Duolingo. Create decks, study with quick sessions, and practice vocabulary with a clean, focused UI.

### Core features

- **Decks**: create and manage decks with term/definition cards
- **Study sessions**: run a session for a deck and track progress
- **Scheduling basics**: due date logic to resurface cards for review

### Tech stack

- **React 19 + TypeScript** (Vite)
- **Redux Toolkit** for state management
- **React Router v7** for routing
- **Tailwind CSS v4** for styling
- **DaisyUI** for UI
- **Storybook** for isolated UI development
- **Vitest** for testing

### Getting started

Requirements: Node 20+ and yarn (or npm/pnpm).

```bash
yarn install
yarn start
```

Other scripts:

```bash
# Build for production
yarn build

# Lint and type-check
yarn lint
yarn type-check

# Tests
yarn test
yarn test:watch

yarn storybook

# i18n helper (translate message catalogs)
yarn i18n
```

### Internationalization

Message catalogs live in `src/i18n/messages/`. If you need to add more records, please, only update `en.json` file and then, run `yarn i18n`. This script will call Open AI, update, add, or delete records, based on `en.json`file automatically.

### Persistence

Local-first via storage abstractions (LocalStorage/IndexedDB). Repositories are swappable to support future backends without changing UI code.

### Contributing

PRs and suggestions are welcome. A CI/CD is setup, it will help you follow conventions, typing and linting.
