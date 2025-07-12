import * as core from '@actions/core';
import {
  IFeatureInputConfiguration,
  IFeatureOutputConfiguration,
} from './feature.configuration.interface';

export const getOutputConfiguration = (
  branch: string,
  feature?: IFeatureInputConfiguration,
): IFeatureOutputConfiguration => {
  const isProduction: boolean = branch.toLowerCase() === 'main';
  const domain: string = core.getInput('CLOUDFLARE_DOMAIN');

  const middle: string = isProduction ? '' : feature ? `dev.${feature.name}.` : 'dev.';

  return {
    isProduction,
    
    feature: isProduction ? 'production' : (feature?.name ?? 'development'),
    namespace: isProduction ? 'production' : `development-${feature?.name ?? 'default'}`,

    domains: {
      backend: `api.${middle}${domain}`,
      frontend: `${middle}${domain}`,
      payment: `payment.${middle}${domain}`,
      admin: `admin.${middle}${domain}`,
    },

    database: {
      name: feature?.name ?? '',

      ...(feature ? { redis: feature.redis } : {}),
    },
  };
};
