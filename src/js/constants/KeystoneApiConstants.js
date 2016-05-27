import { getAppConfig } from '../services/utils';

let HOST = location.protocol + '//' + location.hostname;
let KEYSTONE_URL = getAppConfig().keystone || HOST + ':5000/v2.0';

export const AUTH_URL = KEYSTONE_URL + '/tokens';
