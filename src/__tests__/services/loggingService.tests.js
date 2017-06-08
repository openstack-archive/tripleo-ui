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

// TODO(hpokorny): remove this import when store is correctly mocked
import store from '../../js/store'; // eslint-disable-line no-unused-vars
import { predicate } from '../../js/services/logging/LoggingService';

describe('Logger predicate', () => {
  it('ignores download logs actions', () => {
    expect(predicate(() => {}, { type: 'QUEUE_MESSAGE' })).toBeFalsy();
    expect(predicate(() => {}, { type: 'DOWNLOAD_LOGS_SUCCESS' })).toBeTruthy();
  });
});
