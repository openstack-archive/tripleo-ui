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

import { Map, Record } from 'immutable'

export const ActiveFilter = Record({
  uuid: undefined,
  filterBy: '',
  filterString: ''
})

export const FiltersInitialState = Record({
  nodesToolbar: Map({
    activeFilters: Map(),
    sortBy: 'name',
    sortDir: 'asc',
    contentView: 'list'
  }),
  validationsToolbar: Map({
    activeFilters: Map(),
    sortBy: 'name',
    sortDir: 'asc',
    contentView: 'list'
  })
})
