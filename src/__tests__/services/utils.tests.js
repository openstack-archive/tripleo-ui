import { getAuthTokenId, getServiceUrl } from '../../js/services/utils';
import { InitialLoginState } from '../../js/immutableRecords/login';
import { List, Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';
import store from '../../js/store';

describe('utility functions', () => {
  const appState = {
    login: new InitialLoginState({
      keystoneAccess: Map({
        token: Map({
          id: 123456
        }),
        serviceCatalog: List([
          Map({
            name: 'nova',
            endpoints: List([
              Map({
                adminURL: 'http://someNovaAdminUrl',
                publicURL: 'http://someNovaPublicUrl'
              })
            ])
          }),
          Map({
            name: 'fooservice',
            endpoints: List([
              Map({
                publicURL: 'http://IGNOREDFooPublicUrl'
              })
            ])
          })
        ])
      }),
      loginForm: Map({
        formErrors: List(),
        formFieldErrors: Map()
      }),
      isAuthenticating: false
    })
  };

  beforeEach(() => {
    jasmine.addMatchers(matchers);
    spyOn(store, 'getState').and.returnValue(appState);
  });

  describe('getServiceUrl', () => {
    it('returns the publicURL of a service from the serviceCatalog by default', () => {
      expect(getServiceUrl('nova')).toEqual('http://someNovaPublicUrl');
    });

    it('returns another url type if specified', () => {
      expect(getServiceUrl('nova')).toEqual('http://someNovaPublicUrl');
    });

    it('gives precedence to urls made available through app.conf', () => {
      expect(getServiceUrl(
        'fooservice', null, { fooservice: 'http://FooPublicURL' })
      ).toEqual('http://FooPublicURL');
    });
  });

  describe('getAuthTokenId', () => {
    it('retrieves the Keystone Auth Token ID from login state', () => {
      expect(getAuthTokenId()).toEqual(123456);
    });
  });
});
