/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import axios from 'axios'
import when from 'when'

import { AuthenticationError, HeatApiError, ConnectionError } from './errors'
import { getAuthTokenId, getServiceUrl } from '../services/utils'

class HeatApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'heat').then(serviceUrl => {
      let requestAttributes = Object.assign(
        {
          baseURL: serviceUrl,
          url: path,
          method: 'GET',
          headers: {
            'X-Auth-Token': getAuthTokenId()
          }
        },
        additionalAttributes
      )
      return axios(requestAttributes)
    })
  }

  getStacks() {
    return this.defaultRequest('/stacks')
      .then(response => response.data)
      .catch(handleErrors)
  }

  getStack(stackName, stackId) {
    return this.defaultRequest(`/stacks/${stackName}/${stackId}`)
      .then(response => response.data)
      .catch(handleErrors)
  }

  getResources(stackName, stackId) {
    return this.defaultRequest(`/stacks/${stackName}/${stackId}/resources`, {
      params: { nested_depth: 3 }
    })
      .then(response => response.data)
      .catch(handleErrors)
  }

  getResource(stack, resourceName) {
    return this.defaultRequest(
      `/stacks/${stack.stack_name}/${stack.id}/resources/${resourceName}`
    )
      .then(response => response.data)
      .catch(handleErrors)
  }

  getEnvironment(stack) {
    return this.defaultRequest(
      `/stacks/${stack.stack_name}/${stack.id}/environment`
    )
      .then(response => response.data)
      .catch(handleErrors)
  }

  deleteStack(name, id) {
    return this.defaultRequest(`/stacks/${name}/${id}`, { method: 'DELETE' })
      .then(response => response.data)
      .catch(handleErrors)
  }
}

const handleErrors = e => {
  if (e.response && e.response.status === 401) {
    return when.reject(new AuthenticationError(e))
  } else if (e.response) {
    return when.reject(new HeatApiError(e))
  } else if (e.request) {
    return when.reject(
      new ConnectionError('Connection to Heat API could not be established', e)
    )
  } else {
    return when.reject(e)
  }
}

export default new HeatApiService()
