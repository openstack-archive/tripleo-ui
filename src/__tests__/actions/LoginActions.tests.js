import KeystoneApiService from '../../js/services/KeystoneApiService';
import LoginActions from '../../js/actions/LoginActions';
import TempStorage from '../../js/services/TempStorage.js';

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
    expect(KeystoneApiService.authenticateUserViaToken).toHaveBeenCalledWith('someTokenIdString');
  });

  xit('creates action to login user with keystoneAccess response', () => {
    spyOn(TempStorage, 'setItem');
    LoginActions.loginUser(mockKeystoneAccess);
    expect(TempStorage.setItem).toHaveBeenCalledWith(
      'keystoneAuthTokenId',
      mockKeystoneAccess.token.id
    );
  });

  xit('creates action to logout user', () => {
    spyOn(TempStorage, 'removeItem');
    LoginActions.logoutUser();
    expect(TempStorage.removeItem).toHaveBeenCalled();
  });
});
