import 'source-map-support/register';
import { setFailed } from '@actions/core';
import { configure } from './configure';
import { download } from './download';

async function main() {
  await download();
  configure();
}

main().catch((e) => setFailed(e));
