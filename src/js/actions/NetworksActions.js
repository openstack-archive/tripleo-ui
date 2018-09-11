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

import { normalize } from 'normalizr';
import { defineMessages } from 'react-intl';

import MistralConstants from '../constants/MistralConstants';
import { handleErrors } from './ErrorActions';
import { networkSchema } from '../normalizrSchemas/networks';
import NetworksConstants from '../constants/NetworksConstants';
import { startWorkflow } from './WorkflowActions';

const messages = defineMessages({
  fetchNetworksFailed: {
    id: 'NetworksActions.fetchNetworksFailed',
    defaultMessage: 'Networks could not be loaded'
  }
});

export const fetchNetworks = planName => (dispatch, getState, { getIntl }) => {
  const { formatMessage } = getIntl(getState());
  dispatch(fetchNetworksPending());
  dispatch(
    startWorkflow(
      MistralConstants.NETWORK_LIST,
      { container: planName },
      fetchNetworksFinished
    )
  ).catch(error => {
    dispatch(handleErrors(error, formatMessage(messages.fetchNetworksFailed)));
    dispatch(fetchNetworksFailed());
  });
};

export const fetchNetworksFinished = ({
  output: { network_data, message },
  state
}) => (dispatch, getState, { getIntl }) => {
  const { formatMessage } = getIntl(getState());

  if (state === 'SUCCESS') {
    const networks =
      normalize(network_data, [networkSchema]).entities.networks || {};
    dispatch(fetchNetworksSuccess(networks));
  } else {
    dispatch(
      handleErrors(message, formatMessage(messages.fetchNetworksFailed))
    );
    dispatch(fetchNetworksFailed());
  }
};

export const fetchNetworksPending = () => ({
  type: NetworksConstants.FETCH_NETWORKS_PENDING
});

export const fetchNetworksSuccess = networks => ({
  type: NetworksConstants.FETCH_NETWORKS_SUCCESS,
  payload: networks
});

export const fetchNetworksFailed = () => ({
  type: NetworksConstants.FETCH_NETWORKS_FAILED
});
