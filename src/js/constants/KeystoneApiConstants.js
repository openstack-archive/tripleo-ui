import { getAppConfig } from '../services/utils';

let HOST = location.protocol + '//' + location.hostname;
let KEYSTONE_URL = getAppConfig().keystone || HOST + ':5000/v3';

export const AUTH_URL = KEYSTONE_URL + '/auth/tokens';
