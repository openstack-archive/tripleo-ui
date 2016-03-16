import when from 'when';

import * as utils from '../../js/services/utils';
import ParametersActions from '../../js/actions/ParametersActions';
import ParametersConstants from '../../js/constants/ParametersConstants';
import TripleOApiService from '../../js/services/TripleOApiService';


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
      parameters: {
        Description: 'lorem ipsum',
        Parameters: {},
        NestedParameters: {}
      }
    };

    beforeEach(done => {
      spyOn(ParametersActions, 'fetchParametersPending');
      spyOn(ParametersActions, 'fetchParametersSuccess');
      spyOn(ParametersActions, 'fetchParametersFailed');
      // Mock the service call.
      spyOn(TripleOApiService, 'getPlanParameters')
        .and.callFake(createResolvingPromise(responseBody));
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      ParametersActions.fetchParameters('overcloud', [ 'field1', 'field2' ])(() => {}, () => {});
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('calls the TripleO API', () => {
      expect(TripleOApiService.getPlanParameters).toHaveBeenCalledWith('overcloud');
    });

    it('dispatches fetchParametersPending', () => {
      expect(ParametersActions.fetchParametersPending).toHaveBeenCalled();
    });

    it('dispatches fetchParametersSuccess', () => {
      expect(ParametersActions.fetchParametersSuccess)
        .toHaveBeenCalledWith(responseBody.parameters);
    });

    it('does not dispatch fetchParametersFailed', () => {
      expect(ParametersActions.fetchParametersFailed).not.toHaveBeenCalled();
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
      spyOn(TripleOApiService, 'updatePlanParameters')
        .and.callFake(createRejectingPromise(error));
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      ParametersActions.updateParameters('overcloud', { foo: 'bar' })(() => {}, () => {});
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('calls the TripleO API', () => {
      expect(TripleOApiService.updatePlanParameters).toHaveBeenCalledWith(
        'overcloud', { foo: 'bar' }
      );
    });

    it('dispatches fetchParametersPending', () => {
      expect(ParametersActions.updateParametersPending).toHaveBeenCalled();
    });

    it('does not dispatch fetchParametersSuccess', () => {
      expect(ParametersActions.updateParametersSuccess).not.toHaveBeenCalled();
    });

    it('dispatches fetchParametersFailed', () => {
      expect(ParametersActions.updateParametersFailed).toHaveBeenCalledWith(
        [ { title: 'Unauthorized', message: 'Unauthorized'} ], {}
      );
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
