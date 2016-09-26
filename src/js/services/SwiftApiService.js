import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getAuthTokenId, getServiceUrl } from '../services/utils';
import logger from '../logger/logger';

class SwiftApiService {

  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'swift').then((serviceUrl) => {
      let requestAttributes = _.merge({
        url: `${serviceUrl}${path}`,
        crossOrigin: true,
        method: 'GET',
        headers: {
          'X-Auth-Token': getAuthTokenId()
        }
      }, additionalAttributes);
      return when(request(requestAttributes));
    });
  }

  createContainer(container) {
    return this.defaultRequest(`/${container}`, {
      method: 'PUT',
      headers: {
        'X-Auth-Token': getAuthTokenId(),
        'x-container-meta-usage-tripleo': 'plan'
      }
    });
  }

  createObject(container, objectName, data) {
    return this.defaultRequest(`/${container}/${objectName}`, {
      method: 'PUT',
      data: data
    });
  }

  getContainer(container) {
    return this.defaultRequest(`/${container}?format=json`, {
      method: 'GET'
    });
  }

  uploadTarball(planName, file) {
    return this.defaultRequest(`/${planName}?extract-archive=tar.gz`, {
      method: 'PUT',
      contentType: 'application/x-www-form-urlencoded',
      processData: false,
      headers: {
        'X-Auth-Token': getAuthTokenId(),
        'x-container-meta-usage-tripleo': 'plan'
      },
      data: file
    }).then((response) => {
      return when.resolve(response);
    }).catch((xhr) => {
      // Swift doesn't add CORS headers to sucessful PUT requests,
      // so a failed request is counted as success if *all* of the
      // following criteria a true:
      //   - status is 0
      //   - statusText is empty
      //   - timeout is false
      if(xhr.status === 0 && xhr.statusText === '' && xhr.timeout === 0) {
        return when.resolve(xhr);
      }
      logger.error('Tarball upload failed', xhr);
      return when.reject(xhr);
    });
  }
}

export default new SwiftApiService();
