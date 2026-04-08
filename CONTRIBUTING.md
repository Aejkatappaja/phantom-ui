# Contributing to phantom-ui

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/Aejkatappaja/phantom-ui.git
cd phantom-ui
bun install
```

## Development

```bash
bun run storybook       # dev server on :6006
bun run build           # tsc + custom elements manifest + CDN bundle
bun run lint            # biome check
bun run lint:fix        # biome auto-fix
bun run test            # browser tests (Chromium)
bun run test:all        # browser tests (Chromium + Firefox + WebKit)
```

The component source lives in `src/`. The docs site (Astro/Starlight) lives in `docs/`.

## Testing in the browser

After building (`bun run build`), run `bun run playground` to start a local server, then open `http://localhost:3000/playground/`. It has interactive controls for every attribute so you can test changes visually.

For docs changes:

```bash
cd docs
bun install
bun run dev
```

## Making changes

1. Fork the repo and create a branch from `main`
2. Run `bun run lint` and `bun run build` to verify everything passes
3. Run `bun run test` to make sure all browser tests pass
4. If you changed attributes or public API, update `docs/src/content/docs/reference/attributes.md` and the attributes table in `README.md`
5. Run `cem analyze` to regenerate `custom-elements.json` if you added/changed properties
6. Open a PR against `main`

## Commit messages

We use [conventional commits](https://www.conventionalcommits.org/):

- `feat:` new feature or attribute
- `fix:` bug fix
- `docs:` documentation only
- `chore:` build, tooling, version bumps

## Code style

- Formatting and linting are handled by [Biome](https://biomejs.dev/)
- A pre-commit hook runs `lint-staged` automatically
- No need to run anything manually, just commit and the hook handles it

## What makes a good PR

- One feature or fix per PR
- Update docs if the public API changes
- Keep the scope small and focused

## Reporting bugs

Open an issue with:
- What you expected
- What happened instead
- Browser and framework (if relevant)
- A minimal reproduction (CodePen, StackBlitz, or HTML snippet)
