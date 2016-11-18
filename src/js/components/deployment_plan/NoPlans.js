import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

export default class NoPlans extends React.Component {
  render() {
    return (
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <span className="fa fa-ban"></span>
        </div>
        <h1><FormattedMessage id="no-deployment-plans-available"
                              defaultMessage="No Deployment Plans Available"
                              description="No Deployment Plans Available"/></h1>
        <p><FormattedMessage
              id="there-are-no-deployment-plans-available-please-create-one-first"
              defaultMessage="There are no Deployment Plans available. Please create one first."
              description="No plans available message."/></p>
        <div className="blank-slate-pf-main-action">
          <Link to="/plans/new"
                query={{tab: 'newPlan'}}
                className="btn btn-lg btn-primary">
            <span className="fa fa-plus"/> <FormattedMessage id="create-new-plan"
                                                             defaultMessage="Create New Plan"
                                                             description="Create New Plan"/>
          </Link>
        </div>
      </div>
    );
  }
}
