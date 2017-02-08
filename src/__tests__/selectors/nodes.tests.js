import { fromJS, Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import * as selectors from '../../js/selectors/nodes';
import { Port } from '../../js/immutableRecords/nodes';

describe('Nodes selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

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
      all: fromJS([
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [1],
          properties: { capabilities: 'boot_option:local',
                        memory_mb: '5120',
                        cpu_arch: 'x86_64',
                        cpus: '2',
                        local_gb: '40'}
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [2],
          properties: { capabilities: 'boot_option:local,profile:control',
                        memory_mb: '5120',
                        cpu_arch: 'x86_64',
                        cpus: '2',
                        local_gb: '40' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [3],
          properties: { capabilities: 'profile:control,boot_option:local',
                        memory_mb: '5120',
                        cpu_arch: 'x86_64',
                        cpus: '2',
                        local_gb: '40' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [4],
          properties: { capabilities: 'profile:compute,boot_option:local',
                        memory_mb: '5120',
                        cpu_arch: 'x86_64',
                        cpus: '2',
                        local_gb: '40' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          portsDetail: [5],
          properties: { capabilities: '',
                        memory_mb: '5120',
                        cpu_arch: 'x86_64',
                        cpus: '2',
                        local_gb: '40' }
        }
      ])
    })
  };

  it('provides selector to list Introspected Nodes not assigned to a Role', () => {
    expect(selectors.getUnassignedAvailableNodes(state).size).toEqual(2);
  });
});
