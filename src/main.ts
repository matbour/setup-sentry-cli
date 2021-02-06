import { setFailed } from '@actions/core';
import configure from './configure';
import download from './download';

async function main() {
  configure();
  await download();
}

main().catch(e => setFailed(e));
