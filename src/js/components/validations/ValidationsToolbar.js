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

import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { startCase } from 'lodash';
import React from 'react';

import { ActiveFilter, ActiveFiltersList } from '../ui/Toolbar/ActiveFilters';
import {
  addActiveFilter,
  clearActiveFilters,
  deleteActiveFilter
} from '../../actions/FiltersActions';
import { getActiveFilters } from '../../selectors/filters';
import {
  getFilteredValidations,
  getValidationsWithResults
} from '../../selectors/validations';
import { PropTypes } from 'prop-types';
import { Toolbar, ToolbarResults, ToolbarActions } from '../ui/Toolbar';
import ToolbarFiltersForm from '../ui/Toolbar/ToolbarFiltersForm';

const messages = defineMessages({
  activeFilters: {
    id: 'Toolbar.activeFilters',
    defaultMessage: 'Active Filters:'
  },
  clearAllActiveFilters: {
    id: 'Toolbar.clearAllActiveFilters',
    defaultMessage: 'Clear All Filters'
  },
  filteredToolbarResults: {
    id: 'ValidationsToolbar.filteredToolbarResults',
    defaultMessage: `{filteredCount, number} of {totalCount, number} {totalCount, plural,
      one {Validation} other {Validations}}`
  },
  filterStringPlaceholder: {
    id: 'ValidationsToolbar.filterStringPlaceholder',
    defaultMessage: 'Add filter'
  },
  group: {
    id: 'ValidationsToolbar.group',
    defaultMessage: 'Group'
  },
  name: {
    id: 'ValidationsToolbar.name',
    defaultMessage: 'Name'
  },
  nonFilteredToolbarResults: {
    id: 'ValidationsToolbar.nonFilteredToolbarResults',
    defaultMessage: '{totalCount, number} {totalCount, plural, one ' +
      '{Validation} other {Validations}}'
  }
});

class ValidationsToolbar extends React.Component {
  render() {
    const {
      activeFilters,
      clearActiveFilters,
      deleteActiveFilter,
      filteredValidationsCount,
      intl,
      addActiveFilter,
      validationsCount
    } = this.props;
    return (
      <div className="validations-toolbar">
        <Toolbar tableView>
          <ToolbarActions>
            <ToolbarFiltersForm
              id="ValidationsToolbar__validationsToolbarFiltersForm"
              form="validationsToolbarFilter"
              formatSelectValue={value => intl.formatMessage(messages[value])}
              initialValues={{ filterBy: 'name' }}
              onSubmit={addActiveFilter}
              options={{
                name: intl.formatMessage(messages.name),
                group: intl.formatMessage(messages.group)
              }}
              placeholder={intl.formatMessage(messages.filterStringPlaceholder)}
            />
          </ToolbarActions>
          <ToolbarResults>
            <h5>
              {filteredValidationsCount === validationsCount
                ? intl.formatMessage(messages.nonFilteredToolbarResults, {
                    totalCount: validationsCount
                  })
                : intl.formatMessage(messages.filteredToolbarResults, {
                    filteredCount: filteredValidationsCount,
                    totalCount: validationsCount
                  })}
            </h5>
            <ActiveFiltersList
              clearAllLabel={intl.formatMessage(messages.clearAllActiveFilters)}
              handleClearAll={clearActiveFilters}
              label={intl.formatMessage(messages.activeFilters)}
            >
              {activeFilters
                .toList()
                .toJS()
                .map(filter => (
                  <ActiveFilter
                    filterBy={startCase(filter.filterBy)}
                    filterString={filter.filterString}
                    key={filter.uuid}
                    onRemove={() => deleteActiveFilter(filter.uuid)}
                  />
                ))}
            </ActiveFiltersList>
          </ToolbarResults>
        </Toolbar>
      </div>
    );
  }
}
ValidationsToolbar.propTypes = {
  activeFilters: ImmutablePropTypes.map.isRequired,
  addActiveFilter: PropTypes.func.isRequired,
  clearActiveFilters: PropTypes.func.isRequired,
  deleteActiveFilter: PropTypes.func.isRequired,
  filteredValidationsCount: PropTypes.number.isRequired,
  intl: PropTypes.object,
  validationsCount: PropTypes.number.isRequired
};
const mapDispatchToProps = dispatch => {
  return {
    addActiveFilter: data =>
      dispatch(addActiveFilter('validationsToolbar', data)),
    clearActiveFilters: () =>
      dispatch(clearActiveFilters('validationsToolbar')),
    deleteActiveFilter: uuid =>
      dispatch(deleteActiveFilter('validationsToolbar', uuid))
  };
};
const mapStateToProps = state => {
  return {
    activeFilters: getActiveFilters(state, 'validationsToolbar'),
    filteredValidationsCount: getFilteredValidations(state).size,
    validationsCount: getValidationsWithResults(state).size
  };
};
export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ValidationsToolbar)
);
