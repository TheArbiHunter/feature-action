import * as core from '@actions/core';
import * as github from '@actions/github';
import { IFeatureInputConfiguration } from './feature.configuration.interface';
import { getOutputConfiguration } from './feature.configuration.util';
import { setupCloudFlareDNS } from './feature.cloudflare.util';

(async () => {
  try {
    core.debug('Starting Feature Action');

    const branch = github.context.ref.replace('refs/heads/', '');
    const input: IFeatureInputConfiguration[] = JSON.parse(core.getInput('CONFIGURATION'));
    const feature = input.find((feature) => feature.branches.includes(branch));
    const output = getOutputConfiguration(branch, feature);

    if (!output.isProduction) {
      await setupCloudFlareDNS(output);
    }

    core.setOutput('IS_PRODUCTION', output.isProduction);
    core.setOutput('FEATURE', output.feature);
    core.setOutput('NAMESPACE', output.namespace);
    core.setOutput('BACKEND', output.domains.backend);
    core.setOutput('FRONTEND', output.domains.frontend);
    core.setOutput('PAYMENT', output.domains.payment);
    core.setOutput('ADMIN', output.domains.admin);
  } catch {
    core.setFailed('Error while running Feature Action');
  }
})();
