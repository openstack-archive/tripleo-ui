/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import KeystoneApiService from '../../js/services/KeystoneApiService'
import LoginActions from '../../js/actions/LoginActions'
import when from 'when'

describe('KeystoneApiService', () => {
  xit('logs user in when response is received', () => {
    let mockApiRequestResponse = {
      access: {
        token: 'someToken',
        user: 'admin',
        serviceCatalog: 'service catalog',
        metadata: 'some metadata'
      }
    }
    KeystoneApiService.handleAuth(when(mockApiRequestResponse))
    // jest.runAllTicks();
    expect(LoginActions.loginUser).toBeCalledWith(mockApiRequestResponse.access)
  })

  xit('fails when request response is error', () => {
    // console.log = jest.genMockFunction();
    let expectedError = new Error('I threw some error')
    // let wrongApiRequest = jest.genMockFunction().mockImplementation(() => {
    // return when.reject(expectedError);
    // });
    // KeystoneApiService.handleAuth(when(wrongApiRequest()));
    // jest.runAllTicks();
    expect(console.error).toBeCalledWith('Error in handleAuth', expectedError) //eslint-disable-line no-console
  })
})
