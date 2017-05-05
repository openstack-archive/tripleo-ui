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

import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Login from '../../js/components/Login';
import LoginActions from '../../js/actions/LoginActions';

let loginInstance;

describe('Login component', () => {
  describe('When user is not logged in', () => {
    beforeEach(() => {
      loginInstance = TestUtils.renderIntoDocument(<Login/>);
    });

    xit('should render with expected markup', () => {
      expect(TestUtils.isCompositeComponent(loginInstance)).toBeTruthy();

      let inputs = TestUtils.scryRenderedDOMComponentsWithTag(loginInstance, 'input');
      expect(inputs.length).toBe(2);
      expect(inputs[0].id).toBe('username');
      expect(inputs[1].id).toBe('password');

      let submitButton = TestUtils.findRenderedDOMComponentWithTag(loginInstance, 'button');
      expect(submitButton.textContent).toBe('Log In');
      expect(submitButton.type).toBe('submit');
    });

    xit('updates the component state when user fills the form', function() {
      let inputs = TestUtils.scryRenderedDOMComponentsWithTag(loginInstance, 'input');
      TestUtils.Simulate.change(inputs[0], { target: { value: 'myusername' }});
      TestUtils.Simulate.change(inputs[1], { target: { value: 'somepassword' }});
      expect(loginInstance.state.username).toEqual('myusername');
      expect(loginInstance.state.password).toEqual('somepassword');
    });

    xit('should handle the login when user submits the login form', () => {
      let loginForm = TestUtils.findRenderedDOMComponentWithTag(loginInstance, 'form');
      TestUtils.Simulate.submit(loginForm);
      expect(LoginActions.authenticateUser).toBeCalled();
    });
  });

  describe('When user is logged in', () => {
    xit('redirects to nextPath when user is logged in and visits login page', () => {
      loginInstance = new Login();
      loginInstance.context = {
        router: {
          getCurrentQuery() {
            return {
              nextPath: 'nodes'
            };
          }
        }
      };
      // loginInstance.context.router.transitionTo = jest.genMockFunction();
      loginInstance.componentWillMount();
      expect(loginInstance.context.router.transitionTo).toBeCalledWith('nodes');
    });
  });
});
