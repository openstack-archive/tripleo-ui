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

import { List, Map } from 'immutable'

import { Validation } from '../../js/immutableRecords/validations'
import ValidationsConstants from '../../js/constants/ValidationsConstants'
import validationsReducer from '../../js/reducers/validationsReducer'

describe('validationsReducer', () => {
  const initialState = Map({
    validationsLoaded: false,
    isFetching: false,
    validations: Map()
  })

  const updatedState = Map({
    isFetching: false,
    validationsLoaded: true,
    validations: Map({
      '512e': new Validation({
        description: '',
        groups: List(['pre-deployment']),
        id: '512e',
        metadata: Map(),
        name: 'Advanced Format 512e Support',
        results: Map(),
        status: undefined,
        stateInfo: undefined
      }),
      'check-network-gateway': new Validation({
        description: '',
        groups: List(['pre-deployment']),
        id: 'check-network-gateway',
        metadata: Map(),
        name: 'Check network_gateway on the provisioning network',
        results: Map(),
        status: undefined,
        stateInfo: undefined
      })
    })
  })

  it('should return initial state', () => {
    expect(validationsReducer(initialState, {})).toEqual(initialState)
  })

  it('should handle FETCH_VALIDATIONS_PENDING', () => {
    const action = {
      type: ValidationsConstants.FETCH_VALIDATIONS_PENDING
    }
    const newState = validationsReducer(initialState, action)
    expect(newState.get('isFetching')).toEqual(true)
  })

  it('should handle FETCH_VALIDATIONS_SUCCESS', () => {
    const action = {
      type: ValidationsConstants.FETCH_VALIDATIONS_SUCCESS,
      payload: {
        '512e': {
          description: '',
          metadata: {},
          id: '512e',
          groups: ['pre-deployment'],
          name: 'Advanced Format 512e Support'
        },
        'check-network-gateway': {
          description: '',
          metadata: {},
          id: 'check-network-gateway',
          groups: ['pre-deployment'],
          name: 'Check network_gateway on the provisioning network'
        }
      }
    }
    const newState = validationsReducer(initialState, action)
    expect(newState.get('validations')).toEqual(updatedState.get('validations'))
  })

  it('should handle FETCH_VALIDATIONS_FAILED', () => {
    const action = {
      type: ValidationsConstants.FETCH_VALIDATIONS_FAILED
    }
    const newState = validationsReducer(initialState, action)
    expect(newState.get('isFetching')).toEqual(false)
    expect(newState.get('validationsLoaded')).toEqual(true)
  })
})
