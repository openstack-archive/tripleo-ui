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

import { Map } from 'immutable';
// TODO(jtomasek): remove this import when store is correctly mocked
import store from '../../js/store'; // eslint-disable-line no-unused-vars
import { InitialPlanState, Plan } from '../../js/immutableRecords/plans';
import { mockGetIntl } from './utils';
import RegisterNodesActions from '../../js/actions/RegisterNodesActions';
import NodesActions from '../../js/actions/NodesActions';
import NotificationActions from '../../js/actions/NotificationActions';

describe('startNodesRegistration Action', () => {
  beforeEach(() => {
    spyOn(RegisterNodesActions, 'nodesRegistrationPending');
    const dispatch = () => {};

    const nodesToRegister = [
      {
        name: 'node1',
        pm_addr: '192.168.10.10',
        pm_user: 'admin',
        pm_password: 'pass'
      }
    ];
    // Call the action creator and the resulting action.
    // In this case, dispatch and getState are just empty placeHolders.
    RegisterNodesActions.startNodesRegistration(nodesToRegister)(dispatch);
    // Call `done` with a minimal timeout.
  });

  it('dispatches nodesRegistrationPending', () => {
    expect(RegisterNodesActions.nodesRegistrationPending).toHaveBeenCalled();
  });
});

describe('nodesRegistrationFinished', () => {
  beforeEach(() => {
    spyOn(NodesActions, 'addNodes');
    spyOn(NodesActions, 'fetchNodes');
  });

  it('handles successful nodes registration', () => {
    const messagePayload = {
      status: 'SUCCESS',
      registered_nodes: [
        {
          uuid: 1,
          name: 'node1'
        },
        {
          uuid: 2,
          name: 'node2'
        }
      ]
    };
    const normalizedRegisteredNodes = {
      1: { uuid: 1, name: 'node1' },
      2: { uuid: 2, name: 'node2' }
    };
    const successNotification = {
      type: 'success',
      title: 'Nodes Registration Complete',
      message: 'The nodes were successfully registered.'
    };

    spyOn(NotificationActions, 'notify');
    spyOn(RegisterNodesActions, 'nodesRegistrationSuccess');

    RegisterNodesActions.nodesRegistrationFinished(messagePayload)(
      () => {},
      () => {
        return {
          plans: new InitialPlanState({
            currentPlanName: 'testplan',
            plansLoaded: true,
            all: Map({
              testplan: new Plan({
                name: 'testplan'
              })
            })
          })
        };
      },
      mockGetIntl
    );

    expect(NodesActions.addNodes).toHaveBeenCalledWith(
      normalizedRegisteredNodes
    );
    expect(NodesActions.fetchNodes).toHaveBeenCalledWith();
    expect(NotificationActions.notify).toHaveBeenCalledWith(
      successNotification
    );
    expect(RegisterNodesActions.nodesRegistrationSuccess).toHaveBeenCalled();
  });

  it('handles failed nodes registration', () => {
    const messagePayload = {
      status: 'FAILED',
      message: {
        message: [
          {
            result: 'Nodes registration failed for some reason'
          }
        ]
      },
      registered_nodes: [
        {
          uuid: 1,
          name: 'node1'
        },
        {
          uuid: 2,
          name: 'node2'
        }
      ]
    };
    const normalizedRegisteredNodes = {
      1: { uuid: 1, name: 'node1' },
      2: { uuid: 2, name: 'node2' }
    };
    const errors = [
      {
        title: 'Nodes Registration Failed',
        message: ['Nodes registration failed for some reason']
      }
    ];

    spyOn(RegisterNodesActions, 'nodesRegistrationFailed');

    RegisterNodesActions.nodesRegistrationFinished(messagePayload)(
      () => {},
      () => {
        return {
          plans: new InitialPlanState({
            currentPlanName: 'testplan',
            plansLoaded: true,
            all: Map({
              testplan: new Plan({
                name: 'testplan'
              })
            })
          })
        };
      },
      mockGetIntl
    );

    expect(NodesActions.addNodes).toHaveBeenCalledWith(
      normalizedRegisteredNodes
    );
    expect(NodesActions.fetchNodes).toHaveBeenCalledWith();
    expect(RegisterNodesActions.nodesRegistrationFailed).toHaveBeenCalledWith(
      errors
    );
  });
});
