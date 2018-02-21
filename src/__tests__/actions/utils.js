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

import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

export const mockGetIntl = {
  getIntl: () => ({
    formatMessage: msgObj => msgObj.defaultMessage
  })
};

export const mockStore = configureMockStore([
  thunkMiddleware.withExtraArgument(mockGetIntl)
]);
