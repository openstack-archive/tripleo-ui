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

import { fromJS } from 'immutable';

import WorkflowExecutionsConstants from '../constants/WorkflowExecutionsConstants';
import {
  WorkflowExecution,
  WorkflowExecutionsState
} from '../immutableRecords/workflowExecutions';

const initialState = new WorkflowExecutionsState();

export default function workflowExecutionsReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_PENDING:
      return state.set('isFetching', true);

    case WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_SUCCESS: {
      const executions = fromJS(action.payload)
        .map(execution => new WorkflowExecution(parseExecutionAttrs(execution)))
        .sortBy(execution => execution.updated_at);
      return state
        .set('executions', executions)
        .set('executionsLoaded', true)
        .set('isFetching', false);
    }

    case WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_FAILED:
      return state.set('executionsLoaded', true).set('isFetching', false);

    case WorkflowExecutionsConstants.ADD_WORKFLOW_EXECUTION:
      return state.update('executions', executions =>
        executions.set(
          action.payload.id,
          new WorkflowExecution(parseExecutionAttrs(fromJS(action.payload)))
        )
      );

    case WorkflowExecutionsConstants.UPDATE_WORKFLOW_EXECUTION_PENDING:
      return state.mergeIn(
        ['executions', action.payload.id],
        fromJS(action.payload.patch)
      );

    default:
      return state;
  }
}

const parseExecutionAttrs = execution =>
  execution.set('updated_at', fromJS(Date.parse(execution.get('updated_at'))));
