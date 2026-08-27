# Changelog

## [Version 3.0.0](https://github.com/matbour/setup-sentry-cli/releases/tag/v3.0.0)

**Breaking:** the action now runs on the `node24` runtime. It requires GitHub-hosted runners or a self-hosted
[actions/runner](https://github.com/actions/runner) >= 2.327.1. Node.js 20 actions are deprecated by GitHub and are
forced onto Node.js 24 since June 2nd, 2026.

- **feat**(github): upgrade runtime to `node24` (fixes [#23](https://github.com/matbour/setup-sentry-cli/issues/23))
- **feat**(arch): add support for Windows arm64 ([#24](https://github.com/matbour/setup-sentry-cli/pull/24)), thanks to @advait-m!
- **feat**(outputs): expose the installed executable path as the `sentry-cli-path` output
- **fix**(arch): 32-bit Linux and Windows mappings never matched (Node.js reports `ia32`, not `x32`)
- **fix**(secrets): mask the token before exporting `SENTRY_AUTH_TOKEN`
- **build**(\*): use [Bun](https://bun.sh) for dependency management, bundling and testing (replaces pnpm and tsup)
- **test**(\*): add unit tests for the download link resolution and the environment configuration
- **chore**(deps): upgrade `@actions/core` to v3 and `@actions/tool-cache` to v4, drop `@actions/io`
- **chore**(biome): upgrade Biome to v2
- **ci**(actions): refresh the runner matrix (Ubuntu 22.04/24.04 x64 and arm64, macOS 15 Intel, macOS 15/26 arm64, Windows 2022/2025, Windows 11 arm64), add a `dist/` freshness check and Dependabot

## [Version 2.0.0](https://github.com/mathieu-bour/setup-sentry-cli/releases/tag/v2.0.0)

- **feat**(github): upgrade runtime to `node20` and dependencies (fixes [#20](https://github.com/mathieu-bour/setup-sentry-cli/issues/20))

## [Version 1.3.0](https://github.com/mathieu-bour/setup-sentry-cli/releases/tag/1.3.0)

- **feat**(github): upgrade runtime to `node16` and dependencies (fixes [#15](https://github.com/mathieu-bour/setup-sentry-cli/issues/15))

## [Version 1.2.0](https://github.com/mathieu-bour/setup-sentry-cli/releases/tag/1.2.0)

- **feat**(arch): add support for ARM-based architectures (closes #11), thanks to @paresy for your support!

## [Version 1.1.0](https://github.com/mathieu-bour/setup-sentry-cli/releases/tag/1.1.0)

- **fix**(macos): make sentry-cli command available on macOS (fixes #4)
- **build**(\*): use esbuild instead of @zeit/ncc
- **ci**(actions): update the Sentry Integration Test
- **chore**(rebrand): the repository is now maintained by [mathieu-bour](https://github.com/mathieu-bour)

## [Version 1.0.0](https://github.com/mathieu-bour/setup-sentry-cli/releases/tag/1.0.0)

- **security**(deps): bump [@actions/core](https://github.com/actions/toolkit/tree/main/packages/core) from 1.2.4 to 1.2.6 (fixes [GHSA-mfwh-5m23-j46w](https://github.com/actions/toolkit/security/advisories/GHSA-mfwh-5m23-j46w))
- **fix**(ci): set setup-node version to @v1
