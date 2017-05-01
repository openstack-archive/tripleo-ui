import { createSelector } from 'reselect';

export const getFilterByName = (state, filterName) => {
  return state.filters[filterName];
};

export const getActiveFilters = createSelector(getFilterByName, filter =>
  filter.get('activeFilters')
);
