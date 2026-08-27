# matbour/setup-sentry-cli

![License][license]
![Stars][stars]
![Latest release][latest-release]
![Workflow status][workflow]

Install the Sentry CLI in your GitHub Actions workflow.

**This action is not supported by Sentry.**

Proudly maintained by [Mathieu Bour][@matbour], former Vice-CTO [@mathrix-education][@mathrix-education].

## Acknowledgements

This action was initially developed for [Education Media SA][@mathrix-education]. The repository is now maintained
by [@matbour][@matbour].

## Motivations

Installing Sentry CLI in GitHub Actions can be relevant in many cases. Mathrix Education SA is based on Angular, which
produces sourcemaps. Therefore, we need to upload sourcemaps, during our compilation workflow.

There is an [official guide to use sentry-cli on the Sentry's blog][2.1], but it requires to use a bunch of commands,
which is not really straight forward.

There are also some [Docker-based actions][2.2], but they are quite slow.

[2.1]: https://blog.sentry.io/2019/12/17/using-github-actions-to-create-sentry-releases
[2.2]: https://github.com/marketplace?type=actions&query=sentry

## Usage

### Requirements

Since v3, this action runs on the `node24` runtime. GitHub-hosted runners support it out of the box; self-hosted runners
need [actions/runner](https://github.com/actions/runner) 2.327.1 or newer. If you cannot upgrade your runners yet, stay
on `matbour/setup-sentry-cli@v2` (`node20`), which is no longer maintained.

### Supported operating systems

This action currently supports Ubuntu, Windows and Mac-OS based systems. The supported operating system matrix is the
following:

| Operating system | Status       |
| ---------------- | ------------ |
| `ubuntu-latest`  | ![supported] |
| `macos-latest`   | ![supported] |
| `windows-latest` | ![supported] |

This action also supports ARM-based systems (armv7 and arm64), thanks to @paresy and @advait-m.

| Platform | Architecture    | Status       |
| -------- | --------------- | ------------ |
| linux    | x32 (i686)      | ![supported] |
| linux    | x64 (x86_64)    | ![supported] |
| linux    | arm (armv7)     | ![supported] |
| linux    | arm64 (aarch64) | ![supported] |
| darwin   | x64 (x86_64)    | ![supported] |
| darwin   | arm64           | ![supported] |
| win32    | x32 (i686)      | ![supported] |
| win32    | x64 (x86_64)    | ![supported] |
| win32    | arm64 (aarch64) | ![supported] |

### Inputs

| Name           | Type                  | Default value |
| -------------- | --------------------- | ------------- |
| `version`      | `'latest'` / `string` | `'latest'`    |
| `token`        | `string`              | `''`          |
| `url`          | `string`              | `''`          |
| `organization` | `string`              | `''`          |
| `project`      | `string`              | `''`          |

See [action.yml](action.yml) for details.

### Outputs

| Name              | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `sentry-cli-path` | Absolute path to the installed sentry-cli executable |

#### `version`

If you need a precise version of the Sentry CLI, you may provide this input. We strongly advise you to do so since using
the latest version may break your workflow if Sentry releases a backward-incompatible version of the sentry-cli.

#### `url`

The Sentry server URL. By default, this action will configure the Sentry CLI to interact with official Sentry server
which is
`https://sentry.io`. If you use an on-premise instance, you may provide your server URL here.

#### `token`

This is the token which will be used by the Sentry CLI to authenticate against the Sentry server. Actually, this will
export the `SENTRY_AUTH_TOKEN` environment variable, so the sentry-cli already can log into the server.

##### Organization auth token (recommended)

Sentry recommends [organization auth tokens](https://docs.sentry.io/account/auth-tokens/#organization-auth-tokens) for
CI: they are tied to your organization rather than a user, and are scoped to exactly what is needed to upload source
maps and manage releases. Go to Organization Settings > Auth Tokens > Create New Token, then store it in a GitHub secret.

##### Personal token

You can also create a [user auth token](https://docs.sentry.io/account/auth-tokens/#user-auth-tokens) tied to your
account: Settings > Auth Tokens > Create New Token. Prefer organization tokens for anything shared or long-lived.

#### `organization`

Define the default organization; this will export the `SENTRY_ORG` environment variable.

#### `project`

Define the default project; this will export the `SENTRY_PROJECT` environment variable.

## Examples

### Minimal configuration

```yaml
- uses: matbour/setup-sentry-cli@v3
```

By default, this minimal example will install the latest version of the Sentry CLI, without any authentication.

### Typical CI configuration

```yaml
- name: Setup Sentry CLI
  uses: matbour/setup-sentry-cli@v3
  with:
    version: 2.46.0 # optional, defaults to 'latest'
    url: https://sentry.yourcompany.com # optional if you are using https://sentry.io
    token: ${{ secrets.SENTRY_TOKEN }} # from GitHub secrets
    organization: my-org
    project: my-project
```

In this example, you provide an authentication token. The action automatically download the latest version of the Sentry
CLI and authenticate using the provided token.

Then, the CLI is configured for the server `https://sentry.yourcompany.com` and the project `my-project` of the
organization `my-org`.

You are now ready to use the Sentry CLI commands such as `sentry-cli releases`!

### Using the output

```yaml
- name: Setup Sentry CLI
  id: sentry
  uses: matbour/setup-sentry-cli@v3
- run: echo "sentry-cli installed at ${{ steps.sentry.outputs.sentry-cli-path }}"
```

## Migrating from v2

- The runtime moved from `node20` to `node24`; make sure your self-hosted runners are up to date.
- Inputs are unchanged. A new `sentry-cli-path` output is available.
- Windows arm64 is now supported.

## Development

This repository uses [Bun](https://bun.sh):

```sh
bun install
bun test
bun run lint
bun run typecheck
bun run build # regenerates dist/, which is committed
```

[@matbour]: https://github.com/matbour
[@mathrix-education]: https://github.com/mathrix-education
[actions-secrets]: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets
[license]: https://img.shields.io/github/license/matbour/setup-sentry-cli?style=flat-square
[stars]: https://img.shields.io/github/stars/matbour/setup-sentry-cli?style=flat-square
[latest-release]: https://img.shields.io/github/v/release/matbour/setup-sentry-cli?label=latest%20release&style=flat-square
[workflow]: https://img.shields.io/github/actions/workflow/status/matbour/setup-sentry-cli/tests.yml?branch=main&style=flat-square
[supported]: https://img.shields.io/badge/status-supported-brightgreen?style=flat-square
