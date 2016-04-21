import when from 'when';

import * as utils from '../../js/services/utils';
import EnvironmentConfigurationActions from '../../js/actions/EnvironmentConfigurationActions';
import history from '../../js/history';
import TripleOApiService from '../../js/services/TripleOApiService';

// Use this to mock asynchronous functions which return a promise.
// The promise will immediately resolve with `data`.
let createResolvingPromise = (data) => {
  return () => {
    return when.resolve(data);
  };
};

describe('EnvironmentConfigurationActions', () => {
  beforeEach(() => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token');
  });

  describe('fetchEnvironmentConfiguration', () => {
    beforeEach(done => {
      spyOn(EnvironmentConfigurationActions, 'fetchEnvironmentConfigurationSuccess');
      // Mock the service call.
      spyOn(TripleOApiService, 'getPlanEnvironments').and.callFake(createResolvingPromise({
        environments: { topics: [] }
      }));
      EnvironmentConfigurationActions.fetchEnvironmentConfiguration(
        'overcloud')(() => {}, () => {}
      );
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('dispatches fetchEnvironmentConfigurationSuccess', () => {
      expect(EnvironmentConfigurationActions.fetchEnvironmentConfigurationSuccess)
        .toHaveBeenCalled();
    });
  });

  describe('updateEnvironmentConfiguration', () => {
    beforeEach(done => {
      spyOn(EnvironmentConfigurationActions, 'updateEnvironmentConfigurationPending');
      spyOn(EnvironmentConfigurationActions, 'updateEnvironmentConfigurationSuccess');
      spyOn(history, 'pushState');
      // Mock the service call.
      spyOn(TripleOApiService, 'updatePlanEnvironments').and.callFake(createResolvingPromise({
        environments: { topics: [] }
      }));
      EnvironmentConfigurationActions.updateEnvironmentConfiguration(
        'overcloud', {}, {}, '/redirect/url')(() => {}, () => {}
      );
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('dispatches updatingEnvironmentConfiguration', () => {
      expect(EnvironmentConfigurationActions.updateEnvironmentConfigurationPending)
        .toHaveBeenCalled();
    });

    it('dispatches environmentConfigurationUpdated', () => {
      expect(EnvironmentConfigurationActions.updateEnvironmentConfigurationSuccess)
        .toHaveBeenCalled();
    });

    it('redirects the page', () => {
      expect(history.pushState).toHaveBeenCalledWith(null, '/redirect/url');
    });
  });
});
