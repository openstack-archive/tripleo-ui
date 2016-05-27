let appConfig = window.tripleOUiConfig || {};

let zaqarWebSocketUrl = appConfig.zaqar_websocket_url || `ws://${location.hostname}:9000`;
let zaqarDefaultQueue = appConfig.zaqar_default_queue || 'tripleo';

export const ZAQAR_WEBSOCKET_URL = zaqarWebSocketUrl;
export const ZAQAR_DEFAULT_QUEUE = zaqarDefaultQueue;
