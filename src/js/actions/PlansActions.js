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

import { defineMessages } from 'react-intl'
import { normalize, arrayOf } from 'normalizr'
import when from 'when'
import yaml from 'js-yaml'

import { handleErrors } from './ErrorActions'
import MistralApiService from '../services/MistralApiService'
import NotificationActions from '../actions/NotificationActions'
import PlansConstants from '../constants/PlansConstants'
import { planFileSchema } from '../normalizrSchemas/plans'
import StackActions from '../actions/StacksActions'
import SwiftApiService from '../services/SwiftApiService'
import MistralConstants from '../constants/MistralConstants'
import { PLAN_ENVIRONMENT } from '../constants/PlansConstants'
import { getServiceUrl } from '../services/utils'

const messages = defineMessages({
  planCreatedNotificationTitle: {
    id: 'PlansActions.planCreatedNotificationTitle',
    defaultMessage: 'Plan was created'
  },
  planCreatedNotificationMessage: {
    id: 'PlansActions.planCreatedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully created.'
  },
  planUpdatedNotificationTitle: {
    id: 'PlansActions.planUpdatedNotificationTitle',
    defaultMessage: 'Plan Updated'
  },
  planUpdatedNotificationMessage: {
    id: 'PlansActions.planUpdatedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully updated.'
  },
  planUpdateFailed: {
    id: 'PlansActions.planUpdateFailedNotificationMessage',
    defaultMessage: 'Plan update failed'
  },
  planDeletedNotificationTitle: {
    id: 'PlansActions.planDeletedNotificationTitle',
    defaultMessage: 'Plan Deleted'
  },
  planDeletedNotificationMessage: {
    id: 'PlansActions.planDeletedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully deleted.'
  },
  deploymentFailedNotificationTitle: {
    id: 'PlansActions.deploymentFailedNotificationTitle',
    defaultMessage: 'Deployment Failed'
  },
  exportFailedNotificationTitle: {
    id: 'PlansActions.exportFailedNotificationTitle',
    defaultMessage: 'Export Failed'
  }
})

