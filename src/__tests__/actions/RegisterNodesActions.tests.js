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

import shortid from 'shortid';
import { Map } from 'immutable';
import { InitialPlanState, Plan } from '../../js/immutableRecords/plans';
import { mockStore } from './utils';
import NodesActions from '../../js/actions/NodesActions';
import NotificationActions from '../../js/actions/NotificationActions';
import ValidationsActions from '../../js/actions/ValidationsActions';
import RegisterNodesActions from '../../js/actions/RegisterNodesActions';

describe('startNodesRegistration Action', () => {
  const store = mockStore({});
  const nodesToRegister = [
    {
      name: 'node1',
      pm_addr: '192.168.10.10',
      pm_user: 'admin',
      pm_password: 'pass'
    }
  ];

  it('dispatches nodesRegistrationPending', () => {
    store.dispatch(
      RegisterNodesActions.startNodesRegistration(nodesToRegister)
    );
    expect(store.getActions()).toEqual([
      RegisterNodesActions.nodesRegistrationPending()
    ]);
  });
});

describe('nodesRegistrationFinished', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1506528782622);
    shortid.generate = jest.fn(() => 'BywGCStsW');
    NodesActions.fetchNodes = jest.fn().mockReturnValue(() => {});
    ValidationsActions.runValidationGroups = jest
      .fn()
      .mockReturnValue(() => {});
  });

  it('handles successful nodes registration', () => {
    const store = mockStore({
      plans: new InitialPlanState({
        currentPlanName: 'testplan',
        plansLoaded: true,
        all: Map({
          testplan: new Plan({
            name: 'testplan'
          })
        })
      })
    });

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
      id: 'BywGCStsW',
      timestamp: 1506528782622,
      type: 'success',
      title: 'Nodes Registration Complete',
      message: 'The nodes were successfully registered.'
    };

    store.dispatch(
      RegisterNodesActions.nodesRegistrationFinished(messagePayload)
    );
    expect(NodesActions.fetchNodes).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      NodesActions.addNodes(normalizedRegisteredNodes),
      NotificationActions.notify(successNotification),
      RegisterNodesActions.nodesRegistrationSuccess()
    ]);
  });

  it('handles failed nodes registration', () => {
    const store = mockStore({
      plans: new InitialPlanState({
        currentPlanName: 'testplan',
        plansLoaded: true,
        all: Map({
          testplan: new Plan({
            name: 'testplan'
          })
        })
      })
    });

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

    store.dispatch(
      RegisterNodesActions.nodesRegistrationFinished(messagePayload)
    );
    expect(NodesActions.fetchNodes).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      NodesActions.addNodes(normalizedRegisteredNodes),
      RegisterNodesActions.nodesRegistrationFailed(errors)
    ]);
  });
});
