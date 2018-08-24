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

import { defineMessages } from 'react-intl';
import when from 'when';
import yaml from 'js-yaml';
import { startSubmit, stopSubmit } from 'redux-form';

import { handleErrors } from './ErrorActions';
import history from '../utils/history';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';
import SwiftApiService from '../services/SwiftApiService';
import MistralConstants from '../constants/MistralConstants';
import { PLAN_ENVIRONMENT } from '../constants/PlansConstants';
import { getServiceUrl } from '../selectors/auth';
import { startWorkflow } from './WorkflowActions';
import { sanitizeMessage } from '../utils';

const messages = defineMessages({
  planCreatedNotificationTitle: {
    id: 'PlansActions.planCreatedNotificationTitle',
    defaultMessage: 'Plan was created'
  },
  planCreatedNotificationMessage: {
    id: 'PlansActions.planCreatedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully created.'
  },
  planCreationFailed: {
    id: 'PlansActions.planCreationFailedNotificationMessage',
    defaultMessage: 'Plan creation failed'
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
  exportFailedNotificationTitle: {
    id: 'PlansActions.exportFailedNotificationTitle',
    defaultMessage: 'Export Failed'
  }
});

export const fetchPlansPending = () => ({
  type: PlansConstants.FETCH_PLANS_PENDING
});

export const fetchPlansSuccess = plans => ({
  type: PlansConstants.FETCH_PLANS_SUCCESS,
  payload: plans
});

export const fetchPlans = () => dispatch => {
  dispatch(fetchPlansPending());
  return dispatch(MistralApiService.runAction(MistralConstants.PLAN_LIST))
    .then(plans => dispatch(fetchPlansSuccess(plans)))
    .catch(error => dispatch(handleErrors(error, 'Plans could not be loaded')));
};

export const fetchPlanFilesPending = planName => ({
  type: PlansConstants.FETCH_PLAN_FILES_PENDING,
  payload: planName
});

export const fetchPlanFilesSuccess = (planName, planFiles) => ({
  type: PlansConstants.FETCH_PLAN_FILES_SUCCESS,
  payload: { planName, planFiles }
});

export const fetchPlanFilesFailed = planName => ({
  type: PlansConstants.FETCH_PLAN_FILES_FAILED,
  payload: planName
});

export const fetchPlanFiles = planName => dispatch => {
  dispatch(fetchPlanFilesPending(planName));
  return dispatch(SwiftApiService.getContainer(planName))
    .then(response => {
      dispatch(fetchPlanFilesSuccess(planName, response));
    })
    .catch(error => {
      dispatch(handleErrors(error, 'Plan could not be loaded'));
      dispatch(fetchPlanFilesFailed(planName));
    });
};

export const fetchPlanDetailsPending = planName => ({
  type: PlansConstants.FETCH_PLAN_DETAILS_PENDING,
  payload: planName
});

export const fetchPlanDetailsSuccess = (planName, planEnvironment) => ({
  type: PlansConstants.FETCH_PLAN_DETAILS_SUCCESS,
  payload: { planName, planEnvironment }
});

export const fetchPlanDetailsFailed = planName => ({
  type: PlansConstants.FETCH_PLAN_DETAILS_FAILED,
  payload: planName
});

export const fetchPlanDetails = planName => dispatch => {
  dispatch(fetchPlanDetailsPending(planName));
  return dispatch(SwiftApiService.getObject(planName, PLAN_ENVIRONMENT))
    .then(response =>
      dispatch(fetchPlanDetailsSuccess(planName, yaml.safeLoad(response)))
    )
    .catch(error => {
      if (error.response && error.response.status !== 404) {
        dispatch(handleErrors(error, 'Plan details could not be loaded'));
      }
      dispatch(fetchPlanDetailsFailed(planName));
    });
};

export const updatePlanPending = planName => ({
  type: PlansConstants.UPDATE_PLAN_PENDING,
  payload: planName
});

export const updatePlanSuccess = planName => ({
  type: PlansConstants.UPDATE_PLAN_SUCCESS,
  payload: planName
});

export const updatePlanFailed = planName => ({
  type: PlansConstants.UPDATE_PLAN_FAILED,
  payload: planName
});

export const updatePlan = (planName, planFiles) => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  dispatch(startSubmit('editPlanForm'));
  dispatch(updatePlanPending(planName));
  return dispatch(uploadFilesToContainer(planName, planFiles))
    .then(response =>
      dispatch(
        startWorkflow(
          MistralConstants.PLAN_UPDATE,
          { container: planName },
          updatePlanFinished,
          2 * 60 * 1000
        )
      )
    )
    .catch(error => {
      dispatch(updatePlanFailed(planName));
      return dispatch(
        stopSubmit('editPlanForm', {
          _error: {
            title: formatMessage(messages.planUpdateFailed),
            message: error.message
          }
        })
      );
    });
};

