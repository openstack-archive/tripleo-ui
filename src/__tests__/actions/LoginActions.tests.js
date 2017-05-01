import KeystoneApiService from '../../js/services/KeystoneApiService';
import LoginActions from '../../js/actions/LoginActions';
import cookie from 'react-cookie';

let mockKeystoneAccess = {
  token: {
    id: 'someTokenIdString'
  },
  user: 'admin',
  serviceCatalog: 'service catalog',
  metadata: 'some metadata'
};

describe('LoginActions', () => {
  xit('creates action to authenticate user via keystone token', () => {
    spyOn(KeystoneApiService, 'authenticateUserViaToken');
    LoginActions.authenticateUserViaToken('someTokenIdString');
    expect(KeystoneApiService.authenticateUserViaToken).toHaveBeenCalledWith(
      'someTokenIdString'
    );
  });

  xit('creates action to login user with keystoneAccess response', () => {
    spyOn(cookie, 'save');
    LoginActions.loginUser(mockKeystoneAccess);
    expect(cookie.save).toHaveBeenCalledWith(
      'keystoneAuthTokenId',
      mockKeystoneAccess.token.id
    );
  });

  xit('creates action to logout user', () => {
    spyOn(cookie, 'remove');
    LoginActions.logoutUser();
    expect(cookie.remove).toHaveBeenCalled();
  });
});
