import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getAuthTokenId, getServiceUrl } from '../services/utils';

class ValidationsApiService {
  defaultRequest(path, additionalAttributes) {
    return when.try(getServiceUrl, 'validations').then((serviceUrl) => {
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
   * Validations API: GET /v1/validations/
   * @param {string} plan_id - optional, specify to fetch validations with results
   * related to certain plan if validation supports it
   * @returns {array} of validations.
   */
  getValidations(planId) {
    return this.defaultRequest('/validations/', {
      data: { plan_id: planId }
    });
  }

  /**
   * Validations API: GET /v1/validations/<validationId>
   * @param {string} plan_id - optional, specify to fetch validation with results
   * related to certain plan if validation supports it
   * @returns validation.
   */
  getValidation(validationId, planId) {
    return this.defaultRequest(`/validations/${validationId}/`, {
      data: { plan_id: planId }
    });
  }

  /**
   * Validations API: PUT /v1/validations/<validation_id>/run
   */
  runValidation(validationId, planId) {
    return this.defaultRequest(`/validations/${validationId}/run`, {
      method: 'PUT',
      data: { plan_id: planId }
    });
  }

  /**
   * Validations API: PUT /v1/validations/<validation_id>/stop
   */
  stopValidation(validationId, planId) {
    return this.defaultRequest(`/validations/${validationId}/stop`, {
      method: 'PUT',
      data: { plan_id: planId }
    });
  }

  /**
   * Validations API: GET /v1/stages/
   * @param {string} plan_id - optional, specify to fetch validations with results
   * related to certain plan if validation supports it
   * @returns {array} of Stages.
   */
  getStages(planId) {
    return this.defaultRequest('/stages/', {
      data: { plan_id: planId }
    });
  }

  /**
   * Validations API: GET /v1/stages/<stage_id>/
   * @returns Stage.
   */
  getStage(stageId, planId) {
    return this.defaultRequest(`/stages/${stageId}/`, {
      data: { plan_id: planId }
    });
  }

  /**
   * Validations API: PUT /v1/stages/<stage_id>/run
   */
  runStage(stageId, planId) {
    return this.defaultRequest(`/stages/${stageId}/run`, {
      method: 'PUT',
      data: { plan_id: planId }
    });
  }

  /**
   * GET /v1/results/
   * @returns array of validation results
   */
  getResults(planId) {
    return this.defaultRequest('/results/', {
      data: { plan_id: planId }
    });
  }

  /**
   * GET /v1/results/<result_id>/
   * @returns validation result
   */
  getResult(resultId) {
    return this.defaultRequest(`/results/${resultId}/`);
  }
}

export default new ValidationsApiService();
