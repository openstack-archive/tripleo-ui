import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getAuthTokenId } from '../services/utils';
import { TRIPLEOAPI_URL } from '../constants/APIEndpointUrls';

class TripleOApiService {

  defaultRequest(additionalAttributes) {
    return _.merge({
      headers: { 'X-Auth-Token': getAuthTokenId() },
      crossOrigin: true,
      contentType: 'application/json',
      type: 'json',
      method: 'GET'
    }, additionalAttributes);
  }

  getRoot() {
    return when(request(this.defaultRequest({
      url: TRIPLEOAPI_URL
    })));
  }

  /**
   * TripleO API: GET /v1/plans/
   * @returns {Promise} resolving with {array} of plans.
   */
  getPlans() {
    return when(request(this.defaultRequest({
      url: TRIPLEOAPI_URL + '/plans'
    })));
  }

  /**
   * TripleO API: GET /v1/plans/<planName>
   * @returns plan.
   */
  getPlan(planName) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${planName}`
    })));
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/environments
   * @returns Plan's environments mapping.
   */
  getPlanEnvironments(planName) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${planName}/environments`
    })));
  }

  /**
   * TripleO API: PATCH /v1/plans/<planName>/environments
   * Deletes temporary environment after updating
   * @returns Plan's environments mapping.
   */
  updatePlanEnvironments(planName, data) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${planName}/environments?delete`,
      method: 'PATCH',
      data: JSON.stringify(data)
    })));
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/parameters
   * @returns Plan's parameters.
   */
  getPlanParameters(planName) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${planName}/parameters`
    })));
  }

  /**
   * TripleO API: PATCH /v1/plans/<planName>/parameters
   * @returns Plan's parameters.
   */
  updatePlanParameters(planName, data) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${planName}/parameters`,
      method: 'PATCH',
      data: JSON.stringify(data)
    })));
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/resource_types
   * @returns Plan's resource registry.
   */
  getPlanResourceTypes(planName) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${planName}/resource_types`
    })));
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/roles
   * @returns Plan's roles mapping.
   */
  getPlanRoles(planName) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${planName}/roles`
    })));
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/validate
   * @returns Plan's validation results.
   */
  validatePlan(planName) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${planName}/validate`
    })));
  }

  /**
   * TripleO API: PUT /v1/plans/<planName>/deploy
   */
  deployPlan(planName) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${planName}/deploy`,
      method: 'PUT'
    })));
  }

  /**
   * TripleO API: POST /v1/plans
   */
  createPlan(name, files) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans`,
      data: JSON.stringify({
        name: name,
        files: files
      }),
      method: 'POST'
    })));
  }

  /**
   * TripleO API: PATCH /v1/plans/<name>
   */
  updatePlan(name, files) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${name}`,
      data: JSON.stringify({
        files: files
      }),
      method: 'PATCH'
    })));
  }

  /**
   * TripleO API: DELETE /v1/plans/<name>
   */
  deletePlan(name) {
    return when(request(this.defaultRequest({
      url: `${TRIPLEOAPI_URL}/plans/${name}`,
      method: 'DELETE'
    })));
  }
}

export default new TripleOApiService();
