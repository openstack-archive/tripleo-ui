import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

const messages = defineMessages({
  noPlansHeader: {
    id: 'NoPlans.noPlansHeader',
    defaultMessage: 'No Deployment Plans Available'
  },
  noPlansMessage: {
    id: 'NoPlans.noPlansMessage',
    defaultMessage: 'There are no Deployment Plans available. Please create one first.'
  },
  createNewPlan: {
    id: 'NoPlans.createNewPlan',
    defaultMessage: 'Create New Plan'
  }
});

export default class NoPlans extends React.Component {
  render() {
    return (
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <span className="fa fa-ban"></span>
        </div>
        <h1><FormattedMessage {...messages.noPlansHeader}/></h1>
        <p><FormattedMessage {...messages.noPlansMessage}/></p>
        <div className="blank-slate-pf-main-action">
          <Link to="/plans/new"
                query={{tab: 'newPlan'}}
                className="btn btn-lg btn-primary">
            <span className="fa fa-plus"/> <FormattedMessage {...messages.createNewPlan}/>
          </Link>
        </div>
      </div>
    );
  }
}
