import { describe, expect, test } from 'bun:test';
import { getDownloadLink, PLATFORM_MAPPINGS } from './get-download-link';

const BASE = 'https://downloads.sentry-cdn.com/sentry-cli';

describe('getDownloadLink', () => {
  test.each([
    ['linux', 'ia32', `${BASE}/latest/sentry-cli-Linux-i686`],
    ['linux', 'x64', `${BASE}/latest/sentry-cli-Linux-x86_64`],
    ['linux', 'arm', `${BASE}/latest/sentry-cli-Linux-armv7`],
    ['linux', 'arm64', `${BASE}/latest/sentry-cli-Linux-aarch64`],
    ['darwin', 'x64', `${BASE}/latest/sentry-cli-Darwin-x86_64`],
    ['darwin', 'arm64', `${BASE}/latest/sentry-cli-Darwin-arm64`],
    ['win32', 'ia32', `${BASE}/latest/sentry-cli-Windows-i686.exe`],
    ['win32', 'x64', `${BASE}/latest/sentry-cli-Windows-x86_64.exe`],
    ['win32', 'arm64', `${BASE}/latest/sentry-cli-Windows-aarch64.exe`],
  ] as const)('%s/%s', (platform, arch, expected) => {
    expect(getDownloadLink('latest', platform, arch)).toBe(expected);
  });

  test('uses the requested version', () => {
    expect(getDownloadLink('2.46.0', 'linux', 'x64')).toBe(`${BASE}/2.46.0/sentry-cli-Linux-x86_64`);
  });

  test('falls back to the universal build on unknown macOS architectures', () => {
    expect(getDownloadLink('latest', 'darwin', 'ppc64')).toBe(`${BASE}/latest/sentry-cli-Darwin-universal`);
  });

  test('throws on unsupported platforms', () => {
    expect(() => getDownloadLink('latest', 'freebsd', 'x64')).toThrow(TypeError);
    expect(() => getDownloadLink('latest', 'linux', 's390x')).toThrow('Unsupported platform: linux/s390x');
  });

  test('every mapping key uses a real Node.js arch value', () => {
    const archs: string[] = ['ia32', 'x64', 'arm', 'arm64'];
    for (const key of Object.keys(PLATFORM_MAPPINGS)) {
      expect(archs).toContain(key.split('-')[1]);
    }
  });
});
