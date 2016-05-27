import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getServiceUrl, getAuthTokenId } from './utils';

class IronicApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'ironic').then((serviceUrl) => {
      let requestAttributes = _.merge({
        url: `${serviceUrl}${path}`,
        headers: {
          'X-Auth-Token': getAuthTokenId(),
          'X-OpenStack-Ironic-API-Version': '1.14'
        },
        crossOrigin: true,
        contentType: 'application/json',
        type: 'json',
        method: 'GET'
      }, additionalAttributes);
      return when(request(requestAttributes));
    });
  }

  /**
   * Ironic API: GET /v1/nodes
   * @returns {array} of nodes.
   */
  getNodes() {
    return this.defaultRequest('/nodes');
  }

  /**
   * Ironic API: GET /v1/nodes/<uuid>
   * @returns node object.
   */
  getNode(nodeId) {
    return this.defaultRequest('/nodes/' + nodeId);
  }

  patchNode(nodePatch) {
    return this.defaultRequest('/nodes/' + nodePatch.uuid, {
      method: 'PATCH',
      data: JSON.stringify(nodePatch.patches)
    });
  }

}

export default new IronicApiService();
