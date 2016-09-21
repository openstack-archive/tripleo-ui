import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getAuthTokenId, getServiceUrl } from '../services/utils';

class HeatApiService {

  request() {
    return request.apply(this, arguments);
  }

  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'heat').then((serviceUrl) => {
      let requestAttributes = _.merge({
        url: `${serviceUrl}${path}`,
        headers: { 'X-Auth-Token': getAuthTokenId() },
        crossOrigin: true,
        contentType: 'application/json',
        type: 'json',
        method: 'GET'
      }, additionalAttributes);
      return when(this.request(requestAttributes));
    });
  }

  getStacks() {
    return this.defaultRequest('/stacks');
  }

  getResources(stackName, stackId) {
    return this.defaultRequest(`/stacks/${stackName}/${stackId}/resources`);
  }
}

export default new HeatApiService();
