export const getAppConfig = state => state.appConfig;

export const getServiceUrlFromAppConfig = (state, service) =>
  state.appConfig.get(service);

export const getExcludedLanguages = state => state.appConfig.excludedLanguages;
