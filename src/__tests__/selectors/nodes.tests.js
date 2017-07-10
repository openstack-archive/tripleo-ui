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

import { Map } from 'immutable';
import * as selectors from '../../js/selectors/nodes';

describe('nodes selectors', () => {
  const nodes = Map({
    'node-uuid-1': Map({
      provision_state: 'manageable'
    }),
    'node-uuid-2': Map({
      provision_state: 'available'
    })
  });

  it('selects non-manageable nodes', () => {
    expect(selectors.getNonManageableNodes(nodes)).toEqual(
      Map({
        'node-uuid-2': Map({
          provision_state: 'available'
        })
      })
    );
  });
});
