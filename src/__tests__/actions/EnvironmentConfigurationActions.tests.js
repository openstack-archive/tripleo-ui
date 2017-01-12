import when from 'when';

import * as utils from '../../js/services/utils';
import EnvironmentConfigurationActions from '../../js/actions/EnvironmentConfigurationActions';
import { browserHistory } from 'react-router';
import MistralApiService from '../../js/services/MistralApiService';
import { mockGetIntl } from './utils';

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
      spyOn(MistralApiService, 'runAction').and.callFake(createResolvingPromise({
        output: `{\"result\": {\"Basic Configuration\": {\"environment_groups\": [{\"description\":
                 \"Enable basic configuration required for OpenStack Deployment\", \"environments\":
                 [{\"enabled\": true, \"description\": null, \"file\":
                 \"overcloud-resource-registry-puppet.yaml\", \"title\":
                 \"Default Configuration\"}], \"title\": null}], \"description\": null,
                 \"title\": \"Basic Configuration\"}}}`
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
      spyOn(browserHistory, 'push');
      // Mock the service call.
      spyOn(MistralApiService, 'runAction').and.callFake(createResolvingPromise({
        output: `{\"result\": {\"template\": \"overcloud.yaml\", \"environments\": [{\"path\":
                 \"overcloud-resource-registry-puppet.yaml\"}, {\"path\":
                 \"environments/puppet-pacemaker.yaml\"}, {\"path\":
                 \"environments/network-isolation.yaml\"}]}}`
      }));
      EnvironmentConfigurationActions.updateEnvironmentConfiguration(
        'overcloud', {}, {}, '/redirect/url')(() => {}, () => {}, mockGetIntl
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
      expect(browserHistory.push).toHaveBeenCalledWith('/redirect/url');
    });
  });
});
