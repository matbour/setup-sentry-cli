import { exportVariable, getInput, setSecret } from '@actions/core';

export default (): void => {
  // Set the Sentry URL
  const url = getInput('url');
  if (url !== '') {
    exportVariable('SENTRY_URL', url);
  }

  const token = getInput('token');
  if (token !== '') {
    exportVariable('SENTRY_AUTH_TOKEN', getInput('token'));
    setSecret(token);
  }

  // Set the default organization
  const organization = getInput('organization');
  if (organization !== '') {
    exportVariable('SENTRY_ORG', organization);
  }

  // Set the default project
  const project = getInput('project');
  if (project !== '') {
    exportVariable('SENTRY_PROJECT', project);
  }
};
