import { fromJS, Map } from 'immutable';

import WorkflowExecutionsConstants from '../constants/WorkflowExecutionsConstants';
import { WorkflowExecution } from '../immutableRecords/workflowExecutions';

const initialState = Map({
  executionsLoaded: false,
  isFetchingExecutions: false,
  executions: Map()
});

export default function workflowExecutionsReducer(state = initialState, action) {
  switch(action.type) {

  case WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_PENDING:
    return state.set('isFetchingExecutions', true);

  case WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_SUCCESS: {
    const executions = fromJS(action.payload).map(execution =>
                         new WorkflowExecution(parseExecutionJsonAttrs(execution)));
    return state.set('executions', executions)
                .set('executionsLoaded', true)
                .set('isFetching', false);
  }

  case WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_FAILED:
    return state.set('executionsLoaded', true)
                .set('isFetching', false);

  default:
    return state;

  }
}

/**
 * Executions properties input, output and params are JSON strings, this function parses them into
 * objects
 */
const parseExecutionJsonAttrs = execution =>
  execution.set('input', fromJS(JSON.parse(execution.get('input'))))
           .set('output', fromJS(JSON.parse(execution.get('output'))))
           .set('params', fromJS(JSON.parse(execution.get('params'))));
