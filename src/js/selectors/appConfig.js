export const getAppConfig = state => state.appConfig;

export const getServiceUrlFromAppConfig = (state, service) =>
  state.appConfig.get(service);

export const getExcludedLanguages = state => state.appConfig.excludedLanguages;

export const getDefaultZaqarQueue = state =>
  state.appConfig.get('zaqar_default_queue', 'tripleo');

export const getLoggingZaqarQueue = state =>
  state.appConfig.get('logger-zaqar-queue', 'tripleo-ui-logging');
