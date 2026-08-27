import { exportVariable, getInput, setSecret } from '@actions/core';

/**
 * Configure the SENTRY_* environment variables from the action inputs.
 */
export function configure(): void {
  const url = getInput('url');
  if (url !== '') {
    exportVariable('SENTRY_URL', url);
  }

  const token = getInput('token');
  if (token !== '') {
    setSecret(token);
    exportVariable('SENTRY_AUTH_TOKEN', token);
  }

  const organization = getInput('organization');
  if (organization !== '') {
    exportVariable('SENTRY_ORG', organization);
  }

  const project = getInput('project');
  if (project !== '') {
    exportVariable('SENTRY_PROJECT', project);
  }
}
