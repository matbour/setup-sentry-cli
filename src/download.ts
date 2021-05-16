import { chmodSync, copyFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { addPath, debug, getInput, info } from '@actions/core';
import { mkdirP } from '@actions/io';
import { downloadTool } from '@actions/tool-cache';
import { getDownloadLink } from './get-download-link';

/**
 * Download the Sentry CLI executable.
 * @returns {Promise<void>}
 */
export async function download(): Promise<void> {
  const version = getInput('version');
  info(`Installing sentry-cli version ${version}`);

  debug(`Detected platform: ${process.platform}`);
  debug(`Detected architecture: ${process.arch}`);

  const downloadLink = getDownloadLink(version);
  debug(`Downloading from: ${downloadLink}`);
  const downloadPath = await downloadTool(downloadLink);
  debug(`Download path: ${downloadPath}`);

  // Create the installation directory if needed
  const cliDir = join(homedir(), 'sentry-cli');
  const cli = resolve(cliDir, 'sentry-cli') + (process.platform === 'win32' ? '.exe' : '');
  debug(`Installation directory: ${cliDir}`);

  if (!existsSync(cliDir)) {
    await mkdirP(cliDir);
  }

  copyFileSync(downloadPath, cli);

  // On *nix, add the execute permission
  if (process.platform === 'linux' || process.platform === 'darwin') {
    chmodSync(cli, 0o755);
  }

  addPath(cliDir);
  info(`sentry-cli executable has been installed in ${cli}`);
}
