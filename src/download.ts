import { addPath, info } from '@actions/core';
import { exec } from '@actions/exec';
import { mkdirP } from '@actions/io';
import { downloadTool } from '@actions/tool-cache';
import { copyFileSync, existsSync, unlinkSync } from 'fs';
import { join, resolve } from 'path';
import inferInput from './utils/inferInput';

export default async (): Promise<void> => {
  const version = inferInput<string>('version', 'latest');
  info(`Detected platform: ${process.platform}`);
  info(`Downloading sentry-cli version ${version}`);
  let downloadLink: string;
  let binDir: string;

  switch (process.platform) {
    case 'linux':
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Linux-x86_64`;
      binDir = join('usr', 'local', 'bin');
      break;
    case 'darwin':
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Darwin-x86_64`;
      binDir = join('usr', 'local', 'bin');
      break;
    case 'win32':
      downloadLink = `https://downloads.sentry-cdn.com/sentry-cli/${version}/sentry-cli-Windows-x86_64.exe`;
      binDir = join('C:\\', 'Program Files', 'sentry-cli');
      break;
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }

  const destinationPath = resolve(binDir, 'sentry-cli') + (process.platform === 'win32' ? '.exex' : '');
  info(`Installation directory: ${binDir}`);

  const downloadPath = await downloadTool(downloadLink, binDir);
  info(`Download path: ${downloadPath}`);

  // Create the installation directory if needed
  if (!existsSync(binDir)) {
    await mkdirP(binDir);
  }

  // OS-depend operations
  switch (process.platform) {
    case 'linux':
    case 'darwin':
      await exec('chmod', ['+x', downloadPath]);
      break;
  }

  // Move to destination path
  copyFileSync(downloadPath, destinationPath);
  unlinkSync(downloadPath);
  addPath(binDir);

  info(`sentry-cli executable has been installed in ${destinationPath}`);
};
