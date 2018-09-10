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

import { normalize } from 'normalizr';

import { handleErrors } from './ErrorActions';
import MistralApiService from '../services/MistralApiService';
import ValidationsConstants from '../constants/ValidationsConstants';
import { validationSchema } from '../normalizrSchemas/validations';
import MistralConstants from '../constants/MistralConstants';
import { startWorkflow } from './WorkflowActions';

export const fetchValidations = () => (dispatch, getState) => {
  dispatch(fetchValidationsPending());
  return dispatch(
    MistralApiService.runAction(MistralConstants.VALIDATIONS_LIST)
  )
    .then(response => {
      const validations =
        normalize(response, [validationSchema]).entities.validations || {};
      dispatch(fetchValidationsSuccess(validations));
    })
    .catch(error => {
      dispatch(handleErrors(error, 'Validations could not be loaded'));
      dispatch(fetchValidationsFailed());
    });
};

export const fetchValidationsPending = () => ({
  type: ValidationsConstants.FETCH_VALIDATIONS_PENDING
});

export const fetchValidationsSuccess = validations => ({
  type: ValidationsConstants.FETCH_VALIDATIONS_SUCCESS,
  payload: validations
});

export const fetchValidationsFailed = () => ({
  type: ValidationsConstants.FETCH_VALIDATIONS_FAILED
});

export const runValidation = (id, currentPlanName) => (dispatch, getState) =>
  dispatch(
    startWorkflow(MistralConstants.VALIDATIONS_RUN, {
      validation_name: id,
      plan: currentPlanName
    })
  ).catch(error => {
    dispatch(handleErrors(error, 'Error running validation'));
  });

export const runValidationGroups = (groups, currentPlanName) => (
  dispatch,
  getState
) => {
  dispatch(
    MistralApiService.runWorkflow(MistralConstants.VALIDATIONS_RUN_GROUPS, {
      group_names: groups,
      plan: currentPlanName
    })
  ).catch(error => {
    dispatch(handleErrors(error, 'Validation Group could not be started'));
  });
};

export const toggleValidations = () => ({
  type: ValidationsConstants.TOGGLE_VALIDATIONS
});
