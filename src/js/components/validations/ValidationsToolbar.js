import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { startCase } from 'lodash';
import React from 'react';

import { ActiveFilter,
         ActiveFiltersList } from '../ui/Toolbar/ActiveFilters';
import { getActiveFilters } from '../../selectors/filters';
import { getFilteredValidations,
         getValidationsWithResults } from '../../selectors/validations';
import ToolbarFiltersForm from '../ui/Toolbar/ToolbarFiltersForm';
import { clearActiveFilters,
         deleteActiveFilter,
         addActiveFilter } from '../../actions/FiltersActions';
import { Toolbar,
         ToolbarResults,
         ToolbarActions } from '../ui/Toolbar/Toolbar';

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
    defaultMessage: '{totalCount, number} {totalCount, plural, one '
                    + '{Validation} other {Validations}}'
  }
});

class ValidationsToolbar extends React.Component {
  render() {
    const { activeFilters,
            clearActiveFilters,
            deleteActiveFilter,
            filteredValidationsCount,
            intl,
            addActiveFilter,
            validationsCount } = this.props;
    return (
      <div className="validations-toolbar">
        <Toolbar>
          <ToolbarActions>
            <ToolbarFiltersForm
              form="validationsToolbarFilter"
              formatSelectValue={value => intl.formatMessage(messages[value])}
              initialValues={{ filterBy: 'name' }}
              onSubmit={addActiveFilter}
              options={{
                name: intl.formatMessage(messages.name),
                group: intl.formatMessage(messages.group)
              }}
              placeholder={intl.formatMessage(messages.filterStringPlaceholder)}/>
          </ToolbarActions>
          <ToolbarResults>
            <h5>
              {filteredValidationsCount === validationsCount
                ? intl.formatMessage(messages.nonFilteredToolbarResults,
                                     { totalCount: validationsCount })
                : intl.formatMessage(messages.filteredToolbarResults,
                                     { filteredCount: filteredValidationsCount,
                                       totalCount: validationsCount })
              }
            </h5>
            <ActiveFiltersList
              clearAllLabel={intl.formatMessage(messages.clearAllActiveFilters)}
              handleClearAll={clearActiveFilters}
              label={intl.formatMessage(messages.activeFilters)} >
              {activeFilters.toList().toJS().map(filter => (
                <ActiveFilter
                  filterBy={startCase(filter.filterBy)}
                  filterString={filter.filterString}
                  key={filter.uuid}
                  onRemove={() => deleteActiveFilter(filter.uuid)}/>
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
  addActiveFilter: React.PropTypes.func.isRequired,
  clearActiveFilters: React.PropTypes.func.isRequired,
  deleteActiveFilter: React.PropTypes.func.isRequired,
  filteredValidationsCount: React.PropTypes.number.isRequired,
  intl: React.PropTypes.object,
  validationsCount: React.PropTypes.number.isRequired
};
const mapDispatchToProps = (dispatch) => {
  return {
    addActiveFilter: data => dispatch(addActiveFilter('validationsToolbar', data)),
    clearActiveFilters: () => dispatch(clearActiveFilters('validationsToolbar')),
    deleteActiveFilter: uuid =>
      dispatch(deleteActiveFilter('validationsToolbar', uuid))
  };
};
const mapStateToProps = (state) => {
  return {
    activeFilters: getActiveFilters(state, 'validationsToolbar'),
    filteredValidationsCount: getFilteredValidations(state).size,
    validationsCount: getValidationsWithResults(state).size
  };
};
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ValidationsToolbar));
