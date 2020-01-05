import * as core from '@actions/core';
import { Input } from './utils/input';

export class Config {
  /**
   * Setup the environment variables from the action inputs.
   * @link https://docs.sentry.io/cli/configuration/#configuration-values
   */
  static setupEnvironmentVariables(): void {
    // Set the Sentry URL
    Input.whenHas('url', url => {
      core.exportVariable('SENTRY_URL', url);
    });

    // Authenticate to the Sentry server
    Input.whenHas('token', token => {
      core.setSecret(token);
      core.exportVariable('SENTRY_AUTH_TOKEN', token);
    });

    // Set the default organization
    Input.whenHas('organization', organization => {
      core.exportVariable('SENTRY_ORG', organization);
    });

    // Set the default project
    Input.whenHas('project', project => {
      core.exportVariable('SENTRY_PROJECT', project);
    });
  }
}
