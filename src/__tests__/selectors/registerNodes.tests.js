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

import { List, Map, OrderedMap } from 'immutable';

import * as selectors from '../../js/selectors/registerNodes';
import { NodeToRegister, IronicNode } from '../../js/immutableRecords/nodes';

describe('registerNodes selectors', () => {
  const state = {
    registerNodes: Map({
      selectedNodeId: undefined,
      nodesToRegister: OrderedMap({
        1: new NodeToRegister({
          uuid: 1,
          name: 'Undefined Node',
          mac: List(),
          pm_type: 'pxe_ipmitool',
          valid: false
        }),
        2: new NodeToRegister({
          uuid: 2,
          name: 'Undefined Node',
          mac: List(),
          pm_type: 'pxe_ipmitool',
          valid: false
        })
      })
    })
  };

  it('provides selector to provide information if all Nodes to register are valid', () => {
    expect(selectors.allNodesToRegisterAreValid(state)).toBeFalsy();
  });

  it('provides selector to convert nodesToRegister to nodes consumable by API', () => {
    const expectedNodesList = OrderedMap({
      1: new IronicNode({
        uuid: 1,
        name: 'Undefined Node',
        mac: List(),
        pm_type: 'pxe_ipmitool',
        pm_user: undefined,
        pm_addr: undefined,
        pm_password: undefined,
        arch: undefined,
        cpu: undefined,
        memory: undefined,
        disk: undefined
      }),
      2: new IronicNode({
        uuid: 2,
        name: 'Undefined Node',
        mac: List(),
        pm_type: 'pxe_ipmitool',
        pm_user: undefined,
        pm_addr: undefined,
        pm_password: undefined,
        arch: undefined,
        cpu: undefined,
        memory: undefined,
        disk: undefined
      })
    });
    expect(selectors.getIronicNodesfromNodesToRegister(state)).toEqual(
      expectedNodesList
    );
  });
});
