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

  getStack(stackName, stackId) {
    return this.defaultRequest(`/stacks/${stackName}/${stackId}`);
  }

  getResources(stack) {
    return this.defaultRequest(`/stacks/${stack.stack_name}/${stack.id}/resources`);
  }

  getResource(stack, resourceName) {
    return this.defaultRequest(`/stacks/${stack.stack_name}/${stack.id}/resources/${resourceName}`);
  }

  getEnvironment(stack) {
    return this.defaultRequest(`/stacks/${stack.stack_name}/${stack.id}/environment`);
  }

}

export default new HeatApiService();
