import { Download } from './download';
import { Config } from './config';

(async () => {
  await Download.download();

  Config.setupEnvironmentVariables();
})();
