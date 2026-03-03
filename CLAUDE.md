# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

tag-changelog is a GitHub Action that generates changelogs from conventional commits between git tags. It parses commit messages, groups them by type, and outputs formatted changelog text. It runs on Node 20. Source is TypeScript with ESM imports, bundled to a single file via esbuild.

## Commands

- `pnpm test` — run Mocha tests (`test/*.spec.ts`)
- `pnpm check` — lint and auto-fix with ESLint + Prettier, then type-check with `tsc --noEmit`
- `pnpm package` — check then bundle `src/index.ts` → `dist/index.js` via esbuild
- `pnpm act` — package and test locally with `act` (GitHub Actions local runner)

Run a single test file: `pnpm mocha --require tsx test/parseCommitMessage.spec.ts`

## Architecture

All source is in `src/` (TypeScript), tests in `test/`, bundled output in `dist/`. Shared type definitions are in `src/types.ts`.

**`src/index.ts`** — Action entry point. Reads GitHub Action inputs (`token`, `exclude_types`, `include_commit_body`, `config_file`), fetches tags and commits via GitHub API, processes commits through the pipeline, and sets two outputs: `changelog` (with version header) and `changes` (without header).

**Processing pipeline:**

1. `parseCommitMessage.ts` — Parses conventional commit format using `@conventional-commits/parser`. Extracts type, scope, subject, body, breaking change notes, and PR number (`#123` pattern). Non-conventional commits fall back to type "other".
2. `groupByType.ts` — Groups parsed commits by type into an ordered array, sorted by the type order defined in config.
3. `generateChangelog.ts` — Filters excluded types, renders each type section and breaking change notes using config render functions, wraps with version header.
4. `translateType.ts` — Maps commit type strings (e.g., "feat") to human-readable labels (e.g., "New Features") using config.

**`src/defaultConfig.ts`** — Default configuration defining type groups/labels, render functions (`renderTypeSection`, `renderNotes`, `renderChangelog`), and options (`excludeTypes`, `includeCommitBody`). Users can provide a custom JS config file that gets merged via `Object.assign`.

## Key Details

- `dist/index.js` is the bundled artifact that GitHub Actions runs. It must be rebuilt (`pnpm package`) after any `src/` changes and committed.
- Code style: Prettier with 140 char print width, avoid arrow parens, ES5 trailing commas. ESLint with typescript-eslint enforces no-var, prefer-const, eqeqeq.
- Tests use Node's built-in `assert` with Mocha (via `tsx` loader) — no assertion library needed.
- Only `src/` modules (not `index.ts`) have test coverage; `index.ts` is integration-level (GitHub API calls).
