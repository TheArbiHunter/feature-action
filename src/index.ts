import * as core from '@actions/core';
import { FeatureActionType } from './common/enum/feature.action.type';
import { featureTrackerAction } from './action/tracker/feature.tracker.action';
import { featureEndAction } from './action/feature/feature.end.action';
import { featureStartAction } from './action/feature/feature.start.action';

export const run = async () => {
  try {
    core.info("Starting action..")

    const type = core.getInput('TYPE') as FeatureActionType;

    switch (type) {
      case FeatureActionType.TRACKER:
        core.info('Starting tracker process..');
        await featureTrackerAction();
        return;

      case FeatureActionType.FEATURE_START:
        core.info('Starting feature start process..');
        await featureStartAction();
        return;

      case FeatureActionType.FEATURE_END:
        core.info('Starting feature shutdown process..');
        await featureEndAction();
        return;
    }

    core.setFailed('Unknown action type.');
  } catch (error: any) {
    core.setFailed(error.message);
  }
};
