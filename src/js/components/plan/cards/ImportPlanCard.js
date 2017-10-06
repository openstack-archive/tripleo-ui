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

import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import { ActionCard } from '../../ui/cards';

const messages = defineMessages({
  importPlan: {
    id: 'ListPlans.importPlan',
    defaultMessage: 'Import Plan'
  }
});

const ImportPlanCard = ({ history }) => (
  <Col sm={6} md={4} lg={3}>
    <ActionCard
      onClick={() => history.push('/plans/manage/new')}
      id="ListPlans__importPlanLink"
    >
      <span className="pficon pficon-add-circle-o" />&nbsp;
      <FormattedMessage {...messages.importPlan} />
    </ActionCard>
  </Col>
);
ImportPlanCard.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(injectIntl(ImportPlanCard));
