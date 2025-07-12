export interface IFeatureRedisConfiguration {
  notifications: number;
  banners: number;
  assets: number;
  cache: number;
}

export interface IFeatureInputConfiguration {
  name: string;
  branches: string[];

  redis: IFeatureRedisConfiguration;
  telegram: string;
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

  telegram: string;

  database: {
    name: string;

    redis?: IFeatureRedisConfiguration;
  };
}
