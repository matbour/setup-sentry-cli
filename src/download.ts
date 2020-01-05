import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import { existsSync } from 'fs';
import { resolve } from 'path';
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

    const home = process.env.HOME ?? '/';
    const binDir = resolve(home, 'tools', 'sentry-cli', 'bin');

    if (!existsSync(binDir)) {
      await io.mkdirP(binDir);
    }

    switch (process.platform) {
      case 'linux':
      case 'darwin':
        destinationPath = resolve(binDir, 'sentry-cli');
        await exec.exec('chmod', ['+x', downloadPath]);
        break;
      default:
        throw new Error(`Unsupported platform: ${process.platform}`);
    }

    await io.mv(downloadPath, destinationPath);

    core.info(`sentry-cli executable has bin installed in ${destinationPath}`);
    core.addPath(binDir);
  }
}
