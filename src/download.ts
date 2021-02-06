import { addPath, debug, info } from '@actions/core';
import { exec } from '@actions/exec';
import { mkdirP } from '@actions/io';
import { downloadTool } from '@actions/tool-cache';
import { copyFileSync, existsSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import inferInput from './utils/inferInput';

export default async (): Promise<void> => {
  const version = inferInput('version', 'latest');
  info(`Detected platform: ${process.platform}`);
  info(`Downloading sentry-cli version ${version}`);
  let downloadLink: string;

  switch (process.platform) {
    case 'linux':
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Linux-x86_64`;
      break;
    case 'darwin':
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Darwin-x86_64`;
      break;
    case 'win32':
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Windows-x86_64.exe`;
      break;
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }

  const downloadPath = await downloadTool(downloadLink);
  let destinationPath;

  info(`Download path: ${downloadPath}`);

  const root = process.platform === 'win32' ? 'C:\\' : '/';
  const home = process.env.HOME ?? process.env.HOMEPATH ?? root;
  const binDir = resolve(home, 'tools', 'sentry-cli', 'bin');

  debug(`Home directory: ${home}`);
  debug(`Installation directory: ${binDir}`);

  // Create the installation directory if needed
  if (!existsSync(binDir)) {
    await mkdirP(binDir);
  }

  destinationPath = resolve(binDir, 'sentry-cli');

  // OS-depend operations
  switch (process.platform) {
    case 'linux':
    case 'darwin':
      await exec('chmod', ['+x', downloadPath]);
      break;
    case 'win32':
      destinationPath += '.exe';
  }

  // Move to destination path
  copyFileSync(downloadPath, destinationPath);
  unlinkSync(downloadPath);

  info(`sentry-cli executable has been installed in ${destinationPath}`);
  addPath(binDir);
};
