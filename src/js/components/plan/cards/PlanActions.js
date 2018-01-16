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
import { stackStates } from '../../../constants/StacksConstants';

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

const PlanActions = ({ planName, stack }) => {
  const renderEditAction = () => {
    if (
      stack &&
      [
        stackStates.CREATE_IN_PROGRESS,
        stackStates.UPDATE_IN_PROGRESS,
        stackStates.DELETE_IN_PROGRESS
      ].includes(stack.get('stack_status'))
    ) {
      return null;
    }
    return (
      <MenuItemLink to={`/plans/manage/${planName}/edit`}>
        <FormattedMessage {...messages.edit} />
      </MenuItemLink>
    );
  };

  return (
    <div className="pull-right">
      <DropdownKebab id={`card-actions-${planName}`} pullRight>
        {renderEditAction()}
        <MenuItemLink to={`/plans/manage/${planName}/export`}>
          <FormattedMessage {...messages.export} />
        </MenuItemLink>
        {!stack && (
          <MenuItemLink to={`/plans/manage/${planName}/delete`}>
            <FormattedMessage {...messages.delete} />
          </MenuItemLink>
        )}
      </DropdownKebab>
    </div>
  );
};
PlanActions.propTypes = {
  planName: PropTypes.string.isRequired,
  stack: PropTypes.object
};

export default PlanActions;
