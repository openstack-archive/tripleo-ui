import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getAuthTokenId } from '../services/utils';
import { SWIFT_API_URL } from '../constants/APIEndpointUrls';

class SwiftApiService {

  defaultRequest(additionalAttributes) {
    return _.merge({
      method: 'GET',
      crossOrigin: true
    }, additionalAttributes);
  }

  uploadTarball(planName, file) {
    return when(request(this.defaultRequest({
      url: `${SWIFT_API_URL}/${planName}?extract-archive=tar.gz`,
      method: 'PUT',
      contentType: 'application/x-www-form-urlencoded',
      processData: false,
      headers: {
        'X-Auth-Token': getAuthTokenId(),
        'x-container-meta-usage-tripleo': 'plan'
      },
      data: file
    }))).then((response) => {
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
      return when.reject(xhr);
    });
  }
}

export default new SwiftApiService();
