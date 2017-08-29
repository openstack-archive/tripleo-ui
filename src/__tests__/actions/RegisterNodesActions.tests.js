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

import when from 'when'
import { Map } from 'immutable'

import { InitialPlanState, Plan } from '../../js/immutableRecords/plans'
import MistralApiService from '../../js/services/MistralApiService'
import mockHistory from '../mocks/history'
import { mockGetIntl } from './utils'
import RegisterNodesActions from '../../js/actions/RegisterNodesActions'
import NodesActions from '../../js/actions/NodesActions'
import NotificationActions from '../../js/actions/NotificationActions'
import * as utils from '../../js/services/utils'
import { IronicNode } from '../../js/immutableRecords/nodes'

let createResolvingPromise = data => {
  return () => {
    return when.resolve(data)
  }
}

describe('Asynchronous Register Nodes Action', () => {
  beforeEach(done => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token')
    spyOn(utils, 'getServiceUrl').and.returnValue('mock-url')
    spyOn(RegisterNodesActions, 'startNodesRegistrationPending')
    spyOn(RegisterNodesActions, 'startNodesRegistrationSuccess')
    spyOn(RegisterNodesActions, 'startNodesRegistrationFailed')
    // Mock the service call.
    spyOn(MistralApiService, 'runWorkflow').and.callFake(
      createResolvingPromise({ state: 'RUNNING' })
    )

    const nodesToRegister = Map({
      1: new IronicNode({
        uuid: 1
      })
    })
    // Call the action creator and the resulting action.
    // In this case, dispatch and getState are just empty placeHolders.
    RegisterNodesActions.startNodesRegistration(nodesToRegister)(
      () => {},
      () => {}
    )
    // Call `done` with a minimal timeout.
    setTimeout(() => {
      done()
    }, 1)
  })

  it('dispatches startNodesRegistrationPending', () => {
    expect(
      RegisterNodesActions.startNodesRegistrationPending
    ).toHaveBeenCalled()
  })

  it('dispatches startNodesRegistrationSuccess', () => {
    expect(
      RegisterNodesActions.startNodesRegistrationSuccess
    ).toHaveBeenCalledWith()
  })
})

describe('nodesRegistrationFinished', () => {
  beforeEach(() => {
    spyOn(NodesActions, 'addNodes')
    spyOn(NodesActions, 'fetchNodes')
  })

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
    }
    const normalizedRegisteredNodes = {
      1: { uuid: 1, name: 'node1' },
      2: { uuid: 2, name: 'node2' }
    }
    const successNotification = {
      type: 'success',
      title: 'Nodes Registration Complete',
      message: 'The nodes were successfully registered.'
    }

    spyOn(NotificationActions, 'notify')
    spyOn(RegisterNodesActions, 'nodesRegistrationSuccess')

    RegisterNodesActions.nodesRegistrationFinished(messagePayload, mockHistory)(
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
        }
      },
      mockGetIntl
    )

    expect(NodesActions.addNodes).toHaveBeenCalledWith(
      normalizedRegisteredNodes
    )
    expect(NodesActions.fetchNodes).toHaveBeenCalledWith()
    expect(NotificationActions.notify).toHaveBeenCalledWith(successNotification)
    expect(RegisterNodesActions.nodesRegistrationSuccess).toHaveBeenCalled()
    expect(mockHistory.push).toHaveBeenCalledWith('/nodes')
  })

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
    }
    const normalizedRegisteredNodes = {
      1: { uuid: 1, name: 'node1' },
      2: { uuid: 2, name: 'node2' }
    }
    const errors = [
      {
        title: 'Nodes Registration Failed',
        message: ['Nodes registration failed for some reason']
      }
    ]

    spyOn(RegisterNodesActions, 'nodesRegistrationFailed')

    RegisterNodesActions.nodesRegistrationFinished(messagePayload, mockHistory)(
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
        }
      },
      mockGetIntl
    )

    expect(mockHistory.push).toHaveBeenCalledWith('/nodes/register')
    expect(NodesActions.addNodes).toHaveBeenCalledWith(
      normalizedRegisteredNodes
    )
    expect(NodesActions.fetchNodes).toHaveBeenCalledWith()
    expect(RegisterNodesActions.nodesRegistrationFailed).toHaveBeenCalledWith(
      errors
    )
  })
})
