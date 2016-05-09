import { fromJS, Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import * as selectors from '../../js/selectors/nodes';

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
      all: fromJS([
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          properties: { capabilities: 'boot_option:local',
                        memory_mb: '5120',
                        cpu_arch: 'x86_64',
                        cpus: '2',
                        local_gb: '40'}
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          properties: { capabilities: 'boot_option:local,profile:control',
                        memory_mb: '5120',
                        cpu_arch: 'x86_64',
                        cpus: '2',
                        local_gb: '40' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          properties: { capabilities: 'profile:control,boot_option:local',
                        memory_mb: '5120',
                        cpu_arch: 'x86_64',
                        cpus: '2',
                        local_gb: '40' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          properties: { capabilities: 'profile:compute,boot_option:local',
                        memory_mb: '5120',
                        cpu_arch: 'x86_64',
                        cpus: '2',
                        local_gb: '40' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
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
    expect(selectors.getUnassignedIntrospectedNodes(state).size).toEqual(2);
  });
});
