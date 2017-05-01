import { getAuthTokenId, getServiceUrl } from '../../js/services/utils';
import { InitialLoginState } from '../../js/immutableRecords/login';
import { List, Map } from 'immutable';
import store from '../../js/store';

describe('utility functions', () => {
  const appState = {
    login: new InitialLoginState({
      token: Map({
        id: 123456,
        project: Map({
          id: 778899
        }),
        catalog: List([
          Map({
            name: 'nova',
            endpoints: List([
              Map({
                id: '1',
                interface: 'public',
                url: 'http://someNovaPublicUrl'
              })
            ])
          }),
          Map({
            name: 'fooservice',
            endpoints: List([
              Map({
                id: '1',
                interface: 'public',
                url: 'http://someNovaPublicUrl'
              })
            ])
          }),
          Map({
            name: 'macroservice',
            endpoints: List([
              Map({
                id: '1',
                interface: 'public',
                url: 'http://MacroPublicUrl/v1/Foo_%(project_id)s'
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
      expect(
        getServiceUrl('fooservice', null, { fooservice: 'http://FooPublicURL' })
      ).toEqual('http://FooPublicURL');
    });

    it('expands urls containing the keystone project macro', () => {
      expect(getServiceUrl('macroservice')).toEqual(
        'http://MacroPublicUrl/v1/Foo_778899'
      );
    });
  });

  describe('getAuthTokenId', () => {
    it('retrieves the Keystone Auth Token ID from login state', () => {
      expect(getAuthTokenId()).toEqual(123456);
    });
  });
});
