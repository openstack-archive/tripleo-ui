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

import { fromJS, Map } from 'immutable';

import * as selectors from '../../js/selectors/nodesAssignment';
import { Flavor } from '../../js/immutableRecords/flavors';
import { Port } from '../../js/immutableRecords/nodes';
import { Role, RolesState } from '../../js/immutableRecords/roles';
import {
  Parameter,
  ParametersDefaultState
} from '../../js/immutableRecords/parameters';
import { StacksState } from '../../js/immutableRecords/stacks';
import { InitialPlanState } from '../../js/immutableRecords/plans';

describe('Nodes Assignment selectors', () => {
  const state = {
    nodes: Map({
      isFetching: false,
      dataOperationInProgress: false,
      allFilter: '',
      registeredFilter: '',
      introspectedFilter: '',
      deployedFilter: '',
      maintenanceFilter: '',
      ports: Map({
        1: new Port({
          uuid: '1',
          address: '11:11:11:11:11:11'
        }),
        2: new Port({
          uuid: '2',
          address: '22:22:22:22:22:22'
        }),
        3: new Port({
          uuid: '3',
          address: '33:33:33:33:33:33'
        }),
        4: new Port({
          uuid: '4',
          address: '44:44:44:44:44:44'
        }),
        5: new Port({
          uuid: '5',
          address: '55:55:55:55:55:55'
        })
      }),
      all: fromJS({
        node1: {
          uuid: 'node1',
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [1],
          properties: {
            capabilities: 'boot_option:local',
            memory_mb: '5120',
            cpu_arch: 'x86_64',
            cpus: '2',
            local_gb: '40'
          }
        },
        node2: {
          uuid: 'node2',
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [2],
          properties: {
            capabilities: 'boot_option:local,profile:control',
            memory_mb: '5120',
            cpu_arch: 'x86_64',
            cpus: '2',
            local_gb: '40'
          }
        },
        node3: {
          uuid: 'node3',
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [3],
          properties: {
            capabilities: 'profile:control,boot_option:local',
            memory_mb: '5120',
            cpu_arch: 'x86_64',
            cpus: '2',
            local_gb: '40'
          }
        },
        node4: {
          uuid: 'node4',
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [4],
          properties: {
            capabilities: 'profile:compute,boot_option:local',
            memory_mb: '5120',
            cpu_arch: 'x86_64',
            cpus: '2',
            local_gb: '40'
          }
        },
        node5: {
          uuid: 'node5',
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [5],
          properties: {
            capabilities: '',
            memory_mb: '5120',
            cpu_arch: 'x86_64',
            cpus: '2',
            local_gb: '40'
          }
        }
      })
    }),
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
        }),
        'block-storage': new Role({
          name: 'BlockStorage',
          title: 'Block Storage',
          identifier: 'block-storage'
        })
      })
    }),
    plans: new InitialPlanState({
      all: Map()
    }),
    stacks: new StacksState({
      stacks: Map()
    }),
    parameters: new ParametersDefaultState({
      parameters: Map({
        ControllerCount: new Parameter({
          name: 'ControllerCount',
          default: 2
        }),
        ComputeCount: new Parameter({
          name: 'ComputeCount',
          default: 1
        })
      })
    })
  };

  it('provides selector to list Introspected Nodes not assigned to a Role', () => {
    expect(selectors.getUntaggedAvailableNodes(state).size).toEqual(2);
  });

  describe('getFlavorParametersByRole', () => {
    const roles = Map({
      Controller: new Role({
        name: 'Controller'
      }),
      Compute: new Role({
        name: 'Compute'
      }),
      BlockStorage: new Role({
        name: 'BlockStorage'
      })
    });
    const parameters = Map({
      OvercloudControllerFlavor: new Parameter({
        name: 'OvercloudControllerFlavor',
        default: 'control'
      }),
      OvercloudComputeFlavor: new Parameter({
        name: 'OvercloudComputeFlavor',
        default: 'compute'
      }),
      OvercloudBlockStorageFlavor: new Parameter({
        name: 'OvercloudBlockStorageFlavor',
        default: 'block-storage'
      }),
      AnotherParameter1: new Parameter({
        name: 'AnotherParameter1',
        default: 'value 1'
      }),
      AnotherParameter2: new Parameter({
        name: 'AnotherParameter2',
        default: 'value 2'
      })
    });

    it('provides flavor parameters by role', () => {
      const result = selectors.getFlavorParametersByRole.resultFunc(
        roles,
        parameters
      );
      expect(result.get('Controller')).toEqual(
        new Parameter({
          name: 'OvercloudControllerFlavor',
          default: 'control'
        })
      );
      expect(result.get('Compute')).toEqual(
        new Parameter({
          name: 'OvercloudComputeFlavor',
          default: 'compute'
        })
      );
      expect(result.get('BlockStorage')).toEqual(
        new Parameter({
          name: 'OvercloudBlockStorageFlavor',
          default: 'block-storage'
        })
      );
    });
  });

  describe('getFlavorProfilesByRole', () => {
    const flavors = Map({
      control: new Flavor({
        id: 'aaaa',
        name: 'control',
        extra_specs: Map({
          'capabilities:profile': 'control'
        })
      }),
      compute: new Flavor({
        id: 'bbbb',
        name: 'compute',
        extra_specs: Map({
          'capabilities:profile': 'compute'
        })
      }),
      'block-storage': new Flavor({
        id: 'cccc',
        name: 'block-storage',
        extra_specs: Map({
          'capabilities:profile': 'block-storage'
        })
      })
    });
    const flavorParametersByRole = Map({
      Controller: new Parameter({
        name: 'OvercloudControllerFlavor',
        default: 'control'
      }),
      Compute: new Parameter({
        name: 'OvercloudComputeFlavor',
        default: 'compute'
      }),
      BlockStorage: new Parameter({
        name: 'OvercloudBlockStorageFlavor',
        default: 'block-storage'
      })
    });

    it('provides flavor profiles by role', () => {
      const result = selectors.getFlavorProfilesByRole.resultFunc(
        flavorParametersByRole,
        flavors
      );
      expect(result.get('Controller')).toEqual('control');
      expect(result.get('Compute')).toEqual('compute');
      expect(result.get('BlockStorage')).toEqual('block-storage');
    });
  });

  describe('getTaggedNodesCountByRole', () => {
    const availableNodes = fromJS({
      node1: {
        uuid: 'node1',
        properties: { capabilities: 'boot_option:local' }
      },
      node2: {
        uuid: 'node2',
        properties: { capabilities: 'boot_option:local,profile:control' }
      }
    });
    const flavorProfilesByRole = Map({
      Controller: 'control',
      Compute: 'compute',
      BlockStorage: 'block-storage'
    });

    it('calculates tagged node counts by role', () => {
      const result = selectors.getTaggedNodesCountByRole.resultFunc(
        availableNodes,
        flavorProfilesByRole
      );
      expect(result.get('Controller')).toEqual(1);
      expect(result.get('Compute')).toEqual(0);
      expect(result.get('BlockStorage')).toEqual(0);
    });
  });

  describe('provides getTotalUntaggedAssignedNodesCount selector', () => {
    const nodes = fromJS({
      node1: {
        uuid: 'node1',
        properties: { capabilities: 'boot_option:local' }
      },
      node2: {
        uuid: 'node2',
        properties: { capabilities: 'boot_option:local,profile:control' }
      }
    });
    const roles = Map({
      Controller: new Role({
        name: 'Controller',
        identifier: 'control'
      }),
      Compute: new Role({
        name: 'Compute',
        identifier: 'compute'
      }),
      BlockStorage: new Role({
        name: 'BlockStorage',
        identifier: 'block-storage'
      })
    });
    const taggedNodesCountByRole = Map({
      Controller: 1,
      Compute: 0,
      BlockStorage: 0
    });
    const parametersByRole = Map({
      Controler: new Parameter({
        name: 'ControllerCount',
        default: 1
      }),
      Compute: new Parameter({
        name: 'ComputeCount',
        default: 1
      })
    });

    it('calculates untagged assigned nodes count', function() {
      const result = selectors.getTotalUntaggedAssignedNodesCount.resultFunc(
        nodes,
        roles,
        taggedNodesCountByRole,
        parametersByRole
      );
      expect(result).toEqual(1);
    });

    it('calculates properly when assigned count is less then tagged', function() {
      const nodes = fromJS({
        node1: {
          uuid: 'node1',
          properties: { capabilities: 'boot_option:local' }
        },
        node2: {
          uuid: 'node2',
          properties: { capabilities: 'boot_option:local,profile:control' }
        },
        node3: {
          uuid: 'node3',
          properties: { capabilities: 'boot_option:local,profile:control' }
        }
      });
      const result = selectors.getTotalUntaggedAssignedNodesCount.resultFunc(
        nodes,
        roles,
        taggedNodesCountByRole,
        parametersByRole
      );
      expect(result).toEqual(1);
    });
  });

  describe('provides getAvailableNodesCountsByRole selector', () => {
    const availableNodes = fromJS({
      node1: {
        uuid: 'node1',
        properties: { capabilities: 'boot_option:local' }
      },
      node2: {
        uuid: 'node2',
        properties: { capabilities: 'boot_option:local,profile:control' }
      }
    });
    const untaggedAvailableNodes = fromJS({
      node1: {
        uuid: 'node1',
        properties: { capabilities: 'boot_option:local' }
      }
    });
    const roles = Map({
      Controller: new Role({
        name: 'Controller',
        title: 'Controller',
        identifier: 'control'
      }),
      Compute: new Role({
        name: 'Compute',
        title: 'Compute',
        identifier: 'compute'
      }),
      BlockStorage: new Role({
        name: 'BlockStorage',
        title: 'Block Storage',
        identifier: 'block-storage'
      })
    });
    const taggedNodesCountByRole = Map({
      Controller: 1,
      Compute: 0,
      BlockStorage: 0
    });
    const nodeCountParametersByRole = Map({
      Controller: new Parameter({
        name: 'ControllerCount',
        default: 1
      }),
      Compute: new Parameter({
        name: 'ComputeCount',
        default: 1
      }),
      BlockStorage: new Parameter({
        name: 'BlockStorageCount',
        default: 0
      })
    });
    const totalUntaggedAssignedNodesCount = 1;

    it('calculates maximum available nodes count for each role', function() {
      const result = selectors.getAvailableNodesCountsByRole.resultFunc(
        availableNodes,
        untaggedAvailableNodes,
        roles,
        taggedNodesCountByRole,
        nodeCountParametersByRole,
        totalUntaggedAssignedNodesCount
      );
      expect(result.get('Controller')).toEqual(1);
      expect(result.get('Compute')).toEqual(1);
      expect(result.get('BlockStorage')).toEqual(0);
    });

    it('handles cases when assigned count is higher then actual nodes available', function() {
      const nodeCountParametersByRole = Map({
        Controller: new Parameter({
          name: 'ControllerCount',
          default: 4
        }),
        Compute: new Parameter({
          name: 'ComputeCount',
          default: 1
        }),
        BlockStorage: new Parameter({
          name: 'BlockStorageCount',
          default: 0
        })
      });
      const totalUntaggedAssignedNodesCount = 4;
      const result = selectors.getAvailableNodesCountsByRole.resultFunc(
        availableNodes,
        untaggedAvailableNodes,
        roles,
        taggedNodesCountByRole,
        nodeCountParametersByRole,
        totalUntaggedAssignedNodesCount
      );
      expect(result.get('Controller')).toEqual(1);
      expect(result.get('Compute')).toEqual(0);
      expect(result.get('BlockStorage')).toEqual(0);
    });
  });

  it('getRoleCountParameterByRole', () => {
    const nodeCountParametersByRole = selectors.getNodeCountParametersByRole(
      state
    );
    expect(nodeCountParametersByRole.get('control').default).toEqual(2);
    expect(nodeCountParametersByRole.get('compute').default).toEqual(1);
  });

  it('getTotalAssignedNodesCount', () => {
    const totalAssignedNodesCount = selectors.getTotalAssignedNodesCount(state);
    expect(totalAssignedNodesCount).toEqual(3);
  });
});
