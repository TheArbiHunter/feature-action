export interface IFeatureInputConfiguration {
  name: string;
  branches: string[];
}

export interface IFeatureOutputConfiguration {
  isProduction: boolean;

  feature: string;
  namespace: string;
  domains: {
    backend: string;
    frontend: string;
    admin: string;
    payment: string;
  };
}
