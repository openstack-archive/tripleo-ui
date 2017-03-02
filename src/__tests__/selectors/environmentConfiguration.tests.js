import { List, Map, OrderedMap } from 'immutable';

import * as selectors from '../../js/selectors/environmentConfiguration';
import { Environment,
         EnvironmentConfigurationState } from '../../js/immutableRecords/environmentConfiguration';

describe('Environment Configuration selectors', () => {
  const state = {
    environmentConfiguration: new EnvironmentConfigurationState({
      loaded: true,
      isFetching: false,
      topics: Map({
        Topic1: Map({
          title: 'Topic1',
          environment_groups: List(['Group1'])
        })
      }),
      environmentGroups: Map({
        Group1: Map({
          title: 'Group1',
          description: 'Group1 description',
          environments: List(['environments/environment1.yaml','environments/environment2.yaml'])
        })
      }),
      environments: OrderedMap({
        'environments/environment1.yaml': new Environment({
          file: 'environments/environment1.yaml',
          title: 'Environment1',
          enabled: true
        }),
        'environments/environment2.yaml': new Environment({
          title: 'Environment2',
          file: 'environments/environment2.yaml',
          enabled: false
        })
      }),
      form: Map({
        formErrors: List(),
        formFieldErrors: Map()
      })
    })
  };

  it('provides selector to get enabled environments', () => {
    expect(selectors.getEnabledEnvironments(state)).toEqual(OrderedMap({
      'environments/environment1.yaml': new Environment({
        file: 'environments/environment1.yaml',
        title: 'Environment1',
        enabled: true
      })
    }));
  });

  it('provides selector to get environment configuration summary string', () => {
    expect(selectors.getEnvironmentConfigurationSummary(state)).toEqual('Environment1');
  });

  it(`provides selector to get nested tree of Environment Configuration Topics,
      Environment Groups and Environments`, () => {
    expect(selectors.getTopicsTree(state)).toEqual(Map({
      Topic1: Map({
        title: 'Topic1',
        environment_groups: List([
          Map({
            title: 'Group1',
            description: 'Group1 description',
            environments: OrderedMap({
              'environments/environment1.yaml': new Environment({
                file: 'environments/environment1.yaml',
                title: 'Environment1',
                enabled: true
              }),
              'environments/environment2.yaml': new Environment({
                title: 'Environment2',
                file: 'environments/environment2.yaml',
                enabled: false
              })
            })
          })
        ])
      })
    }));
  });
});
