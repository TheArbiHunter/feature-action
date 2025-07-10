import features from './features.json';

export const getFeatureName = (branch: string): string | undefined => {
  if (branch.toLowerCase() === 'development') {
    return '';
  }

  const feature = features.find((feature) => feature.branches.includes(branch));

  if (!feature) {
    return undefined;
  }

  return feature.name;
};
