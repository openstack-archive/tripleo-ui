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
  <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
    <div className="card-pf card-pf-accented">
      <div className="card-pf-body">
        <div className="card-pf-utilization-details">
          <span className="card-pf-utilization-card-details-description">
            <span className="card-pf-utilization-card-details-line-1">
              <span className="pficon pficon-add-circle-o icon-with-padding" />
              <Link
                to="/plans/new"
                query={{ tab: 'newPlan' }}
                id="ListPlans__newPlanLink"
              >
                <FormattedMessage {...messages.createNewPlan} />
              </Link>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default injectIntl(CreatePlanCard);
