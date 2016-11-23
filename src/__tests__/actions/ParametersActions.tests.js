import when from 'when';
import uuid from 'node-uuid';

import * as utils from '../../js/services/utils';
import ParametersActions from '../../js/actions/ParametersActions';
import ParametersConstants from '../../js/constants/ParametersConstants';
import MistralApiService from '../../js/services/MistralApiService';
import MistralConstants from '../../js/constants/MistralConstants';
import { normalizeParameters } from '../../js/actions/ParametersActions';


// Use this to mock asynchronous functions which return a promise.
// The promise will immediately resolve with `data`.
const createResolvingPromise = (data) => {
  return () => {
    return when.resolve(data);
  };
};

const createRejectingPromise = (error) => {
  return () => {
    return when.reject(error);
  };
};

describe('ParametersActions', () => {
  beforeEach(() => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token');
  });

  describe('fetchParametersPending', () => {
    it('returns ParametersConstants.FETCH_PARAMETERS_PENDING', () => {
      expect(ParametersActions.fetchParametersPending()).toEqual({
        type: ParametersConstants.FETCH_PARAMETERS_PENDING
      });
    });
  });

  describe('fetchParametersSuccess', () => {
    it('returns ParametersConstants.FETCH_PARAMETERS_SUCCESS', () => {
      expect(ParametersActions.fetchParametersSuccess({ foo: 'bar' })).toEqual({
        type: ParametersConstants.FETCH_PARAMETERS_SUCCESS,
        payload: { foo: 'bar' }
      });
    });
  });

  describe('fetchParameters (success)', () => {
    let responseBody = {
      output: `{
        "result": {
          "heat_resource_tree": {},
          "mistral_environment_parameters": {}
        }
      }`
    };

    beforeEach(done => {
      spyOn(ParametersActions, 'fetchParametersPending');
      spyOn(ParametersActions, 'fetchParametersSuccess');
      spyOn(ParametersActions, 'fetchParametersFailed');
      spyOn(uuid, 'v4').and.returnValue('aaa');
      // Mock the service call.
      spyOn(MistralApiService, 'runAction')
        .and.callFake(createResolvingPromise(responseBody));
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      ParametersActions.fetchParameters('overcloud')(() => {}, () => {});
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('calls the Mistral API', () => {
      expect(MistralApiService.runAction).toHaveBeenCalledWith(MistralConstants.PARAMETERS_GET,
                                                               { container: 'overcloud' });
    });

    it('dispatches fetchParametersPending', () => {
      expect(ParametersActions.fetchParametersPending).toHaveBeenCalled();
    });

    it('dispatches fetchParametersSuccess', () => {
      let expectedResources = {
        aaa: { id: 'aaa', name: 'Root' }
      };
      expect(ParametersActions.fetchParametersSuccess)
        .toHaveBeenCalledWith({ parameters: undefined,
                                resources: expectedResources,
                                mistralParameters: {} });
    });

    it('does not dispatch fetchParametersFailed', () => {
      expect(ParametersActions.fetchParametersFailed).not.toHaveBeenCalled();
    });
  });

  describe('normalizeParameters', () => {
    it('normalizes resourceTree', () => {
      let resourceTree = {
        Description: 'some description',
        NestedParameters: {
          CephStorage: {
            Description: 'No description',
            Parameters: {},
            Type: 'OS::Heat::ResourceGroup'
          }
        },
        Parameters: {
          BlockStorageCount: {
            Default: 0,
            Description: 'Number of BlockStorage nodes to deploy',
            Label: 'BlockStorageCount',
            NoEcho: 'false',
            Type: 'Number'
          }
        }
      };
      /*
        {
          resources: {
            'randomUUID1': {
              name: Root,
              id: randomUUID1,
              description: 'some description',
              nestedParameters: ['randomUUID2'],
              parameters: ['BlockStorageCount']
            },
            'randomUUID2': {
              name: Root,
              id: randomUUID1,
              description: 'No description',
              nestedParameters: [],
              parameters: []
              type: 'OS::Heat::ResourceGroup'
            }
          }
          parameters: {
            BlockStorageCount: {
              name: 'BlockStorageCount'
              default: 0,
              description: 'Number of BlockStorage nodes to deploy',
              label: 'BlockStorageCount',
              noEcho: 'false',
              type: 'Number'
            }
          }
        }
      */
      let normalizedResult = normalizeParameters(resourceTree);
      expect(Object.keys(normalizedResult)).toEqual(['resources', 'parameters']);
      expect(Object.keys(normalizedResult.resources).length).toEqual(2);
      expect(Object.keys(normalizedResult.parameters).length).toEqual(1);
      expect(normalizedResult.parameters.BlockStorageCount.type).toEqual('Number');
    });
  });

  describe('updateParameters (fail)', () => {
    const error = {
      status: 401,
      responseText: '{ "error": { "message": "Unauthorized" } }'
    };

    beforeEach(done => {
      spyOn(ParametersActions, 'updateParametersPending');
      spyOn(ParametersActions, 'updateParametersSuccess');
      spyOn(ParametersActions, 'updateParametersFailed');
      // Mock the service call.
      spyOn(MistralApiService, 'runAction')
        .and.callFake(createRejectingPromise(error));
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      ParametersActions.updateParameters('overcloud', { foo: 'bar' })(() => {}, () => {});
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('calls the Mistral API', () => {
      expect(MistralApiService.runAction).toHaveBeenCalledWith(
        MistralConstants.PARAMETERS_UPDATE,
        {
          container: 'overcloud',
          parameters: { foo: 'bar' }
        }
      );
    });

    it('dispatches updateParametersPending', () => {
      expect(ParametersActions.updateParametersPending).toHaveBeenCalled();
    });

    it('does not dispatch updateParametersSuccess', () => {
      expect(ParametersActions.updateParametersSuccess).not.toHaveBeenCalled();
    });

    it('dispatches updateParametersFailed', () => {
      expect(ParametersActions.updateParametersFailed).toHaveBeenCalled();
    });
  });

  describe('updateParametersFailed', () => {
    it('returns ParametersConstants.UPDATE_PARAMETERS_FAILED', () => {
      expect(ParametersActions.updateParametersFailed(
        [{ foo: 'bar' }], { field1: 'fail' })
      ).toEqual({
        type: ParametersConstants.UPDATE_PARAMETERS_FAILED,
        payload: { formErrors: [{ foo: 'bar' }], formFieldErrors: { field1: 'fail' } }
      });
    });
  });
});
