import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { startCase } from 'lodash';
import { submit } from 'redux-form';
import React, { PropTypes } from 'react';

import { ActiveFilter,
         ActiveFiltersList } from '../../ui/Toolbar/ActiveFilters';
import { getActiveFilters,
         getFilterByName } from '../../../selectors/filters';
import { getFilteredNodes,
         getNodes } from '../../../selectors/nodes';
import { nodeColumnMessages } from '../messages';
import NodesToolbarForm from './NodesToolbarForm';
import NodesToolbarActions from './NodesToolbarActions';
import ToolbarFiltersForm from '../../ui/Toolbar/ToolbarFiltersForm';
import { clearActiveFilters,
         deleteActiveFilter,
         addActiveFilter,
         updateFilter } from '../../../actions/FiltersActions';
import { Toolbar,
         ToolbarActions,
         ToolbarResults } from '../../ui/Toolbar/Toolbar';

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
    id: 'NodesToolbar.filteredToolbarResults',
    defaultMessage: `{filteredCount, number} of {totalCount, number} {totalCount, plural,
      one {Node} other {Nodes}}`
  },
  filterStringPlaceholder: {
    id: 'NodesToolbar.filterStringPlaceholder',
    defaultMessage: 'Add filter'
  },
  nonFilteredToolbarResults: {
    id: 'NodesToolbar.nonFilteredToolbarResults',
    defaultMessage: '{totalCount, number} {totalCount, plural, one {Node} other {Nodes}}'
  }
});

class NodesToolbar extends React.Component {
  handleNodesToolbarFormChange(allValues, dispatch, formProps) {
    this.props.submitNodesToolbarForm();
  }

  render() {
    const { activeFilters,
            clearActiveFilters,
            deleteActiveFilter,
            filteredNodesCount,
            initialValues,
            intl,
            addActiveFilter,
            nodesCount,
            updateFilter } = this.props;
    return (
      <Toolbar>
        <ToolbarActions>
          <ToolbarFiltersForm
            form="nodesToolbarFilter"
            formatSelectValue={value => intl.formatMessage(nodeColumnMessages[value])}
            initialValues={{ filterBy: 'name' }}
            onSubmit={addActiveFilter}
            options={{
              name: intl.formatMessage(nodeColumnMessages.name),
              power_state: intl.formatMessage(nodeColumnMessages.power_state),
              provision_state: intl.formatMessage(nodeColumnMessages.provision_state)
            }}
            placeholder={intl.formatMessage(messages.filterStringPlaceholder)}/>
          <NodesToolbarForm
            onChange={this.handleNodesToolbarFormChange.bind(this)}
            onSubmit={updateFilter}
            initialValues={initialValues} />
          <NodesToolbarActions />
        </ToolbarActions>
        <ToolbarResults>
          <h5>
            {filteredNodesCount === nodesCount
              ? intl.formatMessage(messages.nonFilteredToolbarResults,
                                   { totalCount: nodesCount })
              : intl.formatMessage(messages.filteredToolbarResults,
                                   { filteredCount: filteredNodesCount,
                                     totalCount: nodesCount })
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
    );
  }
}
NodesToolbar.propTypes = {
  activeFilters: ImmutablePropTypes.map.isRequired,
  addActiveFilter: PropTypes.func.isRequired,
  clearActiveFilters: PropTypes.func.isRequired,
  deleteActiveFilter: PropTypes.func.isRequired,
  filteredNodesCount: PropTypes.number.isRequired,
  initialValues: PropTypes.object.isRequired,
  intl: PropTypes.object,
  nodesCount: PropTypes.number.isRequired,
  submitNodesToolbarForm: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired
};
const mapDispatchToProps = (dispatch) => {
  return {
    clearActiveFilters: () => dispatch(clearActiveFilters('nodesToolbar')),
    deleteActiveFilter: uuid =>
      dispatch(deleteActiveFilter('nodesToolbar', uuid)),
    submitNodesToolbarForm: () => dispatch(submit('nodesToolbar')),
    addActiveFilter: data => dispatch(addActiveFilter('nodesToolbar', data)),
    updateFilter: data => dispatch(updateFilter('nodesToolbar', data))
  };
};
const mapStateToProps = (state) => {
  return {
    activeFilters: getActiveFilters(state, 'nodesToolbar'),
    filteredNodesCount: getFilteredNodes(state).size,
    initialValues: getFilterByName(state, 'nodesToolbar').delete('activeFilters').toJS(),
    nodesCount: getNodes(state).size
  };
};
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(NodesToolbar));
