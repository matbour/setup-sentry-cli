import { setFailed } from '@actions/core';
import configure from './configure';
import download from './download';

async function main() {
  await configure();
  await download();
}

main().catch(e => setFailed(e));
