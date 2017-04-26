import { Map, Record } from 'immutable';

export const ActiveFilter = Record({
  uuid: undefined,
  filterBy: '',
  filterString: ''
});

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
});
