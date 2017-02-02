import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import CurrentPlanActions from '../../actions/CurrentPlanActions';
import DataTable from '../ui/tables/DataTable';
import { DataTableCell, DataTableHeaderCell } from '../ui/tables/DataTableCells';
import DataTableColumn from '../ui/tables/DataTableColumn';
import { PageHeader } from '../ui/PageHeader';
import PlansActions from '../../actions/PlansActions';

const messages = defineMessages({
  actions: {
    id: 'ListPlans.actions',
    defaultMessage: 'Actions'
  },
  edit: {
    id: 'ListPlans.edit',
    defaultMessage: 'Edit'
  },
  delete: {
    id: 'ListPlans.delete',
    defaultMessage: 'Delete'
  },
  deletingPlanName: {
    id: 'ListPlans.deletingPlanName',
    defaultMessage: 'Deleting {planName}...'
  },
  plans: {
    id: 'ListPlans.plans',
    defaultMessage: 'Plans'
  },
  name: {
    id: 'ListPlans.name',
    defaultMessage: 'Name'
  },
  noPlans: {
    id: 'ListPlans.noPlans',
    defaultMessage: 'There are currently no plans.'
  },
  createNewPlan: {
    id: 'ListPlans.createNewPlan',
    defaultMessage: 'Create New Plan'
  }
});

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
            <FormattedMessage {...messages.noPlans}/>
          </p>
          <p className="text-center">
            <Link to="/plans/new"
                  query={{tab: 'newPlan'}}
                  className="btn btn-success">
              <FormattedMessage {...messages.createNewPlan}/>
            </Link>
          </p>
        </td>
      </tr>
    );
  }

  renderTableActions() {
    return (
      <Link to="/plans/new"
            query={{tab: 'newPlan'}}
            className="btn btn-primary"
            id="ListPlans__newPlanLink">
        <span className="fa fa-plus"/>  <FormattedMessage {...messages.createNewPlan}/>
      </Link>
    );
  }

  render() {
    let plans = this.props.plans.sortBy(plan => plan.name).toArray();
    return (
      <div>
        <PageHeader>
          <FormattedMessage {...messages.plans}/>
        </PageHeader>
        <DataTable data={plans}
                   rowsCount={plans.length}
                   noRowsRenderer={this.renderNoPlans.bind(this)}
                   tableActions={this.renderTableActions}
                   id="ListPlans__plansTable">
          <DataTableColumn header={<DataTableHeaderCell key="name">
                                     <FormattedMessage {...messages.name}/>
                                   </DataTableHeaderCell>}
                           cell={<PlanNameCell
                           data={plans}
                           currentPlanName={this.props.currentPlanName}
                           choosePlan={this.props.choosePlan}/>}/>
          <DataTableColumn header={<DataTableHeaderCell key="actions">
                                     <FormattedMessage {...messages.actions}/>
                                   </DataTableHeaderCell>}
                           cell={<RowActionsCell
                           className="actions text-right"
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
                className="btn btn-xs btn-default">
            <FormattedMessage {...messages.edit}/>
          </Link>
          &nbsp;
          <Link key="delete"
                to={`/plans/${plan.name}/delete`}
                className="btn btn-xs btn-danger ListPlans__editPlanButton">
            <FormattedMessage {...messages.delete}/>
          </Link>
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
          <em>
            <FormattedMessage {...messages.deletingPlanName}
                              values={{ planName: <strong>{plan.name}</strong>}}/>
          </em>
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
