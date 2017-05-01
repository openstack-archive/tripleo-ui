import FiltersConstants from '../constants/FiltersConstants';

export const clearActiveFilters = filter => ({
  type: FiltersConstants.CLEAR_ACTIVE_FILTERS,
  payload: filter
});

export const deleteActiveFilter = (filter, activeFilterUUID) => ({
  type: FiltersConstants.DELETE_ACTIVE_FILTER,
  payload: { filter, activeFilterUUID }
});

export const addActiveFilter = (filter, data) => ({
  type: FiltersConstants.ADD_ACTIVE_FILTER,
  payload: { filter, data }
});

export const updateFilter = (filter, data) => ({
  type: FiltersConstants.UPDATE_FILTER,
  payload: { filter, data }
});
