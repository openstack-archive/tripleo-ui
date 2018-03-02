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

import { Map } from 'immutable';

import WorkflowExecutionsConstants from '../constants/WorkflowExecutionsConstants';

const workflowExecutionTimeoutsReducer = (state = Map(), action) => {
  switch (action.type) {
    case WorkflowExecutionsConstants.SET_WORKFLOW_TIMEOUT: {
      const { executionId, timeout } = action.payload;
      return state.set(executionId, timeout);
    }
    case WorkflowExecutionsConstants.CANCEL_WORKFLOW_TIMEOUT:
      return state.delete(action.payload);
    default:
      return state;
  }
};

export default workflowExecutionTimeoutsReducer;
