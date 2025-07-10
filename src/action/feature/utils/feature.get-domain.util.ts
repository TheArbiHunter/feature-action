import features from './features.json';

export const featureGetDomain = (branch: string): string | undefined => {
  const feature = features.find((feature) => feature.branches.includes(branch));

  if (branch.toLowerCase() !== 'development' && !feature) {
    return undefined;
  }

  return feature?.name ? `.${feature.name}` : '';
};