export const updatePlanFromTarball = (planName, file) => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  dispatch(startSubmit('editPlanForm'));
  dispatch(updatePlanPending(planName));
  return dispatch(SwiftApiService.uploadTarball(planName, file))
    .then(response => {
      dispatch(
        startWorkflow(
          MistralConstants.PLAN_UPDATE,
          { container: planName },
          updatePlanFinished,
          2 * 60 * 1000
        )
      );
    })
    .catch(error => {
      dispatch(updatePlanFailed(planName));
      return dispatch(
        stopSubmit('editPlanForm', {
          _error: {
            title: formatMessage(messages.planUpdateFailed),
            message: error.message
          }
        })
      );
    });
};

export const updatePlanFromGit = (planName, gitUrl) => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  dispatch(startSubmit('editPlanForm'));
  dispatch(updatePlanPending(planName));
  return dispatch(
    startWorkflow(
      MistralConstants.PLAN_UPDATE,
      {
        container: planName,
        source_url: gitUrl
      },
      updatePlanFinished,
      2 * 60 * 1000
    )
  ).catch(error => {
    dispatch(updatePlanFailed(planName));
    return dispatch(
      stopSubmit('editPlanForm', {
        _error: {
          title: formatMessage(messages.planUpdateFailed),
          message: error.message
        }
      })
    );
  });
};

export const updatePlanFinished = execution => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  const {
    input: { container: planName },
    output: { message },
    state
  } = execution;
  if (state === 'SUCCESS') {
    dispatch(updatePlanSuccess(planName));
    dispatch(
      NotificationActions.notify({
        title: formatMessage(messages.planUpdatedNotificationTitle),
        message: formatMessage(messages.planUpdatedNotificationMessage, {
          planName
        }),
        type: 'success'
      })
    );
    dispatch(fetchPlans());
    history.push('/plans/manage');
  } else {
    dispatch(updatePlanFailed(planName));
    return dispatch(
      stopSubmit('editPlanForm', {
        _error: {
          title: formatMessage(messages.planUpdateFailed),
          message: sanitizeMessage(message)
        }
      })
    );
  }
};

export const createPlanSuccess = planName => ({
  type: PlansConstants.CREATE_PLAN_SUCCESS,
  payload: planName
});

export const createPlan = (planName, planFiles) => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  dispatch(startSubmit('newPlanForm'));
  return dispatch(
    MistralApiService.runAction(MistralConstants.CREATE_CONTAINER, {
      container: planName
    })
  )
    .then(response => dispatch(uploadFilesToContainer(planName, planFiles)))
    .then(response =>
      dispatch(
        startWorkflow(
          MistralConstants.PLAN_CREATE,
          { container: planName },
          createPlanFinished,
          2 * 60 * 1000
        )
      )
    )
    .catch(error => {
      dispatch(
        stopSubmit('newPlanForm', {
          _error: {
            title: formatMessage(messages.planCreationFailed),
            message: error.message
          }
        })
      );
    });
};

export const createPlanFromTarball = (planName, file) => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  dispatch(startSubmit('newPlanForm'));
  dispatch(
    MistralApiService.runAction(MistralConstants.CREATE_CONTAINER, {
      container: planName
    })
  )
    .then(response => dispatch(SwiftApiService.uploadTarball(planName, file)))
    .then(response =>
      dispatch(
        startWorkflow(
          MistralConstants.PLAN_CREATE,
          { container: planName },
          createPlanFinished,
          2 * 60 * 1000
        )
      )
    )
    .catch(error => {
      dispatch(
        stopSubmit('newPlanForm', {
          _error: {
            title: formatMessage(messages.planCreationFailed),
            message: error.message
          }
        })
      );
    });
};

export const createDefaultPlan = planName => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  dispatch(startSubmit('newPlanForm'));
  return dispatch(
    startWorkflow(
      MistralConstants.PLAN_CREATE,
      {
        container: planName,
        use_default_templates: true
      },
      createPlanFinished,
      2 * 60 * 1000
    )
  ).catch(error => {
    dispatch(
      stopSubmit('newPlanForm', {
        _error: {
          title: formatMessage(messages.planCreationFailed),
          message: error.message
        }
      })
    );
  });
};

