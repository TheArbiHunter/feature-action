import * as core from '@actions/core';
import * as github from '@actions/github';
import { Cloudflare } from 'cloudflare';
import { featureGetDomain } from './utils/feature.get-domain.util';

export const featureStartAction = async () => {
  const branch = github.context?.ref?.replace('refs/heads/', '');
  const apiEmail = core.getInput('CLOUDFLARE_API_EMAIL', { required: true });
  const apiToken = core.getInput('CLOUDFLARE_API_TOKEN', { required: true });
  const zoneId = core.getInput('CLOUDFLARE_ZONE_ID', { required: true });
  const kubernetesAddress = core.getInput('KUBERNETES_ADDRESS', { required: true });
  const feature = featureGetDomain(branch);

  if (!feature) {
    core.setFailed('Feature not found.');
  }

  const cloudflare = new Cloudflare({ apiEmail, apiToken });
  const records = await cloudflare.dns.records.list({ zone_id: zoneId, type: 'A' });

  core.info(JSON.stringify(records, null, 2));

  const domains: Record<string, string> = {
    backend: `api.dev.${feature}`,
    frontend: `dev.${feature}`,
    payment: `payment.dev.${feature}`,
    admin: `admin.dev.${feature}`,
  };

  await Promise.all(
    Object.keys(domains).map(async (key) => {
      const domain: string = domains[key] as string;
      const record = records.result.find((record) => record.name === `${domain}.arbihunter.com`);

      if (!record) {
        core.info(
          `Creating record for ${domain}, ${JSON.stringify(
            {
              zone_id: zoneId,
              type: 'A',
              name: domain,
              content: kubernetesAddress,
              proxied: false,
            },
            null,
            2,
          )}`,
        );
        
        await cloudflare.dns.records.create({
          zone_id: zoneId,
          type: 'A',
          name: domain,
          content: kubernetesAddress,
          proxied: false,
        });
      } else {
        core.info(`Record for ${domain} already exists.`);
      }
    }),
  );
};
