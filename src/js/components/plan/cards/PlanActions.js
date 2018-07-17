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
import PropTypes from 'prop-types';
import React from 'react';

import DropdownKebab from '../../ui/dropdown/DropdownKebab';
import MenuItemLink from '../../ui/dropdown/MenuItemLink';
import { deploymentStates } from '../../../constants/DeploymentConstants';

const messages = defineMessages({
  edit: {
    id: 'PlanActions.edit',
    defaultMessage: 'Edit'
  },
  export: {
    id: 'PlanActions.export',
    defaultMessage: 'Export'
  },
  delete: {
    id: 'PlanActions.delete',
    defaultMessage: 'Delete'
  }
});

const canRenderDeleteAction = status => status === deploymentStates.UNDEPLOYED;
const canRenderEditAction = status =>
  ![deploymentStates.DEPLOYING, deploymentStates.UNDEPLOYING].includes(status);

const PlanActions = ({ planName, status }) => (
  <div className="pull-right">
    <DropdownKebab id={`card-actions-${planName}`} pullRight>
      {canRenderEditAction(status) && (
        <MenuItemLink
          to={`/plans/manage/${planName}/edit`}
          className="ListPlans__editPlan"
        >
          <FormattedMessage {...messages.edit} />
        </MenuItemLink>
      )}
      <MenuItemLink
        to={`/plans/manage/${planName}/export`}
        className="ListPlans__exportPlan"
      >
        <FormattedMessage {...messages.export} />
      </MenuItemLink>
      {canRenderDeleteAction(status) && (
        <MenuItemLink
          to={`/plans/manage/${planName}/delete`}
          className="ListPlans__deletePlan"
        >
          <FormattedMessage {...messages.delete} />
        </MenuItemLink>
      )}
    </DropdownKebab>
  </div>
);
PlanActions.propTypes = {
  planName: PropTypes.string.isRequired,
  status: PropTypes.string
};

export default PlanActions;
