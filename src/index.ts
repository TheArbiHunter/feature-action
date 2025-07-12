import * as core from '@actions/core';
import * as github from '@actions/github';
import { IFeatureInputConfiguration } from './feature.configuration.interface';
import { getOutputConfiguration } from './feature.configuration.util';
import { setupCloudFlareDNS } from './feature.cloudflare.util';

(async () => {
  try {
    core.info('Starting Feature Action');

    const branch = github.context.ref.replace('refs/heads/', '');
    const input: IFeatureInputConfiguration[] = JSON.parse(core.getInput('CONFIGURATION'));
    const feature = input.find((feature) => feature.branches.includes(branch));
    const output = getOutputConfiguration(branch, feature);

    if (!output.isProduction) {
      await setupCloudFlareDNS(output);
    }

    core.info(`Running on branch: ${branch}`);
    core.info(`Output feature configuration: ${JSON.stringify(output.feature, null, 2)}`);

    core.setOutput('IS_PRODUCTION', output.isProduction);
    core.setOutput('FEATURE', output.feature);
    core.setOutput('NAMESPACE', output.namespace);

    core.setOutput('DOMAIN_BACKEND', output.domains.backend);
    core.setOutput('DOMAIN_FRONTEND', output.domains.frontend);
    core.setOutput('DOMAIN_PAYMENT', output.domains.payment);
    core.setOutput('DOMAIN_ADMIN', output.domains.admin);

    core.setOutput('DATABASE_NAME', output.database.name);
    core.setOutput('TELEGRAM', output.telegram);

    if (output.database.redis) {
      core.setOutput('DATABASE_REDIS_CACHE', output.database.redis.cache);
      core.setOutput('DATABASE_REDIS_ASSETS', output.database.redis.assets);
      core.setOutput('DATABASE_REDIS_BANNERS', output.database.redis.banners);
      core.setOutput('DATABASE_REDIS_NOTIFICATIONS', output.database.redis.notifications);
    }

    core.info('Finished running action');
  } catch (error: Error | unknown) {
    core.setFailed(`Error while running action: ${(error as Error).message}`);
  }
})();
