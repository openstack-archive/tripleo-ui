let appConfig = window.tripleOUiConfig || {};
let host = location.protocol + '//' + location.hostname;

// Use API URLs from config or fall back to current host and default paths
let tripleoApiUrl = appConfig.tripleo_api_url || host + ':8585/v1';
let validationsUrl = appConfig.validations_url || host + ':5001/v1';
let heatApiUrl = appConfig.heat_api_url || host + ':8004/v1';
let swiftApiUrl = appConfig.swift_api_url || undefined;

export const TRIPLEOAPI_URL = tripleoApiUrl;
export const VALIDATIONS_URL = validationsUrl;
export const HEAT_API_URL = heatApiUrl;
export const SWIFT_API_URL = swiftApiUrl;
