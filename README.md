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

### Supported operating systems

This action currently supports Ubuntu, Windows and Mac-OS based systems. The supported operating system matrix is the
following:

| Operating system | Status       |
| ---------------- | ------------ |
| `ubuntu-latest`  | ![supported] |
| `macos-latest`   | ![supported] |
| `windows-latest` | ![supported] |

This action also support ARM-based systems (armv7 and arm64), thanks to @paresy support.

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

### Inputs

| Name           | Type                  | Default value |
| -------------- | --------------------- | ------------- |
| `version`      | `'latest'` / `string` | `'latest'`    |
| `token`        | `string`              | `''`          |
| `url`          | `string`              | `''`          |
| `organization` | `string`              | `''`          |
| `project`      | `string`              | `''`          |

See [action.yml](action.yml) for details.

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

##### Organization Internal Integration (recommended)

This will generate a token that is tied to your organization. Go to Organization Settings > Developer Settings > + New
Internal Integration. Fill the `Name` with a name of your choice (for example `GitHub Actions`); you will get a token
that you can use a Sentry token.

If you plan to use this action to deploy releases, set the following permissions:

| Name          | Access    |
| ------------- | --------- |
| Project       | No Access |
| Release       | Admin     |
| Issue & Event | No Access |
| Organization  | Read      |
| Member        | No Access |

##### Personal token

You can also create personal access token that are tied to your account and use them to impersonate your account. Simply
go to Settings > API Keys > Create Next Token.

#### `organization`

Define the default organization; this will export the `SENTRY_ORG` environment variable.

#### `project`

Define the default project; this will export the `SENTRY_PROJECT` environment variable.

## Examples

### Minimal configuration

```yaml
- uses: matbour/setup-sentry-cli@v2 # WARNING: see the latest stable version instead!
```

By default, this minimal example will install the latest version of the Sentry CLI, without any authentication.

### Typical CI configuration

```yaml
- name: Setup Sentry CLI
  uses: matbour/setup-sentry-cli@v1
  with:
    version: latest # optional if 'latest'
    url: https://sentry.yourcompany.com # optional if you are using https://sentry.io
    token: ${{ SECRETS.SENTRY_TOKEN }} # from GitHub secrets
    organization: my-org
    project: my-project
```

In this example, you provide an authentication token. The action automatically download the latest version of the Sentry
CLI and authenticate using the provided token.

Then, the CLI is configured for the server `https://sentry.yourcompany.com` and the project `my-project` of the
organization `my-org`.

You are now ready to use the Sentry CLI commands such as `sentry-cli releases`!

[@matbour]: https://github.com/matbour
[@mathrix-education]: https://github.com/mathrix-education
[actions-secrets]: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets
[license]: https://img.shields.io/github/license/matbour/setup-sentry-cli?style=flat-square
[stars]: https://img.shields.io/github/stars/matbour/setup-sentry-cli?style=flat-square
[latest-release]: https://img.shields.io/github/v/release/matbour/setup-sentry-cli?label=latest%20release&style=flat-square
[workflow]: https://img.shields.io/github/workflow/status/matbour/setup-sentry-cli/Tests?style=flat-square
[supported]: https://img.shields.io/badge/status-supported-brightgreen?style=flat-square
