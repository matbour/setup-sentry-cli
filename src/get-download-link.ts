import { format } from 'node:util';

const URL_PREFIX = 'https://downloads.sentry-cdn.com/sentry-cli/%s/sentry-cli-%s';
const PLATFORM_MAPPINGS: Record<string, string> = {
  'linux-x32': 'Linux-i686',
  'linux-x64': 'Linux-x86_64',
  'linux-arm': 'Linux-armv7',
  'linux-arm64': 'Linux-aarch64',
  'darwin-x64': 'Darwin-x86_64',
  'darwin-arm64': 'Darwin-arm64',
  'win32-x32': 'Windows-i686',
  'win32-x64': 'Windows-x86_64',
};

/**
 * Generate the Sentry CLI download link.
 * @see https://sentry.io/get-cli/
 */
export function getDownloadLink(version: string) {
  let platform = PLATFORM_MAPPINGS[`${process.platform}-${process.arch}`];

  if (!platform && process.platform === 'darwin') {
    // Fallback to universal build if there is match on MacOS architecture
    platform = 'Darwin-universal';
  }

  if (!platform) {
    throw new TypeError(`Unsupported platform: ${process.platform}/${process.arch}`);
  }

  const link = format(URL_PREFIX, version, platform);

  return platform.startsWith('Windows') ? `${link}.exe` : link;
}
