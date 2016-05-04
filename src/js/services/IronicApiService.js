import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getServiceUrl, getAuthTokenId } from './utils';

class IronicApiService {
  defaultRequest(additionalAttributes) {
    return _.merge({
      headers: {
        'X-Auth-Token': getAuthTokenId(),
        'X-OpenStack-Ironic-API-Version': '1.14'
      },
      crossOrigin: true,
      contentType: 'application/json',
      type: 'json',
      method: 'GET'
    }, additionalAttributes);
  }

  getRoot() {
    return when(request(this.defaultRequest(
      {
        url: getServiceUrl('ironic')
      }
    )));
  }

  /**
   * Ironic API: GET /v1/nodes
   * @returns {array} of nodes.
   */
  getNodes() {
    return when(request(this.defaultRequest(
      {
        url: getServiceUrl('ironic') + '/nodes'
      }
    )));
  }

  /**
   * Ironic API: GET /v1/nodes/<uuid>
   * @returns node object.
   */
  getNode(nodeId) {
    return when(request(this.defaultRequest(
      {
        url: getServiceUrl('ironic') + '/nodes/' + nodeId
      }
    )));
  }

  patchNode(nodePatch) {
    return when(request(this.defaultRequest(
      {
        method: 'PATCH',
        url: getServiceUrl('ironic') + '/nodes/' + nodePatch.uuid,
        data: JSON.stringify(nodePatch.patches)
      }
    )));
  }

}

export default new IronicApiService();