export const createPlanFromGit = (planName, gitUrl) => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  dispatch(startSubmit('newPlanForm'));
  return dispatch(
    startWorkflow(
      MistralConstants.PLAN_CREATE,
      {
        container: planName,
        source_url: gitUrl
      },
      createPlanFinished,
      2 * 60 * 1000
    )
  ).catch(error => {
    dispatch(
      stopSubmit('newPlanForm', {
        _error: {
          title: formatMessage(messages.planCreationFailed),
          message: error.message
        }
      })
    );
  });
};

export const createPlanFinished = execution => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  const {
    input: { container: planName },
    output: { message },
    state
  } = execution;
  if (state === 'SUCCESS') {
    dispatch(stopSubmit('newPlanForm'));
    dispatch(createPlanSuccess(planName));
    dispatch(
      NotificationActions.notify({
        type: 'success',
        title: formatMessage(messages.planCreatedNotificationTitle),
        message: formatMessage(messages.planCreatedNotificationMessage, {
          planName
        })
      })
    );
    history.push('/plans/manage');
  } else {
    dispatch(
      stopSubmit('newPlanForm', {
        _error: {
          title: formatMessage(messages.planCreationFailed),
          message: sanitizeMessage(message)
        }
      })
    );
  }
};

export const deletePlanPending = planName => ({
  type: PlansConstants.DELETE_PLAN_PENDING,
  payload: planName
});

export const deletePlanSuccess = planName => ({
  type: PlansConstants.DELETE_PLAN_SUCCESS,
  payload: planName
});

export const deletePlanFailed = planName => ({
  type: PlansConstants.DELETE_PLAN_FAILED,
  payload: planName
});

export const deletePlan = planName => (dispatch, getState, { getIntl }) => {
  const { formatMessage } = getIntl(getState());
  dispatch(deletePlanPending(planName));
  history.push('/plans/manage');
  return dispatch(
    MistralApiService.runAction(MistralConstants.PLAN_DELETE, {
      container: planName
    })
  )
    .then(response => {
      dispatch(deletePlanSuccess(planName));
      dispatch(
        NotificationActions.notify({
          title: formatMessage(messages.planDeletedNotificationTitle),
          message: formatMessage(messages.planDeletedNotificationMessage, {
            planName: planName
          }),
          type: 'success'
        })
      );
    })
    .catch(error => {
      dispatch(handleErrors(error, `Plan ${planName} could not be deleted`));
      dispatch(deletePlanFailed(planName));
    });
};

export const exportPlanPending = planName => ({
  type: PlansConstants.EXPORT_PLAN_PENDING,
  payload: planName
});

export const exportPlanSuccess = planExportUrl => ({
  type: PlansConstants.EXPORT_PLAN_SUCCESS,
  payload: planExportUrl
});

export const exportPlanFailed = planName => ({
  type: PlansConstants.EXPORT_PLAN_FAILED,
  payload: planName
});

export const exportPlan = planName => dispatch => {
  dispatch(exportPlanPending(planName));
  dispatch(
    startWorkflow(
      MistralConstants.PLAN_EXPORT,
      { plan: planName },
      exportPlanFinished
    )
  ).catch(error => {
    dispatch(handleErrors(error, `Plan ${planName} could not be exported`));
    dispatch(exportPlanFailed(planName));
  });
};

export const exportPlanFinished = execution => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  const { input: { plan }, output: { message, tempurl }, state } = execution;
  if (state === 'ERROR' || !tempurl) {
    dispatch(exportPlanFailed(plan));
    dispatch(
      NotificationActions.notify({
        title: formatMessage(messages.exportFailedNotificationTitle),
        message: sanitizeMessage(message)
      })
    );
  } else {
    let urlParser = document.createElement('a');
    urlParser.href = tempurl;
    let url = urlParser.hostname;
    urlParser.href = getServiceUrl(getState(), 'swift');
    let swiftUrl = urlParser.hostname;
    dispatch(exportPlanSuccess(tempurl.replace(url, swiftUrl)));
  }
};

/*
  * Uploads a number of files to a container.
  * Returns a promise which gets resolved when all files are uploaded
  * or rejected if >= 1 objects fail.
  * @container: String
  * @files: Object
  */
export const uploadFilesToContainer = (container, files) => dispatch =>
  when.all(
    Object.keys(files).map(fileName =>
      dispatch(
        SwiftApiService.createObject(container, fileName, files[fileName])
      )
    )
  );
