import { Cloudflare } from 'cloudflare';
import * as core from '@actions/core';
import { IFeatureOutputConfiguration } from './feature.configuration.interface';

export const setupCloudFlareDNS = async (
  configuration: IFeatureOutputConfiguration,
): Promise<void> => {
  const apiEmail: string = core.getInput('CLOUDFLARE_API_EMAIL', { required: true });
  const apiToken: string = core.getInput('CLOUDFLARE_API_TOKEN', { required: true });
  const zoneId: string = core.getInput('CLOUDFLARE_ZONE_ID', { required: true });
  const domain: string = core.getInput('CLOUDFLARE_DOMAIN');
  const kubernetesAddress: string = core.getInput('KUBERNETES_ADDRESS', { required: true });

  const cloudflare: Cloudflare = new Cloudflare({ apiEmail, apiToken });
  const records = await cloudflare.dns.records.list({ zone_id: zoneId, type: 'A' });

  const setup = async (name: string): Promise<void> => {
    const record = records.result.find((record) => record.name === name);
    const comment: string = `${configuration.isProduction ? 'Production' : 'Development'} DNS record for K8S namespace: ${configuration.namespace}.`;
    const address: string = name.substring(0, name.length - domain.length);

    core.debug(`Mapped address: ${address}`);

    if (!record) {
      core.info(`Creating record for: ${address}.${domain}.`);

      await cloudflare.dns.records.create({
        zone_id: zoneId,
        type: 'A',
        name: address,
        content: kubernetesAddress,
        proxied: false,
        comment,
      });
    } else {
      core.info(`Record for ${address}.${domain} already exists, just updating..`);

      await cloudflare.dns.records.update(record.id, {
        zone_id: zoneId,
        type: 'A',
        name: address,
        content: kubernetesAddress,
        proxied: false,
        comment,
      });
    }
  };

  await setup(configuration.domains.backend);
  await setup(configuration.domains.frontend);
  await setup(configuration.domains.admin);
  await setup(configuration.domains.payment);
};
