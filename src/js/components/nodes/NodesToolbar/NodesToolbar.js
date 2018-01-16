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
import { submit } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';

import {
  ActiveFilter,
  ActiveFiltersList
} from '../../ui/Toolbar/ActiveFilters';
import { getActiveFilters, getFilterByName } from '../../../selectors/filters';
import { getFilteredNodes, getNodes } from '../../../selectors/nodes';
import { nodeColumnMessages } from '../messages';
import NodesToolbarForm from './NodesToolbarForm';
import NodesToolbarActions from './NodesToolbarActions';
import { SelectAllButton } from '../../ui/Toolbar/SelectAll';
import ToolbarFiltersForm from '../../ui/Toolbar/ToolbarFiltersForm';
import {
  clearActiveFilters,
  deleteActiveFilter,
  addActiveFilter,
  updateFilter
} from '../../../actions/FiltersActions';
import { Toolbar, ToolbarActions, ToolbarResults } from '../../ui/Toolbar';

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
    defaultMessage:
      '{totalCount, number} {totalCount, plural, one {Node} other {Nodes}}'
  }
});

class NodesToolbar extends React.Component {
  handleNodesToolbarFormChange(allValues, dispatch, formProps) {
    this.props.submitNodesToolbarForm();
  }

  render() {
    const {
      activeFilters,
      clearActiveFilters,
      deleteActiveFilter,
      filteredNodes,
      filteredNodesCount,
      nodesToolbarFilter,
      intl,
      addActiveFilter,
      nodesCount,
      updateFilter
    } = this.props;
    return (
      <Toolbar tableView={nodesToolbarFilter.get('contentView') === 'table'}>
        <ToolbarActions>
          <ToolbarFiltersForm
            id="NodesToolbar_toolbarFiltersForm"
            form="nodesToolbarFilter"
            formatSelectValue={value =>
              intl.formatMessage(nodeColumnMessages[value])
            }
            initialValues={{ filterBy: 'name' }}
            onSubmit={addActiveFilter}
            options={{
              name: intl.formatMessage(nodeColumnMessages.name),
              'properties.capabilities.profile': intl.formatMessage(
                nodeColumnMessages['properties.capabilities.profile']
              ),
              'properties.cpu_arch': intl.formatMessage(
                nodeColumnMessages['properties.cpu_arch']
              ),
              'properties.cpus': intl.formatMessage(
                nodeColumnMessages['properties.cpus']
              ),
              'properties.local_gb': intl.formatMessage(
                nodeColumnMessages['properties.local_gb']
              ),
              'properties.memory_mb': intl.formatMessage(
                nodeColumnMessages['properties.memory_mb']
              ),
              macs: intl.formatMessage(nodeColumnMessages.macs),
              power_state: intl.formatMessage(nodeColumnMessages.power_state),
              provision_state: intl.formatMessage(
                nodeColumnMessages.provision_state
              ),
              'introspectionStatus.state': intl.formatMessage(
                nodeColumnMessages['introspectionStatus.state']
              )
            }}
            placeholder={intl.formatMessage(messages.filterStringPlaceholder)}
          />
          <NodesToolbarForm
            onChange={this.handleNodesToolbarFormChange.bind(this)}
            onSubmit={updateFilter}
            initialValues={nodesToolbarFilter.toJS()}
          />
          <NodesToolbarActions />
        </ToolbarActions>
        <ToolbarResults>
          <h5>
            {filteredNodesCount === nodesCount
              ? intl.formatMessage(messages.nonFilteredToolbarResults, {
                  totalCount: nodesCount
                })
              : intl.formatMessage(messages.filteredToolbarResults, {
                  filteredCount: filteredNodesCount,
                  totalCount: nodesCount
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
                  filterBy={intl.formatMessage(
                    nodeColumnMessages[filter.filterBy]
                  )}
                  filterString={filter.filterString}
                  key={filter.uuid}
                  onRemove={() => deleteActiveFilter(filter.uuid)}
                />
              ))}
          </ActiveFiltersList>
          <p className="pull-right" id="NodesToolbar__selectAllButton">
            <SelectAllButton
              form="nodesListForm"
              items={filteredNodes.toList().toJS()}
            />
          </p>
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
  filteredNodes: ImmutablePropTypes.map.isRequired,
  filteredNodesCount: PropTypes.number.isRequired,
  intl: PropTypes.object,
  nodesCount: PropTypes.number.isRequired,
  nodesToolbarFilter: PropTypes.object.isRequired,
  submitNodesToolbarForm: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired
};
const mapDispatchToProps = dispatch => {
  return {
    clearActiveFilters: () => dispatch(clearActiveFilters('nodesToolbar')),
    deleteActiveFilter: uuid =>
      dispatch(deleteActiveFilter('nodesToolbar', uuid)),
    submitNodesToolbarForm: () => dispatch(submit('nodesToolbar')),
    addActiveFilter: data => dispatch(addActiveFilter('nodesToolbar', data)),
    updateFilter: data => dispatch(updateFilter('nodesToolbar', data))
  };
};
const mapStateToProps = state => {
  return {
    activeFilters: getActiveFilters(state, 'nodesToolbar'),
    filteredNodesCount: getFilteredNodes(state).size,
    filteredNodes: getFilteredNodes(state),
    nodesToolbarFilter: getFilterByName(state, 'nodesToolbar').delete(
      'activeFilters'
    ),
    nodesCount: getNodes(state).size
  };
};
export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(NodesToolbar)
);
