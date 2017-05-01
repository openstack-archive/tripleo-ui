import { Map } from 'immutable';
import when from 'when';

import MistralApiService from '../../js/services/MistralApiService';
import ValidationsActions from '../../js/actions/ValidationsActions';
import ValidationsConstants from '../../js/constants/ValidationsConstants';
import WorkflowExecutionsActions
  from '../../js/actions/WorkflowExecutionsActions';
import {
  WorkflowExecution
} from '../../js/immutableRecords/workflowExecutions';
import * as utils from '../../js/services/utils';
import MistralConstants from '../../js/constants/MistralConstants';

let createResolvingPromise = data => {
  return () => {
    return when.resolve(data);
  };
};

describe('Validations actions', () => {
  it('should create an action for pending Validations request', () => {
    const expectedAction = {
      type: ValidationsConstants.FETCH_VALIDATIONS_PENDING
    };
    expect(ValidationsActions.fetchValidationsPending()).toEqual(
      expectedAction
    );
  });

  it('should create an action for successful Validations retrieval', () => {
    const normalizedValidations = {
      '512e': {
        description: '',
        metadata: {},
        id: '512e',
        groups: ['pre-deployment'],
        name: 'Advanced Format 512e Support'
      },
      'check-network-gateway': {
        description: '',
        metadata: {},
        id: 'check-network-gateway',
        groups: ['pre-deployment'],
        name: 'Check network_gateway on the provisioning network'
      }
    };
    const expectedAction = {
      type: ValidationsConstants.FETCH_VALIDATIONS_SUCCESS,
      payload: normalizedValidations
    };
    expect(
      ValidationsActions.fetchValidationsSuccess(normalizedValidations)
    ).toEqual(expectedAction);
  });

  it('should create an action for failed Validations request', () => {
    const expectedAction = {
      type: ValidationsConstants.FETCH_VALIDATIONS_FAILED
    };
    expect(ValidationsActions.fetchValidationsFailed()).toEqual(expectedAction);
  });
});

describe('FetchValidations action', () => {
  beforeEach(done => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token');
    spyOn(utils, 'getServiceUrl').and.returnValue('mock-url');
    spyOn(ValidationsActions, 'fetchValidationsPending');
    spyOn(ValidationsActions, 'fetchValidationsSuccess');

    const response = {
      output: '{"result": [{"id": "512e"}, {"id": "check-network-gateway"}]}'
    };
    spyOn(MistralApiService, 'runAction').and.callFake(
      createResolvingPromise(response)
    );

    ValidationsActions.fetchValidations()(() => {}, () => {});
    setTimeout(() => {
      done();
    }, 1);
  });

  it('dispatches appropriate actions and normalizes the response', () => {
    expect(ValidationsActions.fetchValidationsPending).toHaveBeenCalled();
    expect(MistralApiService.runAction).toHaveBeenCalledWith(
      MistralConstants.VALIDATIONS_LIST
    );
    expect(ValidationsActions.fetchValidationsSuccess).toHaveBeenCalled();
  });
});

describe('RunValidation action', () => {
  beforeEach(done => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token');
    spyOn(utils, 'getServiceUrl').and.returnValue('mock-url');
    spyOn(WorkflowExecutionsActions, 'addWorkflowExecution');

    const addWorkflowExecutionResponse = {
      state_info: null,
      created_at: '2016-07-19 13:22:29.588140',
      description: '',
      state: 'RUNNING',
      workflow_name: MistralConstants.VALIDATIONS_RUN,
      task_execution_id: null,
      updated_at: '2016-07-19 13:22:29.592989',
      workflow_id: 'f8b280bb-5ba2-486b-9384-ddd79300d987',
      params: '{}',
      output: '{}',
      input: `{\"validation_name\": \"check-network-gateway\",
              \"queue_name\": \"tripleo\", \"plan\": \"plan\"}`,
      id: 'dc971ab5-7f17-43d2-8944-1f0ffade502d'
    };

    spyOn(MistralApiService, 'runWorkflow').and.callFake(
      createResolvingPromise(addWorkflowExecutionResponse)
    );

    ValidationsActions.runValidation('512e', 'overcloud')(() => {}, () => {});
    setTimeout(() => {
      done();
    }, 1);
  });

  it('dispatches appropriate actions', () => {
    expect(
      MistralApiService.runWorkflow
    ).toHaveBeenCalledWith(MistralConstants.VALIDATIONS_RUN, {
      validation_name: '512e',
      plan: 'overcloud'
    });
  });
});

// TODO(jtomasek): this test compares 2 immutable records and even though they're the same
// the test resolves as failing
xdescribe('runValidationMessage action', () => {
  beforeEach(() => {
    spyOn(WorkflowExecutionsActions, 'addWorkflowExecutionFromMessage');
  });

  it('creates WorkflowExecution from message and adds it', () => {
    const messagePayload = {
      status: 'RUNNING',
      validation_name: 'check-network-gateway',
      execution: {
        input: {
          validation_name: 'check-network-gateway',
          queue_name: 'tripleo',
          plan: 'plan'
        },
        params: {},
        id: '6e610e0d-b87d-408e-8800-34de0dada52b'
      },
      plan: 'plan'
    };

    const expectedExecution = new WorkflowExecution({
      description: undefined,
      id: '6e610e0d-b87d-408e-8800-34de0dada52b',
      input: Map({
        validation_name: 'check-network-gateway',
        queue_name: 'tripleo',
        plan: 'plan'
      }),
      output: Map({
        status: 'RUNNING',
        validation_name: 'check-network-gateway',
        plan: 'plan'
      }),
      params: Map(),
      state: 'RUNNING',
      state_info: undefined,
      updated_at: undefined,
      workflow_name: MistralConstants.VALIDATIONS_RUN
    });

    ValidationsActions.runValidationMessage(messagePayload)(() => {}, () => {});
    expect(
      WorkflowExecutionsActions.addWorkflowExecutionFromMessage
    ).toHaveBeenCalledWith(expectedExecution);
  });
});
