import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getAuthTokenId } from '../services/utils';
import { getServiceUrl } from '../services/utils';

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
      url: `${getServiceUrl('heat')}/stacks`
    })));
  }

}

export default new HeatApiService();
