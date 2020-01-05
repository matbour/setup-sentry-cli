# mathrix-education/setup-sentry-cli
Install the Sentry CLI in your GitHub Actions workflow.

**This action is not supported by Sentry.**

Proudly maintained by [Mathieu Bour][1.1], Vice-CTO
[@mathrix-education][1.2].

[1.1]: https://github.com/mathieu-bour
[1.2]: https://github.com/mathrix-education

## Motivations
Installing Sentry CLI in GitHub Actions can be relevant in many cases.
Mathrix Education SA is based on Angular, which produces sourcemaps.
Therefore, we need to upload sourcemaps, during our compilation
workflow.

There is an
[official guide to use sentry-cli on the Sentry's blog][2.1],
but it requires to use a bunch of commands, which is not really
straight forward.

There are also some [Docker-based actions][2.2], but they are quite
slow.

[2.1]: https://blog.sentry.io/2019/12/17/using-github-actions-to-create-sentry-releases
[2.2]: https://github.com/marketplace?type=actions&query=sentry


## Usage
### Supported operating systems
This action currently supports Ubuntu, Windows and Mac-OS based systems.
The supported operating systems matrix is the following:

| Operating system | Status |
|------------------|-------|
| `ubuntu-latest`  | ![3.1] |
| `macos-latest`   | ![3.1] |
| `windows-latest` | ![3.1] |

[3.1]: https://img.shields.io/badge/status-supported-brightgreen

### Inputs
| Name           | Type                  | Default value |
|----------------|-----------------------|---------------|
| `version`      | `'latest'` / `string` | `'latest'`    |
| `token`        | `string`              | `''`          |
| `url`          | `string`              | `''`          |
| `organization` | `string`              | `''`          |
| `project`      | `string`              | `''`          |

See [action.yml](action.yml) for details.

#### `version`
If you need a precise version of the Sentry CLI, you may provide this
input. We strongly advise you to do so since using the latest version
may break your workflow if Sentry releases a backward-incompatible
version.

#### `url`
The Sentry server URL. By default, this action will configure the
Sentry CLI to interact with official Sentry server which is
`https://sentry.io`. If you use an on-premise instance, you may provide
your server URL here.

#### `token`
This is the token which will be used by the Sentry CLI to authenticate
against the Sentry server.
You may generate it on your personal account page.

#### `organization`
Define the default organization.

#### `project`
Define the default project.

## Examples
### Minimal configuration
```yaml
- uses: mathrix-education/setup-sentry-cli@master
```
By default, this minimal example will install the latest version of the
Sentry CLI, without any authentication.

### Typical CI configuration
```yaml
- name: Setup Sentry CLI
  uses: mathrix-education/setup-sentry-cli@0.1.0
  with:
    version: latest # optional if 'latest'
    url: https://sentry.yourcompany.com
    auth: ${{ SECRETS.SENTRY_TOKEN }} # from GitHub secrets
    organization: my-org
    project: my-project
```
In this example, you provide a authentication token. The action
automatically download the latest version of the Sentry CLI and
authenticate using the provided token.

Then, the CLI is configured for the server
`https://sentry.yourcompany.com` and the project `my-project` of the
organization `my-org`.

You are now ready to use the Sentry CLI commands such as
`sentry-cli releases`!
