import { connect } from 'react-redux';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import CurrentPlanActions from '../../actions/CurrentPlanActions';
import DataTable from '../ui/tables/DataTable';
import { DataTableCell, DataTableHeaderCell } from '../ui/tables/DataTableCells';
import DataTableColumn from '../ui/tables/DataTableColumn';
import { PageHeader } from '../ui/PageHeader';
import PlansActions from '../../actions/PlansActions';

class ListPlans extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.fetchPlans();
  }

  renderNoPlans() {
    return (
      <tr>
        <td colSpan="2">
          <p></p>
          <p className="text-center">
            There are currently no Plans
          </p>
          <p className="text-center">
            <Link to="/plans/new"
                  query={{tab: 'newPlan'}}
                  className="btn btn-success">Create New Plan</Link>
          </p>
        </td>
      </tr>
    );
  }

  renderTableActions() {
    return (
      <Link to="/plans/new"
            query={{tab: 'newPlan'}}
            className="btn btn-primary">
        <span className="fa fa-plus"/> Create New Plan
      </Link>
    );
  }

  render() {
    let plans = this.props.plans.sortBy(plan => plan.name).toArray();
    return (
      <div>
        <PageHeader>Plans</PageHeader>
        <DataTable data={plans}
                   rowsCount={plans.length}
                   noRowsRenderer={this.renderNoPlans.bind(this)}
                   tableActions={this.renderTableActions}>
          <DataTableColumn header={<DataTableHeaderCell key="name">Name</DataTableHeaderCell>}
                           cell={<PlanNameCell
                           data={plans}
                           currentPlanName={this.props.currentPlanName}
                           choosePlan={this.props.choosePlan}/>}/>
          <DataTableColumn header={<DataTableHeaderCell key="actions">Actions</DataTableHeaderCell>}
                           cell={<RowActionsCell className="actions text-right"
                                                 data={plans}/>}/>
        </DataTable>
        {this.props.children}
      </div>
    );
  }
}
ListPlans.propTypes = {
  children: React.PropTypes.node,
  choosePlan: React.PropTypes.func,
  conflict: React.PropTypes.string,
  currentPlanName: React.PropTypes.string,
  fetchPlans: React.PropTypes.func,
  plans: ImmutablePropTypes.map
};

function mapStateToProps(state) {
  return {
    currentPlanName: state.currentPlan.currentPlanName,
    conflict: state.plans.get('conflict'),
    plans: state.plans.get('all')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPlans: () => {
      dispatch(PlansActions.fetchPlans());
    },
    choosePlan: planName => {
      dispatch(CurrentPlanActions.choosePlan(planName));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPlans);

class RowActionsCell extends React.Component {
  render() {
    let plan = this.props.data[this.props.rowIndex];

    if(plan.transition) {
      // TODO(jtomasek): this causes DOMNesting validation error which should eventually go away
      // in future React versions. See https://github.com/facebook/react/issues/5506
      return null;
    } else {
      return (
        <DataTableCell {...this.props}>
          <Link key="edit"
                to={`/plans/${plan.name}/edit`}
                query={{tab: 'editPlan'}}
                className="btn btn-xs btn-default">Edit</Link>
          &nbsp;
          <Link key="delete"
                to={`/plans/${plan.name}/delete`}
                className="btn btn-xs btn-danger">Delete</Link>
        </DataTableCell>
      );
    }
  }
}
RowActionsCell.propTypes = {
  data: React.PropTypes.array,
  rowIndex: React.PropTypes.number
};

export class PlanNameCell extends React.Component {
  onPlanClick(e) {
    e.preventDefault();
    this.props.choosePlan(e.target.textContent);
  }

  getActiveIcon(planName) {
    if(planName === this.props.currentPlanName) {
      return (
        <span className="pficon pficon-flag"></span>
      );
    }
    return false;
  }

  render() {
    let plan = this.props.data[this.props.rowIndex];

    if(plan.transition === 'deleting') {
      return (
        <DataTableCell {...this.props} colSpan="2" className={plan.transition}>
          <em>Deleting <strong>{plan.name}</strong>&hellip;</em>
        </DataTableCell>
      );
    } else {
      return (
        <DataTableCell {...this.props}>
          {this.getActiveIcon(plan.name)} <a href=""
                                             onClick={this.onPlanClick.bind(this)}>{plan.name}</a>
        </DataTableCell>
      );
    }
  }
}
PlanNameCell.propTypes = {
  choosePlan: React.PropTypes.func,
  currentPlanName: React.PropTypes.string,
  data: React.PropTypes.array,
  rowIndex: React.PropTypes.number
};
