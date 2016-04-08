import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getAuthTokenId } from '../services/utils';
import { getTenantId } from '../services/utils';
import { HEAT_API_URL } from '../constants/APIEndpointUrls';

class HeatApiService {

  request() {
    return request.apply(this, arguments);
  }

  defaultRequest(additionalAttributes) {
    return _.merge({
      headers: { 'X-Auth-Token': getAuthTokenId() },
      crossOrigin: true,
      contentType: 'application/json',
      type: 'json',
      method: 'GET'
    }, additionalAttributes);
  }

  getStacks() {
    return when(this.request(this.defaultRequest({
      url: `${HEAT_API_URL}/${getTenantId()}/stacks`
    })));
  }

}

export default new HeatApiService();
