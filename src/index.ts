import * as core from '@actions/core';
import { FeatureActionType } from './common/enum/feature.action.type';
import { featureTrackerAction } from './action/tracker/feature.tracker.action';
import { featureStartAction } from './action/feature/feature.start.action';
import * as github from '@actions/github';
import { getFeatureName } from './utils/feature.name.util';
import { sendTelegramMessage } from './utils/feature.telegram.util';

(async () => {
  try {
    core.debug('Starting action..');

    const type = core.getInput('TYPE') as FeatureActionType;

    if (!type) {
      core.setFailed('Action type not found.');
    }

    if (type === FeatureActionType.TRACKER) {
      return featureTrackerAction();
    }

    const telegramToken = core.getInput('TELEGRAM_TOKEN', { required: true });
    const telegramChatId = core.getInput('TELEGRAM_CHAT_ID', { required: true });

    if (type === FeatureActionType.MESSAGE) {
      const message = core.getMultilineInput('MESSAGE', { required: true });

      return sendTelegramMessage(telegramToken, telegramChatId, message.join('\n'));
    }

    const branch = github.context?.ref?.replace('refs/heads/', '');
    const apiEmail = core.getInput('CLOUDFLARE_API_EMAIL', { required: true });
    const apiToken = core.getInput('CLOUDFLARE_API_TOKEN', { required: true });
    const zoneId = core.getInput('CLOUDFLARE_ZONE_ID', { required: true });
    const kubernetesAddress = core.getInput('KUBERNETES_ADDRESS', { required: true });

    // TODO (Nikita Sitnik): uncomment in production
    // if (branch?.toLowerCase() === 'main') {
    //   return core.setFailed('Branch not found.');
    // }

    if (!branch) {
      return core.setFailed('Branch not found.');
    }

    const feature = getFeatureName(branch);

    if (!feature) {
      return core.setFailed('Feature not found.');
    }

    if (type === FeatureActionType.FEATURE_START) {
      core.setOutput('FEATURE', feature);
      core.setOutput(
        'NAMESPACE',
        feature?.length ? `development-${feature}` : 'development-default',
      );

      return featureStartAction(
        feature,
        apiEmail,
        apiToken,
        zoneId,
        kubernetesAddress,
        telegramToken,
        telegramChatId,
      );
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
})();
