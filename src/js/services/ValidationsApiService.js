import * as _ from 'lodash';
import request from 'reqwest';
import when from 'when';

import { getAuthTokenId } from '../services/utils';
import { VALIDATIONS_URL } from '../constants/APIEndpointUrls';

class ValidationsApiService {
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
      url: VALIDATIONS_URL
    })));
  }

  /**
   * Validations API: GET /v1/validations/
   * @param {string} plan_id - optional, specify to fetch validations with results
   * related to certain plan if validation supports it
   * @returns {array} of validations.
   */
  getValidations(planId) {
    return when(request(this.defaultRequest({
      url: `${VALIDATIONS_URL}/validations/`,
      data: { plan_id: planId }
    })));
  }

  /**
   * Validations API: GET /v1/validations/<validationId>
   * @param {string} plan_id - optional, specify to fetch validation with results
   * related to certain plan if validation supports it
   * @returns validation.
   */
  getValidation(validationId, planId) {
    return when(request(this.defaultRequest({
      url: `${VALIDATIONS_URL}/validations/${validationId}/`,
      data: { plan_id: planId }
    })));
  }

  /**
   * Validations API: PUT /v1/validations/<validation_id>/run
   */
  runValidation(validationId, planId) {
    return when(request(this.defaultRequest({
      method: 'PUT',
      url: `${VALIDATIONS_URL}/validations/${validationId}/run`,
      data: { plan_id: planId }
    })));
  }

  /**
   * Validations API: PUT /v1/validations/<validation_id>/stop
   */
  stopValidation(validationId, planId) {
    return when(request(this.defaultRequest({
      method: 'PUT',
      url: `${VALIDATIONS_URL}/validations/${validationId}/stop`,
      data: { plan_id: planId }
    })));
  }

  /**
   * Validations API: GET /v1/stages/
   * @param {string} plan_id - optional, specify to fetch validations with results
   * related to certain plan if validation supports it
   * @returns {array} of Stages.
   */
  getStages(planId) {
    return when(request(this.defaultRequest({
      url: `${VALIDATIONS_URL}/stages/`,
      data: { plan_id: planId }
    })));
  }

  /**
   * Validations API: GET /v1/stages/<stage_id>/
   * @returns Stage.
   */
  getStage(stageId, planId) {
    return when(request(this.defaultRequest({
      url: `${VALIDATIONS_URL}/stages/${stageId}/`,
      data: { plan_id: planId }
    })));
  }

  /**
   * Validations API: PUT /v1/stages/<stage_id>/run
   */
  runStage(stageId, planId) {
    return when(request(this.defaultRequest({
      method: 'PUT',
      url: `${VALIDATIONS_URL}/stages/${stageId}/run`,
      data: { plan_id: planId }
    })));
  }

  /**
   * GET /v1/results/
   * @returns array of validation results
   */
  getResults(planId) {
    return when(request(this.defaultRequest({
      url: `${VALIDATIONS_URL}/results/`,
      data: { plan_id: planId }
    })));
  }

  /**
   * GET /v1/results/<result_id>/
   * @returns validation result
   */
  getResult(resultId) {
    return when(request(this.defaultRequest(
      { url: `${VALIDATIONS_URL}/results/${resultId}/` }
    )));
  }
}

export default new ValidationsApiService();
