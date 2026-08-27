import { chmod, copyFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { addPath, debug, getInput, info, setOutput } from '@actions/core';
import { downloadTool } from '@actions/tool-cache';
import { getDownloadLink } from './get-download-link';

/**
 * Download the Sentry CLI executable and add it to the PATH.
 * @returns The absolute path to the sentry-cli executable.
 */
export async function download(): Promise<string> {
  const version = getInput('version') || 'latest';
  info(`Installing sentry-cli version ${version}`);

  debug(`Detected platform: ${process.platform}`);
  debug(`Detected architecture: ${process.arch}`);

  const downloadLink = getDownloadLink(version);
  debug(`Downloading from: ${downloadLink}`);
  const downloadPath = await downloadTool(downloadLink);
  debug(`Download path: ${downloadPath}`);

  const cliDir = join(homedir(), 'sentry-cli');
  const cli = resolve(cliDir, 'sentry-cli') + (process.platform === 'win32' ? '.exe' : '');
  debug(`Installation directory: ${cliDir}`);

  await mkdir(cliDir, { recursive: true });
  await copyFile(downloadPath, cli);

  // On *nix, add the execute permission
  if (process.platform !== 'win32') {
    await chmod(cli, 0o755);
  }

  addPath(cliDir);
  setOutput('sentry-cli-path', cli);
  info(`sentry-cli executable has been installed in ${cli}`);

  return cli;
}
