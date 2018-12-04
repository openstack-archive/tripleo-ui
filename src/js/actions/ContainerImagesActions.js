/**
 * Copyright 2018 Red Hat Inc.
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

import { startSubmit, stopSubmit, reset } from 'redux-form';
import { defineMessages } from 'react-intl';

import { CONTAINER_IMAGES_PREPARE_SUCCESS } from '../constants/ContainerImagesConstants';
import MistralConstants from '../constants/MistralConstants';
import { getCurrentPlanName } from '../selectors/plans';
import { startWorkflow } from './WorkflowActions';
import { handleErrors } from './ErrorActions';

const messages = defineMessages({
  configureImagesFailed: {
    id: 'ContainerImagesActions.configureImagesFailed',
    defaultMessage: 'Generating container images configuration failed'
  }
});

export const startContainerImagesPrepare = values => (
  dispatch,
  getState,
  { getIntl }
) => {
  const currentPlanName = getCurrentPlanName(getState());
  const { formatMessage } = getIntl(getState());
  dispatch(startSubmit('containerImagesPrepareForm'));
  return dispatch(
    startWorkflow(
      MistralConstants.CONTAINER_IMAGES_PREPARE_DEFAULT,
      {
        container: currentPlanName,
        container_image_values: { ...values }
      },
      containerImagesPrepareFinished,
      60 * 1000
    )
  ).catch(error => {
    dispatch(
      stopSubmit('containerImagesPrepareForm', {
        _error: {
          title: formatMessage(messages.configureImagesFailed),
          message: error.message
        }
      })
    );
    dispatch(
      handleErrors(error, formatMessage(messages.configureImagesFailed), false)
    );
  });
};

export const containerImagesPrepareFinished = execution => (
  dispatch,
  getState,
  { getIntl }
) => {
  const { formatMessage } = getIntl(getState());
  const { output: { message, status, params } } = execution;
  if (status === 'SUCCESS') {
    dispatch(containerImagesPrepareSuccess(params.ContainerImagePrepare));
    dispatch(reset('containerImagesPrepareForm'));
    dispatch(stopSubmit('containerImagesPrepareForm'));
  } else {
    dispatch(
      stopSubmit('containerImagesPrepareForm', {
        _error: {
          title: formatMessage(messages.configureImagesFailed),
          message: sanitizeMessage(message)
        }
      })
    );
  }
};

export const containerImagesPrepareSuccess = value => ({
  type: CONTAINER_IMAGES_PREPARE_SUCCESS,
  payload: value
});
