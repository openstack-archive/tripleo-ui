import { List, Map, OrderedMap } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import * as selectors from '../../js/selectors/registerNodes';
import { NodeToRegister, IronicNode } from '../../js/immutableRecords/nodes';

describe('registerNodes selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  const state = {
    registerNodes: Map({
      selectedNodeId: undefined,
      nodesToRegister: OrderedMap({
        1: new NodeToRegister({
          uuid: 1,
          name: 'Undefined Node',
          mac: List(),
          pm_type: 'pxe_ssh',
          valid: false
        }),
        2: new NodeToRegister({
          uuid: 2,
          name: 'Undefined Node',
          mac: List(),
          pm_type: 'pxe_ssh',
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
        pm_type: 'pxe_ssh',
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
        pm_type: 'pxe_ssh',
        pm_user: undefined,
        pm_addr: undefined,
        pm_password: undefined,
        arch: undefined,
        cpu: undefined,
        memory: undefined,
        disk: undefined
      })
    });
    expect(selectors.getIronicNodesfromNodesToRegister(state)).toEqualImmutable(expectedNodesList);
  });
});
