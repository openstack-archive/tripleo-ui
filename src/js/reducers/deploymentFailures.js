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

import { fromJS, Map } from 'immutable';

import {
  GET_DEPLOYMENT_FAILURES_PENDING,
  GET_DEPLOYMENT_FAILURES_SUCCESS,
  GET_DEPLOYMENT_FAILURES_FAILED
} from '../constants/DeploymentFailuresConstants';
import PlansConstants from '../constants/PlansConstants';
import { DeploymentFailuresState } from '../immutableRecords/deploymentFailures';

const initialState = new DeploymentFailuresState();

export const deploymentFailures = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_DEPLOYMENT_FAILURES_PENDING:
      return state.set('isFetching', true);

    case GET_DEPLOYMENT_FAILURES_SUCCESS:
      return state
        .set('loaded', true)
        .set('isFetching', false)
        .set(
          'failures',
          fromJS(payload).map(node =>
            node.map(failure => failure.getIn([1, 'msg']))
          )
        );

    case GET_DEPLOYMENT_FAILURES_FAILED:
      return state
        .set('loaded', true)
        .set('isFetching', false)
        .set('failures', Map());

    case PlansConstants.PLAN_CHOSEN:
      return initialState;

    default:
      return state;
  }
};
