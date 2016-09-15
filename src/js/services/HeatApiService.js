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

  getResources(stack) {
    return this.defaultRequest(`/stacks/${stack.stack_name}/${stack.id}/resources`);
  }

  getResource(stack, resourceName) {
    return this.getResources(stack).then((resources) => {
      return _.find(resources.resources, (resource) => {
        return resource['resource_name'] === resourceName;
      });
    });
  }

  getOvercloudIPAddress(stack) {
    return this.getResource(stack, 'PublicVirtualIP').then((resource) => {
      const selfLink = _.find(resource['links'], (link) => link['rel'] === 'self');
      const href = selfLink.href.split('stacks/')[1];
      return this.defaultRequest(`/stacks/${href}`).then((response) => {
        return response['resource']['attributes']['ip_address'];
      });
    });
  }

  getAdminPassword(stack) {
    const url = `/stacks/${stack.stack_name}/${stack.id}/environment`;
    return this.defaultRequest(url).then((response) => {
      return response['parameter_defaults']['AdminPassword'];
    });
  }

  getOvercloudInfo(stack) {
    return this.getOvercloudIPAddress(stack).then((ip) => {
      return this.getAdminPassword(stack).then((password) => {
        return {
          href: ip,
          password: password
        };
      });
    });
  }

}

export default new HeatApiService();
