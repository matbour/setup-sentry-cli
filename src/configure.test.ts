import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { configure } from './configure';

const INPUTS = ['url', 'token', 'organization', 'project'] as const;

function setInput(name: string, value: string): void {
  process.env[`INPUT_${name.toUpperCase()}`] = value;
}

describe('configure', () => {
  const env = { ...process.env };
  let stdout: string[] = [];
  let originalWrite: typeof process.stdout.write;

  beforeEach(() => {
    stdout = [];
    originalWrite = process.stdout.write;
    process.stdout.write = ((chunk: string | Uint8Array) => {
      stdout.push(chunk.toString());
      return true;
    }) as typeof process.stdout.write;
    // Force @actions/core onto the legacy stdout command path so we can capture it
    delete process.env['GITHUB_ENV'];
    for (const input of INPUTS) {
      delete process.env[`INPUT_${input.toUpperCase()}`];
    }
  });

  afterEach(() => {
    process.stdout.write = originalWrite;
    process.env = { ...env };
  });

  test('does nothing when inputs are empty', () => {
    configure();
    expect(stdout.join('')).toBe('');
  });

  test('exports every SENTRY_* variable and masks the token', () => {
    setInput('url', 'https://sentry.example.com');
    setInput('token', 'sntrys_secret');
    setInput('organization', 'my-org');
    setInput('project', 'my-project');

    configure();
    const output = stdout.join('');

    expect(output).toContain('::set-env name=SENTRY_URL::https://sentry.example.com');
    expect(output).toContain('::add-mask::sntrys_secret');
    expect(output).toContain('::set-env name=SENTRY_AUTH_TOKEN::sntrys_secret');
    expect(output).toContain('::set-env name=SENTRY_ORG::my-org');
    expect(output).toContain('::set-env name=SENTRY_PROJECT::my-project');
    expect(output.indexOf('::add-mask::')).toBeLessThan(output.indexOf('SENTRY_AUTH_TOKEN'));
    expect(process.env['SENTRY_AUTH_TOKEN']).toBe('sntrys_secret');
  });

  test('only exports the provided inputs', () => {
    setInput('organization', 'my-org');
    configure();
    const output = stdout.join('');
    expect(output).toContain('SENTRY_ORG');
    expect(output).not.toContain('SENTRY_URL');
    expect(output).not.toContain('SENTRY_AUTH_TOKEN');
  });
});
