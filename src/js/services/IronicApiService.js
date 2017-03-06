import fetch from 'isomorphic-fetch';

import { getServiceUrl,
         getAuthTokenId,
         checkApiResponseStatus,
         getApiResponseText } from './utils';

class IronicApiService {
  defaultRequest(path, additionalAttributes={}) {
    return getServiceUrl('ironic').then(serviceUrl => {
      return fetch(
        `${serviceUrl}${path}`,
        Object.assign(additionalAttributes, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': getAuthTokenId(),
            'X-OpenStack-Ironic-API-Version': '1.14'
          },
          method: 'GET'
        })
      )
      .then(getApiResponseText)
      .then(checkApiResponseStatus);
    });
  }

  /**
   * Ironic API: GET /v1/nodes/detail
   * @returns {array} of nodes with complete details
   */
  getNodes() {
    return this.defaultRequest('/nodes/detail');
  }

  /**
   * Ironic API: GET /v1/nodes/<uuid>
   * @returns node object.
   */
  getNode(nodeId) {
    return this.defaultRequest('/nodes/' + nodeId);
  }

  getNodePorts(nodeUUID) {
    return this.defaultRequest(`/nodes/${nodeUUID}/ports`);
  }

  patchNode(nodePatch) {
    return this.defaultRequest(`/nodes/${nodePatch.uuid}`, {
      method: 'PATCH',
      data: JSON.stringify(nodePatch.patches)
    });
  }

  deleteNode(nodeId) {
    return this.defaultRequest(`/nodes/${nodeId}`, {
      method: 'DELETE'
    });
  }
}

export default new IronicApiService();
