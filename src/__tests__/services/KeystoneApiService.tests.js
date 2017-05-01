import KeystoneApiService from '../../js/services/KeystoneApiService';
import LoginActions from '../../js/actions/LoginActions';
import when from 'when';

describe('KeystoneApiService', () => {
  xit('logs user in when response is received', () => {
    let mockApiRequestResponse = {
      access: {
        token: 'someToken',
        user: 'admin',
        serviceCatalog: 'service catalog',
        metadata: 'some metadata'
      }
    };
    KeystoneApiService.handleAuth(when(mockApiRequestResponse));
    // jest.runAllTicks();
    expect(LoginActions.loginUser).toBeCalledWith(
      mockApiRequestResponse.access
    );
  });

  xit('fails when request response is error', () => {
    // console.log = jest.genMockFunction();
    let expectedError = new Error('I threw some error');
    // let wrongApiRequest = jest.genMockFunction().mockImplementation(() => {
    // return when.reject(expectedError);
    // });
    // KeystoneApiService.handleAuth(when(wrongApiRequest()));
    // jest.runAllTicks();
    expect(console.error).toBeCalledWith('Error in handleAuth', expectedError); //eslint-disable-line no-console
  });
});
