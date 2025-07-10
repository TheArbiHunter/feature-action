export const getFeatureDomains = (feature: string): Record<string, string> => {
  return {
    frontend: `dev${feature ? `.${feature}` : ''}`,
    backend: `api.dev${feature ? `.${feature}` : ''}`,
    payment: `payment.dev${feature ? `.${feature}` : ''}`,
    admin: `admin.dev${feature ? `.${feature}` : ''}`,
  };
};
