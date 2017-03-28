import { Button, FormGroup, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { startCase } from 'lodash';
import { submit } from 'redux-form';
import React from 'react';

import { ActiveFilter,
         ActiveFiltersList } from '../ui/Toolbar/ActiveFilters';
import DropdownKebab from '../ui/dropdown/DropdownKebab';
import NodesToolbarForm from './NodesToolbarForm';
import NodesToolbarFiltersForm from './NodesToolbarFiltersForm';
import { clearActiveFilters,
         deleteActiveFilter,
         addActiveFilter,
         updateFilter } from '../../actions/FiltersActions';
import { Toolbar,
         ToolbarActions,
         ToolbarResults } from '../ui/Toolbar/Toolbar';

class NodesToolbar extends React.Component {
  handleNodesToolbarFormChange(allValues, dispatch, formProps) {
    this.props.submitNodesToolbarForm();
  }

  render() {
    const { activeFilters,
            clearActiveFilters,
            deleteActiveFilter,
            initialValues,
            addActiveFilter,
            updateFilter } = this.props;
    return (
      <Toolbar>
        <ToolbarActions>
          <NodesToolbarFiltersForm onSubmit={addActiveFilter} />
          <NodesToolbarForm
            onChange={this.handleNodesToolbarFormChange.bind(this)}
            onSubmit={updateFilter}
            initialValues={initialValues} />
          <FormGroup>
            <Button>Introspect Nodes</Button>
            <Button>Provide Nodes</Button>
            <DropdownKebab id="nodesActionsKebab">
              <MenuItem>Tag Nodes</MenuItem>
              <MenuItem>Remove Nodes</MenuItem>
            </DropdownKebab>
          </FormGroup>
        </ToolbarActions>
        <ToolbarResults>
          <h5>2 of 40 Nodes</h5>
          <ActiveFiltersList
            handleClearAll={clearActiveFilters} >
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
  addActiveFilter: React.PropTypes.func.isRequired,
  clearActiveFilters: React.PropTypes.func.isRequired,
  deleteActiveFilter: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object.isRequired,
  submitNodesToolbarForm: React.PropTypes.func.isRequired,
  updateFilter: React.PropTypes.func.isRequired
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
    activeFilters: state.filters.nodesToolbar.get('activeFilters'),
    initialValues: state.filters.nodesToolbar.delete('activeFilters').toJS()
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NodesToolbar);
