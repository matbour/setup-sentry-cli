import { exportVariable, setSecret } from '@actions/core';
import ifInput from './utils/ifInput';

export default () => {
  // Set the Sentry URL
  ifInput('url', url => exportVariable('SENTRY_URL', url));

  // Authenticate to the Sentry server
  ifInput('token', token => {
    setSecret(token);
    exportVariable('SENTRY_AUTH_TOKEN', token);
  });

  // Set the default organization
  ifInput('organization', organization => exportVariable('SENTRY_ORG', organization));

  // Set the default project
  ifInput('project', project => exportVariable('SENTRY_PROJECT', project));
};