export default {
  requestPlans() {
    return {
      type: PlansConstants.REQUEST_PLANS
    }
  },

  receivePlans(plans) {
    return {
      type: PlansConstants.RECEIVE_PLANS,
      payload: plans
    }
  },

  fetchPlans() {
    return dispatch => {
      dispatch(this.requestPlans())
      MistralApiService.runAction(MistralConstants.PLAN_LIST)
        // TODO(jtomasek): This block should be done on Mistral action side
        .then(planNames =>
          when
            .all(
              planNames.map(name =>
                SwiftApiService.getObject(name, PLAN_ENVIRONMENT)
              )
            )
            .then(planEnvs =>
              planNames.map(planName => {
                const { name: title, description } = yaml.safeLoad(
                  planEnvs[planName]
                )
                return { name: planName, title, description }
              })
            )
            .catch(error => {
              dispatch(
                handleErrors(error, 'Plan descriptions could not be loaded')
              )
              return planNames.map(name => ({ name, title: name }))
            })
        )
        .then(plans => {
          dispatch(this.receivePlans(plans))
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Plans could not be loaded'))
        })
    }
  },

  requestPlan() {
    return {
      type: PlansConstants.REQUEST_PLAN
    }
  },

  receivePlan(planName, planFiles) {
    return {
      type: PlansConstants.RECEIVE_PLAN,
      payload: {
        planName: planName,
        planFiles: planFiles
      }
    }
  },

  fetchPlan(planName) {
    return dispatch => {
      dispatch(this.requestPlan())
      SwiftApiService.getContainer(planName)
        .then(response => {
          const planFiles = normalize(response, arrayOf(planFileSchema))
            .entities.planFiles || {}
          dispatch(this.receivePlan(planName, planFiles))
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Plan could not be loaded'))
        })
    }
  },

  updatePlanPending(planName) {
    return {
      type: PlansConstants.UPDATE_PLAN_PENDING,
      payload: planName
    }
  },

  updatePlanSuccess(planName) {
    return {
      type: PlansConstants.UPDATE_PLAN_SUCCESS,
      payload: planName
    }
  },

  updatePlanFailed(planName, errors) {
    return {
      type: PlansConstants.UPDATE_PLAN_FAILED,
      payload: {
        planName,
        errors
      }
    }
  },

  updatePlan(planName, planFiles, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState())
      dispatch(this.updatePlanPending(planName))
      uploadFilesToContainer(planName, planFiles)
        .then(response =>
          MistralApiService.runWorkflow(MistralConstants.PLAN_UPDATE, {
            container: planName
          })
        )
        .catch(error => {
          dispatch(handleErrors(error, 'Plan update failed', false))
          dispatch(
            this.updatePlanFailed(planName, [
              {
                title: formatMessage(messages.planUpdateFailed),
                message: error.message
              }
            ])
          )
        })
    }
  },

  updatePlanFromTarball(planName, file, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState())
      dispatch(this.updatePlanPending(planName))
      SwiftApiService.uploadTarball(planName, file)
        .then(response => {
          MistralApiService.runWorkflow(MistralConstants.PLAN_UPDATE, {
            container: planName
          })
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Plan update failed', false))
          dispatch(
            this.updatePlanFailed(planName, [
              {
                title: formatMessage(messages.planUpdateFailed),
                message: error.message
              }
            ])
          )
        })
    }
  },

  updatePlanFinished(payload, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState())
      const planName = payload.execution.input.container
      if (payload.status === 'SUCCESS') {
        dispatch(this.updatePlanSuccess(planName))
        dispatch(
          NotificationActions.notify({
            title: formatMessage(messages.planUpdatedNotificationTitle),
            message: formatMessage(messages.planUpdatedNotificationMessage, {
              planName: planName
            }),
            type: 'success'
          })
        )
        dispatch(this.fetchPlans())
        history.push('/plans/manage')
      } else {
        dispatch(
          this.updatePlanFailed(planName, [
            {
              title: formatMessage(messages.planUpdateFailed),
              message: payload.message
            }
          ])
        )
      }
    }
  },

  cancelCreatePlan() {
    return {
      type: PlansConstants.CANCEL_CREATE_PLAN
    }
  },

  createPlanPending() {
    return {
      type: PlansConstants.CREATE_PLAN_PENDING
    }
  },

  createPlanSuccess() {
    return {
      type: PlansConstants.CREATE_PLAN_SUCCESS
    }
  },

  createPlanFailed(errors) {
    return {
      type: PlansConstants.CREATE_PLAN_FAILED,
      payload: errors
    }
  },

  createPlan(planName, planFiles) {
    return dispatch => {
      dispatch(this.createPlanPending())
      MistralApiService.runAction(MistralConstants.CREATE_CONTAINER, {
        container: planName
      })
        .then(response => uploadFilesToContainer(planName, planFiles))
        .then(response =>
          MistralApiService.runWorkflow(MistralConstants.PLAN_CREATE, {
            container: planName
          })
        )
        .catch(error => {
          dispatch(handleErrors(error, 'Plan creation failed', false))
          dispatch(
            this.createPlanFailed([
              { title: 'Plan creation failed', message: error.message }
            ])
          )
        })
    }
  },

  createPlanFromTarball(planName, file) {
    return dispatch => {
      dispatch(this.createPlanPending())
      MistralApiService.runAction(MistralConstants.CREATE_CONTAINER, {
        container: planName
      })
        .then(response => SwiftApiService.uploadTarball(planName, file))
        .then(response =>
          MistralApiService.runWorkflow(MistralConstants.PLAN_CREATE, {
            container: planName
          })
        )
        .catch(error => {
          dispatch(handleErrors(error, 'Plan creation failed', false))
          dispatch(
            this.createPlanFailed([
              { title: 'Plan creation failed', message: error.message }
            ])
          )
        })
    }
  },

  createPlanFinished(payload, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState())
      if (payload.status === 'SUCCESS') {
        const planName = payload.execution.input.container
        dispatch(this.createPlanSuccess())
        dispatch(
          NotificationActions.notify({
            type: 'success',
            title: formatMessage(messages.planCreatedNotificationTitle),
            message: formatMessage(messages.planCreatedNotificationMessage, {
              planName: planName
            })
          })
        )
        dispatch(this.fetchPlans())
        history.push('/plans/manage')
      } else {
        dispatch(
          this.createPlanFailed([
            { title: 'Plan creation failed', message: payload.message }
          ])
        )
      }
    }
  },

  deletePlanPending(planName) {
    return {
      type: PlansConstants.DELETE_PLAN_PENDING,
      payload: planName
    }
  },

  deletePlanSuccess(planName) {
    return {
      type: PlansConstants.DELETE_PLAN_SUCCESS,
      payload: planName
    }
  },

  deletePlanFailed(planName) {
    return {
      type: PlansConstants.DELETE_PLAN_FAILED,
      payload: planName
    }
  },

  deletePlan(planName, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState())
      dispatch(this.deletePlanPending(planName))
      history.push('/plans/manage')
      MistralApiService.runAction(MistralConstants.PLAN_DELETE, {
        container: planName
      })
        .then(response => {
          dispatch(this.deletePlanSuccess(planName))
          dispatch(
            NotificationActions.notify({
              title: formatMessage(messages.planDeletedNotificationTitle),
              message: formatMessage(messages.planDeletedNotificationMessage, {
                planName: planName
              }),
              type: 'success'
            })
          )
        })
        .catch(error => {
          dispatch(handleErrors(error, `Plan ${planName} could not be deleted`))
          dispatch(this.deletePlanFailed(planName))
        })
    }
  },

  deployPlanPending(planName) {
    return {
      type: PlansConstants.START_DEPLOYMENT_PENDING,
      payload: planName
    }
  },

  deployPlanSuccess(planName) {
    return {
      type: PlansConstants.START_DEPLOYMENT_SUCCESS,
      payload: planName
    }
  },

  deployPlanFailed(planName) {
    return {
      type: PlansConstants.START_DEPLOYMENT_FAILED,
      payload: planName
    }
  },

  deployPlan(planName) {
    return dispatch => {
      dispatch(this.deployPlanPending(planName))
      MistralApiService.runWorkflow(MistralConstants.DEPLOYMENT_DEPLOY_PLAN, {
        container: planName,
        timeout: 240
      })
        .then(response => {
          dispatch(StackActions.fetchStacks())
        })
        .catch(error => {
          dispatch(
            handleErrors(error, `Plan ${planName} could not be deployed`)
          )
          dispatch(this.deployPlanFailed(planName))
        })
    }
  },

  deployPlanFinished(payload) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState())
      if (payload.status === 'FAILED') {
        dispatch(this.deployPlanFailed(payload.execution.input.container))
        dispatch(
          NotificationActions.notify({
            title: formatMessage(messages.deploymentFailedNotificationTitle),
            message: payload.message,
            type: 'error'
          })
        )
      } else {
        dispatch(this.deployPlanSuccess(payload.execution.input.container))
        dispatch(StackActions.fetchStacks())
      }
    }
  },

  exportPlanPending(planName) {
    return {
      type: PlansConstants.EXPORT_PLAN_PENDING,
      payload: planName
    }
  },

  exportPlanSuccess(planExportUrl) {
    return {
      type: PlansConstants.EXPORT_PLAN_SUCCESS,
      payload: planExportUrl
    }
  },

  exportPlanFailed(planName) {
    return {
      type: PlansConstants.EXPORT_PLAN_FAILED,
      payload: planName
    }
  },

  exportPlan(planName) {
    return dispatch => {
      dispatch(this.exportPlanPending(planName))
      MistralApiService.runWorkflow(MistralConstants.PLAN_EXPORT, {
        plan: planName
      }).catch(error => {
        dispatch(handleErrors(error, `Plan ${planName} could not be exported`))
        dispatch(this.exportPlanFailed(planName))
      })
    }
  },

  exportPlanFinished(payload) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState())
      if (payload.status === 'FAILED' || !payload.tempurl) {
        dispatch(this.exportPlanFailed(payload.execution.input.plan))
        dispatch(
          NotificationActions.notify({
            title: formatMessage(messages.exportFailedNotificationTitle),
            message: payload.message,
            type: 'error'
          })
        )
      } else {
        let urlParser = document.createElement('a')
        urlParser.href = payload.tempurl
        let url = urlParser.hostname
        urlParser.href = getServiceUrl('swift')
        let swiftUrl = urlParser.hostname
        dispatch(this.exportPlanSuccess(payload.tempurl.replace(url, swiftUrl)))
      }
    }
  }
}

/*
  * Uploads a number of files to a container.
  * Returns a promise which gets resolved when all files are uploaded
  * or rejected if >= 1 objects fail.
  * @container: String
  * @files: Object
  */
export const uploadFilesToContainer = (container, files) =>
  when.all(
    Object.keys(files).map(fileName =>
      SwiftApiService.createObject(
        container,
        fileName,
        files[fileName].contents
      )
    )
  )
