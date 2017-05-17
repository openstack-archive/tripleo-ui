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

import { defineMessages, FormattedMessage } from 'react-intl';
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

export default class NoPlans extends React.Component {
  render() {
    return (
      <div className="blank-slate-pf">
        <div className="blank-slate-pf-icon">
          <span className="fa fa-ban" />
        </div>
        <h1><FormattedMessage {...messages.noPlansAvailable} /></h1>
        <p><FormattedMessage {...messages.noPlansAvailableMessage} /></p>
        <div className="blank-slate-pf-main-action">
          <Link
            to="/plans/new"
            query={{ tab: 'newPlan' }}
            className="btn btn-lg btn-primary"
          >
            <span className="fa fa-plus" />
            {' '}
            <FormattedMessage {...messages.createNewPlan} />
          </Link>
        </div>
      </div>
    );
  }
}
