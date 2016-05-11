import { Map, OrderedMap } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import * as selectors from '../../js/selectors/registerNodes';
import { NodeToRegister } from '../../js/immutableRecords/nodes';

describe('registerNodes selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  const state = {
    registerNodes: Map({
      selectedNodeId: undefined,
      nodesToRegister: OrderedMap({
        1: new NodeToRegister({
          id: 2,
          name: 'Undefined Node',
          nicMacAddresses: '',
          driver: 'pxe_ssh',
          driver_info: Map(),
          valid: false
        }),
        2: new NodeToRegister({
          id: 2,
          name: 'Undefined Node',
          nicMacAddresses: '',
          driver: 'pxe_ssh',
          driver_info: Map(),
          valid: false
        })
      })
    })
  };

  it('provides selector to provide information if all Nodes to register are valid', () => {
    expect(selectors.allNodesToRegisterAreValid(state)).toBeFalsy();
  });
});
