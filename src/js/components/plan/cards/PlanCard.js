import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { MenuItem } from 'react-bootstrap';
import DropdownKebab from '../../ui/dropdown/DropdownKebab';

const messages = defineMessages({
  deletingPlanName: {
    id: 'ListPlans.deletingPlanName',
    defaultMessage: 'Deleting {planName}...'
  },
  edit: {
    id: 'ListPlans.edit',
    defaultMessage: 'Edit'
  },
  export: {
    id: 'ListPlans.export',
    defaultMessage: 'Export'
  },
  delete: {
    id: 'ListPlans.delete',
    defaultMessage: 'Delete'
  }
});

class PlanCard extends React.Component {
  onPlanClick(e) {
    e.preventDefault();
    this.props.choosePlan(e.target.textContent);
  }

  getActiveIcon() {
    if (this.props.plan.name === this.props.currentPlanName) {
      return <span className="pficon pficon-flag icon-with-padding" />;
    }
    return false;
  }

  renderPlanName() {
    if (this.props.plan.transition === 'deleting') {
      return (
        <FormattedMessage
          {...messages.deletingPlanName}
          values={{ planName: <strong>{this.props.plan.name}</strong> }}
        />
      );
    } else {
      return (
        <a href="" onClick={this.onPlanClick.bind(this)}>
          {this.props.plan.name}
        </a>
      );
    }
  }

  handleOnSelect(eventKey) {
    switch (eventKey) {
      case 'edit': {
        browserHistory.push(`/plans/${this.props.plan.name}/edit?tab=editPlan`);
        break;
      }
      case 'export': {
        browserHistory.push(`/plans/${this.props.plan.name}/export`);
        break;
      }
      case 'delete': {
        browserHistory.push(`/plans/${this.props.plan.name}/delete`);
        break;
      }
    }
  }

  render() {
    return (
      <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
        <div className="card-pf card-pf-accented">
          <h2 className="card-pf-title">
            {this.renderPlanName()}
            {this.getActiveIcon()}
            <div className="pull-right">
              <DropdownKebab
                onSelect={this.handleOnSelect.bind(this)}
                id={`card-actions-${this.props.plan.name}`}
              >
                <MenuItem eventKey="edit">
                  <FormattedMessage {...messages.edit} />
                </MenuItem>
                <MenuItem eventKey="export">
                  <FormattedMessage {...messages.export} />
                </MenuItem>
                <MenuItem eventKey="delete">
                  <FormattedMessage {...messages.delete} />
                </MenuItem>
              </DropdownKebab>
            </div>
          </h2>
          <div className="card-pf-body">
            <div className="card-pf-utilization-details">
              <span className="card-pf-utilization-card-details-description">
                <span className="card-pf-utilization-card-details-line-1">
                  {/* TODO(hpokorny):
                      fetchPlans() doesn't provide description yet */}
                  Plan description
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PlanCard.propTypes = {
  choosePlan: PropTypes.func,
  currentPlanName: PropTypes.string,
  plan: PropTypes.object
};

export default injectIntl(PlanCard);
