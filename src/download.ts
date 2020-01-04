import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { renameSync } from 'fs';
import { Input } from './utils/input';

export class Download {
  /**
   * Get the sentry-cli download URL, based on the current platform and input version.
   */
  private static getSentryLink(): string {
    const version = Input.get('version', 'latest');
    core.info(`Detected platform: ${process.platform}`);
    core.info(`Downloading sentry-cli version ${version}`);

    switch (process.platform) {
      case 'linux':
        return `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Linux-x86_64`;
      case 'darwin':
        return `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Darwin-x86_64`;
      // case 'win32':
      //   return `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Windows-x86_64.exe`;
      default:
        throw new Error(`Unsupported platform: ${process.platform}`);
    }
  }

  /**
   * Download the sentry-cli and move it the to standard binaries directory.
   */
  static async download(): Promise<void> {
    const downloadPath = await tc.downloadTool(Download.getSentryLink());
    let destinationPath;

    core.debug(`Download path: ${downloadPath}`);

    switch (process.platform) {
      case 'linux':
      case 'darwin':
        destinationPath = '/usr/local/bin/sentry-cli';
        break;
      default:
        throw new Error(`Unsupported platform: ${process.platform}`);
    }

    core.debug(`Destination path: ${destinationPath}`);

    renameSync(downloadPath, destinationPath);
  }
}
