import { addPath, debug, getInput, info } from '@actions/core';
import { mkdirP } from '@actions/io';
import { downloadTool } from '@actions/tool-cache';
import { chmodSync, copyFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';

export default async (): Promise<void> => {
  const version = getInput('version');
  const cliDir = join(homedir(), 'sentry-cli');

  debug(`Detected platform: ${process.platform}`);
  info(`Installing sentry-cli version ${version}`);

  let downloadLink: string;

  if (process.platform === 'linux') {
    if (process.arch.startsWith('arm')) {
      // Support for armv7 platforms
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Linux-armv7`;
    } else {
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Linux-x86_64`;
    }
  } else if (process.platform === 'darwin') {
    if (process.arch.startsWith('arm')) {
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Darwin-arm64`;
    } else if (process.arch.match(/x\d{2}/)) {
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Darwin-x86_64`;
    } else {
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Darwin-universal`;
    }
  } else if (process.platform === 'win32') {
    downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Windows-x86_64.exe`;
  } else {
    throw new Error(`Unsupported platform: ${process.platform} - ${process.arch}`);
  }

  const cli = resolve(cliDir, 'sentry-cli') + (process.platform === 'win32' ? '.exe' : '');
  debug(`Installation directory: ${cliDir}`);

  debug(`Downloading from: ${downloadLink}`);
  const downloadPath = await downloadTool(downloadLink);
  debug(`Download path: ${downloadPath}`);

  // Create the installation directory if needed
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
};
