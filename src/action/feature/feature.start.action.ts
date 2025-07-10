import * as core from '@actions/core';
import * as github from '@actions/github';
import { Cloudflare } from 'cloudflare';
import features from './features.json';

export const featureStartAction = async () => {
  const branch = github.context?.ref?.replace('refs/heads/', '');
  const apiEmail = core.getInput('CLOUDFLARE_API_EMAIL', { required: true });
  const apiToken = core.getInput('CLOUDFLARE_API_TOKEN', { required: true });
  const zoneId = core.getInput('CLOUDFLARE_ZONE_ID', { required: true });
  const domain = core.getInput('CLOUDFLARE_DOMAIN', { required: true });

  const feature = features.find((feature) => feature.branches.includes(branch));

  if (!feature) {
    return core.setFailed('Feature branch not found.');
  }

  const cloudflare = new Cloudflare({ apiEmail, apiToken });

  const records = await cloudflare.dns.records.list({
    zone_id: zoneId,
    type: 'A',
  });

  const isBackendExists = records.result.some((record) => record.name === 'dev.arbihunter.com');
};
