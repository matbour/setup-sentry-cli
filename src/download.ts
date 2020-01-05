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
      case 'win32':
        return `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Windows-x86_64.exe`;
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

    core.info(`Download path: ${downloadPath}`);

    const root = process.platform === 'win32' ? 'C:\\' : '/';
    const home = process.env.HOME ?? process.env.HOMEPATH ?? root;
    const binDir = resolve(home, 'tools', 'sentry-cli', 'bin');

    core.debug(`Home directory: ${home}`);
    core.debug(`Installation directory: ${binDir}`);

    // Create the installation directory if needed
    if (!existsSync(binDir)) {
      await io.mkdirP(binDir);
    }

    destinationPath = resolve(binDir, 'sentry-cli');

    // OS-depend operations
    switch (process.platform) {
      case 'linux':
      case 'darwin':
        await exec.exec('chmod', ['+x', downloadPath]);
        break;
      case 'win32':
        destinationPath += '.exe';
    }

    // Move to destination path
    await io.mv(downloadPath, destinationPath);

    core.info(`sentry-cli executable has been installed in ${destinationPath}`);
    core.addPath(binDir);
  }
}
