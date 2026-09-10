# Vue Markdown Kit Agent Guide

This repository is the Vue 2 edition of the Markdown preview package. Read
this file before changing or releasing the package.

## Technical baseline

- Package name: `vue-markdown-kit`
- Vue peer range: Vue 2.6 and 2.7
- Keep the component implementation compatible with the Vue 2 Options API.
- Do not introduce Vue 3-only APIs into this repository.
- `lib/` is committed because consumers may install directly from GitHub.

## Required validation

Run the full package check before committing a release:

```sh
npm run check
```

This builds ESM and CommonJS bundles, runs runtime and compatibility tests,
checks TypeScript declarations, and validates the npm package contents. Also
run `npm audit --omit=dev`; Vue 2 itself is EOL and may still appear in a full
development-dependency audit.

After building, commit the generated changes under `lib/`. CI verifies that a
fresh build does not change the committed distribution.

## Version synchronization

Every release version must match in all three locations:

- `package.json`
- `package-lock.json`
- `src/version.js`

Do not rely on `npm version` alone because it does not update
`src/version.js`. Confirm both the package metadata and
`VMdPreview.version` before release.

## Release process

GitHub pushes alone do not publish npm packages. npm Trusted Publishing is
configured for this repository and `.github/workflows/publish.yml`.

1. Update the three version locations and `CHANGELOG.md`.
2. Run `npm run check` and `npm audit --omit=dev`.
3. Commit the source and generated `lib/` files.
4. Create and push an annotated `vX.Y.Z` tag.
5. Publish a GitHub Release for that tag.
6. Confirm the `Publish Package` workflow succeeds and verify npm `latest`.

The workflow requires the Release tag to equal `v` plus the version in
`package.json`, skips a version already present on npm, and publishes through
OIDC. Do not add an npm write token or run a second manual `npm publish` after
the workflow succeeds.

Trusted Publisher configuration (external npm setting, last verified
2026-09-10): GitHub user `eatmeatHJ`, repository `vue-markdown-kit`, workflow
filename `publish.yml`, no environment, direct `npm publish` allowed.
