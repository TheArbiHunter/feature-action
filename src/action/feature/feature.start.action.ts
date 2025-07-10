import * as core from '@actions/core';
import { Cloudflare } from 'cloudflare';
import { getFeatureDomains } from '../../utils/feature.domains.util';
import { stringFirstLetterUppercase } from '../../utils/string.first-letter-uppercase.util';
import { sendTelegramMessage } from '../../utils/feature.telegram.util';

export const featureStartAction = async (
  feature: string,
  apiEmail: string,
  apiToken: string,
  zoneId: string,
  kubernetesAddress: string,
  telegramToken: string,
  telegramChatId: string,
) => {
  const cloudflare = new Cloudflare({ apiEmail, apiToken });
  const records = await cloudflare.dns.records.list({ zone_id: zoneId, type: 'A' });
  const domains = getFeatureDomains(feature);

  await sendTelegramMessage(
    telegramToken,
    telegramChatId,
    [
      `🦾 Feature: ${feature.toUpperCase()}`,
      ``,
      `👉 Action: CloudFlare Records`,
      `👉 Status: Checking...`,
      ``,
    ].join('\n'),
  );

  await Promise.all(
    Object.keys(domains).map(async (deployment) => {
      const domain: string = domains[deployment] as string;
      const record = records.result.find((record) => record.name === `${domain}.arbihunter.com`);

      const comment = feature?.length
        ? `${stringFirstLetterUppercase(feature)} ${deployment} record.`
        : `Development ${deployment} record`;

      if (!record) {
        core.info(`Creating record for ${domain}`);

        await cloudflare.dns.records.create({
          zone_id: zoneId,
          type: 'A',
          name: domain,
          content: kubernetesAddress,
          proxied: false,
          comment,
        });
      } else {
        core.info(`Record for ${domain} already exists, just updating..`);

        await cloudflare.dns.records.update(record.id, {
          zone_id: zoneId,
          type: 'A',
          name: domain,
          content: kubernetesAddress,
          proxied: false,
          comment,
        });
      }
    }),
  );

  await sendTelegramMessage(
    telegramToken,
    telegramChatId,
    [
      `🦾 Feature: ${feature.toUpperCase()}`,
      ``,
      `👉 Action: CloudFlare Records`,
      `👉 Status: Successfully updated.`,
      ``,
    ].join('\n'),
  );
};
