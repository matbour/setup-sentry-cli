import * as core from '@actions/core';
import { Config } from './config';
import { Download } from './download';

// Wrap the action calls
(async () => {
  try {
    await Download.download();
    Config.setupEnvironmentVariables();
  } catch (e) {
    core.setFailed(e);
  }
})();
