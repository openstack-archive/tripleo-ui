import when from 'when';

import MistralApiService from '../../js/services/MistralApiService';
import WorkflowExecutionsActions from '../../js/actions/WorkflowExecutionsActions';
import ValidationsActions from '../../js/actions/ValidationsActions';

let createResolvingPromise = (data) => {
  return () => {
    return when.resolve(data);
  };
};

describe('fetchWorkflowExecutions action', () => {
  beforeEach(done => {
    spyOn(WorkflowExecutionsActions, 'fetchWorkflowExecutionsPending');
    spyOn(WorkflowExecutionsActions, 'fetchWorkflowExecutionsSuccess');
    spyOn(ValidationsActions, 'fetchValidations');

    const response = {
      executions: [{
        state: 'SUCCESS',
        params: '{}',
        output: '{\'status\': \'FAILED\',}',
        input: '{\'validation_name\': \'check-network-gateway\'}',
        id: '1a'
      }]
    };

    spyOn(MistralApiService, 'getWorkflowExecutions').and.callFake(
      createResolvingPromise(response)
    );

    WorkflowExecutionsActions.fetchWorkflowExecutions()(() => {}, () => {});
    setTimeout(() => { done(); }, 1);
  });

  it('dispatches appropriate actions and normalizes the response', () => {
    expect(WorkflowExecutionsActions.fetchWorkflowExecutionsPending).toHaveBeenCalled();
    expect(MistralApiService.getWorkflowExecutions).toHaveBeenCalled();
    expect(WorkflowExecutionsActions.fetchWorkflowExecutionsSuccess).toHaveBeenCalled();
    expect(ValidationsActions.fetchValidations).toHaveBeenCalled();
  });
});

describe('updateWorkflowExecution action', () => {
  beforeEach(done => {
    spyOn(WorkflowExecutionsActions, 'updateWorkflowExecutionPending');
    spyOn(WorkflowExecutionsActions, 'addWorkflowExecution');

    spyOn(MistralApiService, 'updateWorkflowExecution').and.callFake(
      createResolvingPromise()
    );

    WorkflowExecutionsActions.updateWorkflowExecution('512e',
                                                      { state: 'PAUSED' })(() => {}, () => {});
    setTimeout(() => { done(); }, 1);
  });

  it('dispatches appropriate actions', () => {
    expect(WorkflowExecutionsActions.updateWorkflowExecutionPending)
      .toHaveBeenCalledWith('512e', { state: 'PAUSED' });
    expect(MistralApiService.updateWorkflowExecution)
      .toHaveBeenCalledWith('512e', { state: 'PAUSED' });
    expect(WorkflowExecutionsActions.addWorkflowExecution).toHaveBeenCalled();
  });
});
