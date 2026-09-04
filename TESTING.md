# Testing

Tests make rapid product work safe: behavior is captured before later changes can quietly break it.

## Commands

- `npm test` runs Vitest unit and component tests once.
- `npm run test:watch` runs Vitest while developing.
- `npm run test:e2e` runs Playwright against a local Next.js server.
- `npm run lint`, `npm run typecheck`, and `npm run build` are required verification checks.

Unit and component tests live in `tests/`; browser journeys live in `e2e/`. Tests should assert user-visible behavior and important boundaries. New conditionals need both paths tested, and bug fixes should receive regression coverage.
