import { defineMessages, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import DropdownKebab from '../../ui/dropdown/DropdownKebab'
import MenuItemLink from '../../ui/dropdown/MenuItemLink'
import { stackStates } from '../../../constants/StacksConstants'

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
})

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
      return null
    }
    return (
      <MenuItemLink to={`/plans/manage/${planName}/edit`}>
        <FormattedMessage {...messages.edit} />
      </MenuItemLink>
    )
  }

  return (
    <div className="pull-right">
      <DropdownKebab id={`card-actions-${planName}`} pullRight>
        {renderEditAction()}
        <MenuItemLink to={`/plans/manage/${planName}/export`}>
          <FormattedMessage {...messages.export} />
        </MenuItemLink>
        {!stack &&
          <MenuItemLink to={`/plans/manage/${planName}/delete`}>
            <FormattedMessage {...messages.delete} />
          </MenuItemLink>}
      </DropdownKebab>
    </div>
  )
}
PlanActions.propTypes = {
  planName: PropTypes.string.isRequired,
  stack: PropTypes.object
}

export default PlanActions
