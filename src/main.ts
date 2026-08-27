import { setFailed } from '@actions/core';
import { configure } from './configure';
import { download } from './download';

async function main(): Promise<void> {
  await download();
  configure();
}

main().catch((error: unknown) => setFailed(error instanceof Error ? error : String(error)));
