import {
  IFeatureInputConfiguration,
  IFeatureOutputConfiguration,
} from './feature.configuration.interface';

export const getOutputConfiguration = (
  branch: string,
  feature?: IFeatureInputConfiguration,
): IFeatureOutputConfiguration => {
  const isProduction: boolean = branch.toLowerCase() === 'main';
  const middle: string = isProduction ? '' : feature ? `dev.${feature.name}.` : 'dev.';

  return {
    isProduction,
    feature: isProduction ? 'production' : (feature?.name ?? 'development'),
    namespace: isProduction ? 'production' : `development-${feature?.name ?? 'default'}`,
    database: feature?.name ? `development-${feature.name}` : '',
    domains: {
      backend: `api.${middle}`,
      frontend: `${middle}`,
      payment: `payment.${middle}`,
      admin: `admin.${middle}`,
    },
  };
};
