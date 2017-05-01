import { fromJS, Map } from 'immutable';

import * as selectors from '../../js/selectors/nodesAssignment';
import { Port } from '../../js/immutableRecords/nodes';
import { Role, RolesState } from '../../js/immutableRecords/roles';
import {
  Parameter,
  ParametersDefaultState
} from '../../js/immutableRecords/parameters';

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

  describe('provides getTotalUntaggedAssignedNodesCount selector', () => {
    beforeEach(function() {
      this.nodes = fromJS({
        node1: {
          uuid: 'node1',
          properties: { capabilities: 'boot_option:local' }
        },
        node2: {
          uuid: 'node2',
          properties: { capabilities: 'boot_option:local,profile:control' }
        }
      });
      this.roles = Map({
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
      });
      this.parametersByRole = Map({
        control: new Parameter({
          name: 'ControllerCount',
          default: 1
        }),
        compute: new Parameter({
          name: 'ComputeCount',
          default: 1
        })
      });
    });

    it('calculates untagged assigned nodes count', function() {
      const result = selectors.getTotalUntaggedAssignedNodesCount.resultFunc(
        this.nodes,
        this.roles,
        this.parametersByRole
      );
      expect(result).toEqual(1);
    });

    it('calculates properly when assigned count is less then tagged', function() {
      this.nodes = fromJS({
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
        this.nodes,
        this.roles,
        this.parametersByRole
      );
      expect(result).toEqual(1);
    });
  });

  describe('provides getAvailableNodesCountsByRole selector', () => {
    beforeEach(function() {
      this.availableNodes = fromJS({
        node1: {
          uuid: 'node1',
          properties: { capabilities: 'boot_option:local' }
        },
        node2: {
          uuid: 'node2',
          properties: { capabilities: 'boot_option:local,profile:control' }
        }
      });
      this.untaggedAvailableNodes = fromJS({
        node1: {
          uuid: 'node1',
          properties: { capabilities: 'boot_option:local' }
        }
      });
      this.roles = Map({
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
      });
      this.nodeCountParametersByRole = Map({
        control: new Parameter({
          name: 'ControllerCount',
          default: 1
        }),
        compute: new Parameter({
          name: 'ComputeCount',
          default: 1
        }),
        'block-storage': new Parameter({
          name: 'BlockStorageCount',
          default: 0
        })
      });
      this.totalUntaggedAssignedNodesCount = 1;
    });

    it('calculates maximum available nodes count for each role', function() {
      const result = selectors.getAvailableNodesCountsByRole.resultFunc(
        this.availableNodes,
        this.untaggedAvailableNodes,
        this.roles,
        this.nodeCountParametersByRole,
        this.totalUntaggedAssignedNodesCount
      );
      expect(result.get('control')).toEqual(1);
      expect(result.get('compute')).toEqual(1);
      expect(result.get('block-storage')).toEqual(0);
    });

    it('handles cases when assigned count is higher then actual nodes available', function() {
      this.nodeCountParametersByRole = Map({
        control: new Parameter({
          name: 'ControllerCount',
          default: 4
        }),
        compute: new Parameter({
          name: 'ComputeCount',
          default: 1
        }),
        'block-storage': new Parameter({
          name: 'BlockStorageCount',
          default: 0
        })
      });
      this.totalUntaggedAssignedNodesCount = 4;
      const result = selectors.getAvailableNodesCountsByRole.resultFunc(
        this.availableNodes,
        this.untaggedAvailableNodes,
        this.roles,
        this.nodeCountParametersByRole,
        this.totalUntaggedAssignedNodesCount
      );
      expect(result.get('control')).toEqual(1);
      expect(result.get('compute')).toEqual(0);
      expect(result.get('block-storage')).toEqual(0);
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
