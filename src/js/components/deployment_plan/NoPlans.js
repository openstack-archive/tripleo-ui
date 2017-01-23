import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

import common from '../../messages/common';

const messages = defineMessages({
  noPlansAvailable: {
    id: 'NoPlans.noPlansAvailable',
    defaultMessage: 'No Deployment Plans Available'
  },
  noPlansAvailableMessage: {
    id: 'NoPlans.noPlansAvailableMessage',
    defaultMessage: 'There are no Deployment Plans available. Please create one first.'
  }
});

export default class NoPlans extends React.Component {
  render() {
    return (
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <span className="fa fa-ban"></span>
        </div>
        <h1><FormattedMessage {...messages.noPlansAvailable}/></h1>
        <p><FormattedMessage {...messages.noPlansAvailableMessage}/></p>
        <div className="blank-slate-pf-main-action">
          <Link to="/plans/new"
                query={{tab: 'newPlan'}}
                className="btn btn-lg btn-primary">
            <span className="fa fa-plus"/> <FormattedMessage {...common.createNewPlan}/>
          </Link>
        </div>
      </div>
    );
  }
}
