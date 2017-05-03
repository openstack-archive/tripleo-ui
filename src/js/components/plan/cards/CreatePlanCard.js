/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { Link } from 'react-router-dom';
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
        <Link to="/plans/new?tab=newPlan" id="ListPlans__newPlanLink">
          <FormattedMessage {...messages.createNewPlan} />
        </Link>
      </div>
    </div>
  </div>
);

export default injectIntl(CreatePlanCard);
