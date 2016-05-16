let appConfig = window.tripleOUiConfig || {};
let host = location.protocol + '//' + location.hostname;

// Use API URLs from config or fall back to current host and default paths
let keystoneUrl = appConfig.keystone_url || host + ':5000/v2.0';
let tripleoApiUrl = appConfig.tripleo_api_url || host + ':8585/v1';
let validationsUrl = appConfig.validations_url || host + ':5001/v1';
let heatApiUrl = appConfig.heat_api_url || host + ':8004/v1';
let zaqarWebSocketUrl = appConfig.zaqar_websocket_url || `ws://${location.hostname}:9000`;
let zaqarDefaultQueue = appConfig.zaqar_default_queue || 'tripleo';

export const KEYSTONE_URL = keystoneUrl;
export const TRIPLEOAPI_URL = tripleoApiUrl;
export const VALIDATIONS_URL = validationsUrl;
export const HEAT_API_URL = heatApiUrl;
export const ZAQAR_WEBSOCKET_URL = zaqarWebSocketUrl;
export const ZAQAR_DEFAULT_QUEUE = zaqarDefaultQueue;
