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

import { normalize, arrayOf } from 'normalizr'
import { omit } from 'lodash'

import { handleErrors } from './ErrorActions'
import MistralApiService from '../services/MistralApiService'
import WorkflowExecutionsActions from './WorkflowExecutionsActions'
import ValidationsConstants from '../constants/ValidationsConstants'
import { validationSchema } from '../normalizrSchemas/validations'
import MistralConstants from '../constants/MistralConstants'

export default {
  fetchValidations() {
    return (dispatch, getState) => {
      dispatch(this.fetchValidationsPending())
      MistralApiService.runAction(MistralConstants.VALIDATIONS_LIST)
        .then(response => {
          const validations = normalize(response, arrayOf(validationSchema))
            .entities.validations || {}
          dispatch(this.fetchValidationsSuccess(validations))
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Validations could not be loaded'))
          dispatch(this.fetchValidationsFailed())
        })
    }
  },

  fetchValidationsPending() {
    return {
      type: ValidationsConstants.FETCH_VALIDATIONS_PENDING
    }
  },

  fetchValidationsSuccess(validations) {
    return {
      type: ValidationsConstants.FETCH_VALIDATIONS_SUCCESS,
      payload: validations
    }
  },

  fetchValidationsFailed() {
    return {
      type: ValidationsConstants.FETCH_VALIDATIONS_FAILED
    }
  },

  runValidation(id, currentPlanName) {
    return (dispatch, getState) => {
      MistralApiService.runWorkflow(MistralConstants.VALIDATIONS_RUN, {
        validation_name: id,
        plan: currentPlanName
      })
        .then(response => {
          dispatch(WorkflowExecutionsActions.addWorkflowExecution(response))
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Error running validation'))
        })
    }
  },

  runValidationMessage(messagePayload) {
    return (dispatch, getState) => {
      // convert messagePayload to execution-like response
      const execution = {
        id: messagePayload.execution.id,
        input: messagePayload.execution.input,
        output: omit(messagePayload, 'execution'),
        params: messagePayload.execution.params,
        state: messagePayload.status,
        workflow_name: MistralConstants.VALIDATIONS_RUN
      }
      dispatch(WorkflowExecutionsActions.addWorkflowExecution(execution))
    }
  },

  runValidationGroups(groups, currentPlanName) {
    return (dispatch, getState) => {
      MistralApiService.runWorkflow(MistralConstants.VALIDATIONS_RUN_GROUPS, {
        group_names: groups,
        plan: currentPlanName
      }).catch(error => {
        dispatch(handleErrors(error, 'Validation Group could not be started'))
      })
    }
  }
}
