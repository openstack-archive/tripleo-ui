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

import * as selectors from '../../js/selectors/environmentConfiguration';
import {
  Environment,
  EnvironmentConfigurationState
} from '../../js/immutableRecords/environmentConfiguration';

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
          environments: List([
            'environments/environment1.yaml',
            'environments/environment2.yaml'
          ])
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
    expect(selectors.getEnabledEnvironments(state)).toEqual(
      OrderedMap({
        'environments/environment1.yaml': new Environment({
          file: 'environments/environment1.yaml',
          title: 'Environment1',
          enabled: true
        })
      })
    );
  });

  it('provides selector to get environment configuration summary string', () => {
    expect(selectors.getEnvironmentConfigurationSummary(state)).toEqual(
      'Environment1'
    );
  });

  it(`provides selector to get nested tree of Environment Configuration Topics,
      Environment Groups and Environments`, () => {
    expect(selectors.getTopicsTree(state)).toEqual(
      Map({
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
      })
    );
  });
});
