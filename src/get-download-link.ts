const URL_PREFIX = 'https://downloads.sentry-cdn.com/sentry-cli';

export const PLATFORM_MAPPINGS: Record<string, string> = {
  'linux-ia32': 'Linux-i686',
  'linux-x64': 'Linux-x86_64',
  'linux-arm': 'Linux-armv7',
  'linux-arm64': 'Linux-aarch64',
  'darwin-x64': 'Darwin-x86_64',
  'darwin-arm64': 'Darwin-arm64',
  'win32-ia32': 'Windows-i686',
  'win32-x64': 'Windows-x86_64',
  'win32-arm64': 'Windows-aarch64',
};

/**
 * Generate the Sentry CLI download link.
 * @see https://sentry.io/get-cli/
 */
export function getDownloadLink(
  version: string,
  platform: NodeJS.Platform = process.platform,
  arch: NodeJS.Architecture = process.arch,
): string {
  let target = PLATFORM_MAPPINGS[`${platform}-${arch}`];

  if (!target && platform === 'darwin') {
    // Fallback to the universal build if there is no match on macOS architecture
    target = 'Darwin-universal';
  }

  if (!target) {
    throw new TypeError(`Unsupported platform: ${platform}/${arch}`);
  }

  const link = `${URL_PREFIX}/${version}/sentry-cli-${target}`;

  return target.startsWith('Windows') ? `${link}.exe` : link;
}
