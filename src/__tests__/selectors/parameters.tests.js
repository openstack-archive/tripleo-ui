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

import * as selectors from '../../js/selectors/parameters'
import {
  Resource,
  Parameter,
  ParametersDefaultState
} from '../../js/immutableRecords/parameters'
import { Role, RolesState } from '../../js/immutableRecords/roles'

describe(' validations selectors', () => {
  const state = {
    roles: new RolesState({
      roles: Map({
        control: new Role({
          name: 'Controller',
          title: 'Controller',
          identifier: 'control'
        }),
        compute: new Role({
          name: 'Compute',
          title: 'Compute',
          identifier: 'compute'
        })
      })
    }),
    parameters: new ParametersDefaultState({
      resources: Map({
        aaa: new Resource({
          id: 'aaa',
          name: 'Root',
          resources: List(),
          parameters: List(['RootParameter1'])
        }),
        bbb: new Resource({
          id: 'bbb',
          name: 'RoleResource1',
          resources: List(['ccc']),
          parameters: List(['ControllerRoleParameter']),
          type: 'OS::TripleO::Controller'
        }),
        ccc: new Resource({
          id: 'ccc',
          name: 'NetworkConfigResource',
          resources: List(),
          parameters: List(),
          type: 'OS::TripleO::Controller::Net::SoftwareConfig'
        }),
        ddd: new Resource({
          id: 'ddd',
          name: 'ControllerServiceChain',
          resources: List(['eee']),
          parameters: List(),
          type: 'whateverTheTypeIs'
        }),
        eee: new Resource({
          id: 'eee',
          name: 'ServiceChain',
          resources: List(['fff']),
          parameters: List(),
          type: 'whateverTheTypeIs'
        }),
        fff: new Resource({
          id: 'fff',
          name: 'ControllerService1',
          resources: List(['ggg']),
          parameters: List(['Service1Parameter1', 'Service1Parameter2']),
          type: 'whateverTheTypeIs'
        }),
        ggg: new Resource({
          id: 'ggg',
          name: 'ControllerServiceNestedResource1',
          resources: List(),
          parameters: List(['Service1NestedResourceParameter1']),
          type: 'whateverTheTypeIs'
        })
      }),
      parameters: Map({
        RootParameter1: new Parameter({
          name: 'RootParameter1'
        }),
        EndpointMap: new Parameter({
          name: 'EndpointMap'
        }),
        ControllerRoleParameter: new Parameter({
          name: 'ControllerRoleParameter'
        }),
        Service1Parameter1: new Parameter({
          name: 'Service1Parameter1'
        }),
        Service1Parameter2: new Parameter({
          name: 'Service1Parameter2'
        }),
        Service1NestedResourceParameter1: new Parameter({
          name: 'Service1NestedResourceParameter1'
        })
      }),
      mistralParameters: Map()
    })
  }

  it('getParametersExclInternal', () => {
    expect(selectors.getParametersExclInternal(state).size).toEqual(5)
  })

  it('getRootParameters', () => {
    expect(selectors.getRootParameters(state).size).toEqual(1)
  })

  it('getRoleResource', () => {
    expect(selectors.getRoleResource(state, 'control').name).toEqual(
      'RoleResource1'
    )
  })

  it('getRoleParameters', () => {
    expect(selectors.getRoleParameters(state, 'control').size).toEqual(1)
  })

  it('getRoleServices', () => {
    expect(selectors.getRoleServices(state, 'control').size).toEqual(1)
  })

  it('includes nested resources parameters using _extractParameters in getRoleServices', () => {
    expect(
      selectors.getRoleServices(state, 'control').first().parameters.size
    ).toEqual(3)
  })

  it('getRoleNetworkConfig', () => {
    expect(selectors.getRoleNetworkConfig(state, 'control').name).toEqual(
      'NetworkConfigResource'
    )
  })
})
