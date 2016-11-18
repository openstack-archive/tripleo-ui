import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

const messages = defineMessages({
  noPlansAvailable: {
    id: 'NoPlans.noPlansAvailable',
    defaultMessage: 'No Deployment Plans Available'
  },
  noPlansAvailableMessage: {
    id: 'NoPlans.noPlansAvailableMessage',
    defaultMessage: 'There are no Deployment Plans available. Please create one first.'
  },
  createNewPlan: {
    id: 'NoPlans.createNewPlan',
    defaultMessage: 'Create New Plan'
  }
});

class NoPlans extends React.Component {
  render() {
    return (
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <span className="fa fa-ban"></span>
        </div>
        <h1>{this.props.intl.formatMessage(messages.noPlansAvailable)}</h1>
        <p>{this.props.intl.formatMessage(messages.noPlansAvailableMessage)}</p>
        <div className="blank-slate-pf-main-action">
          <Link to="/plans/new"
                query={{tab: 'newPlan'}}
                className="btn btn-lg btn-primary">
            <span className="fa fa-plus"/> {this.props.intl.formatMessage(messages.createNewPlan)}
          </Link>
        </div>
      </div>
    );
  }
}

NoPlans.propTypes = {
  intl: React.PropTypes.object
};

export default injectIntl(NoPlans);
