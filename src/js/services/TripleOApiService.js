import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getAuthTokenId, getServiceUrl } from '../services/utils';

class TripleOApiService {

  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'tripleo').then((serviceUrl) => {
      let requestAttributes = _.merge({
        url: `${serviceUrl}${path}`,
        headers: { 'X-Auth-Token': getAuthTokenId() },
        crossOrigin: true,
        contentType: 'application/json',
        type: 'json',
        method: 'GET'
      }, additionalAttributes);
      return when(request(requestAttributes));
    });
  }

  /**
   * TripleO API: GET /v1/plans/
   * @returns {Promise} resolving with {array} of plans.
   */
  getPlans() {
    return this.defaultRequest('/plans');
  }

  /**
   * TripleO API: GET /v1/plans/<planName>
   * @returns plan.
   */
  getPlan(planName) {
    return this.defaultRequest(`/plans/${planName}`);
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/environments
   * @returns Plan's environments mapping.
   */
  getPlanEnvironments(planName) {
    return this.defaultRequest(`/plans/${planName}/environments`);
  }

  /**
   * TripleO API: PATCH /v1/plans/<planName>/environments
   * Deletes temporary environment after updating
   * @returns Plan's environments mapping.
   */
  updatePlanEnvironments(planName, data) {
    return this.defaultRequest(`/plans/${planName}/environments?delete`, {
      method: 'PATCH',
      data: JSON.stringify(data)
    });
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/parameters
   * @returns Plan's parameters.
   */
  getPlanParameters(planName) {
    return this.defaultRequest(`/plans/${planName}/parameters`);
  }

  /**
   * TripleO API: PATCH /v1/plans/<planName>/parameters
   * @returns Plan's parameters.
   */
  updatePlanParameters(planName, data) {
    return this.defaultRequest(`/plans/${planName}/parameters`, {
      method: 'PATCH',
      data: JSON.stringify(data)
    });
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/resource_types
   * @returns Plan's resource registry.
   */
  getPlanResourceTypes(planName) {
    return this.defaultRequest(`/plans/${planName}/resource_types`);
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/roles
   * @returns Plan's roles mapping.
   */
  getPlanRoles(planName) {
    return this.defaultRequest(`/plans/${planName}/roles`);
  }

  /**
   * TripleO API: GET /v1/plans/<planName>/validate
   * @returns Plan's validation results.
   */
  validatePlan(planName) {
    return this.defaultRequest(`/plans/${planName}/validate`);
  }

  /**
   * TripleO API: PUT /v1/plans/<planName>/deploy
   */
  deployPlan(planName) {
    return this.defaultRequest(`/plans/${planName}/deploy`, {
      method: 'PUT'
    });
  }

  /**
   * TripleO API: POST /v1/plans
   */
  createPlan(name, files) {
    return this.defaultRequest('/plans', {
      data: JSON.stringify({
        name: name,
        files: files
      }),
      method: 'POST'
    });
  }

  /**
   * TripleO API: PATCH /v1/plans/<name>
   */
  updatePlan(name, files) {
    return this.defaultRequest(`/plans/${name}`, {
      data: JSON.stringify({
        files: files
      }),
      method: 'PATCH'
    });
  }

  /**
   * TripleO API: DELETE /v1/plans/<name>
   */
  deletePlan(name) {
    return this.defaultRequest(`/plans/${name}`, {
      method: 'DELETE'
    });
  }
}

export default new TripleOApiService();
