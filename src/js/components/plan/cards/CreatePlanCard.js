import React from 'react';
import { Link } from 'react-router';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

const messages = defineMessages({
  createNewPlan: {
    id: 'ListPlans.createNewPlan',
    defaultMessage: 'Create New Plan'
  }
});

const CreatePlanCard = () => (
  <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
    <div className="card-pf">
      <div className="card-pf-body">
        <span className="pficon pficon-add-circle-o icon-with-padding" />
        <Link
          to="/plans/new"
          query={{ tab: 'newPlan' }}
          id="ListPlans__newPlanLink"
        >
          <FormattedMessage {...messages.createNewPlan} />
        </Link>
      </div>
    </div>
  </div>
);

export default injectIntl(CreatePlanCard);
