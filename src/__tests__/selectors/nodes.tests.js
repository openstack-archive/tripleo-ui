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
      provisionedFilter: '',
      maintenanceFilter: '',
      all: fromJS([
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          properties: { capabilities: 'boot_option:local' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          properties: { capabilities: 'boot_option:local,profile:control' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          properties: { capabilities: 'profile:control,boot_option:local' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          properties: { capabilities: 'profile:compute,boot_option:local' }
        },
        {
          provision_state: 'available',
          provision_updated_at: '12-12-2016',
          properties: { capabilities: '' }
        }
      ])
    })
  };

  it('provides selector to list Introspected Nodes unassigned to a Role', () => {
    expect(selectors.getUnassignedIntrospectedNodes(state).size).toEqual(2);
  });
});
