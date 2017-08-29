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

import { defineMessages, FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getFormValues, change } from 'redux-form'
import { pickBy } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

const messages = defineMessages({
  selectAll: {
    id: 'SelectAll.selectAllText',
    defaultMessage: 'Select All'
  },
  deselectAll: {
    id: 'SelectAll.deselectAllText',
    defaultMessage: 'Deselect All'
  }
})

export const selectAll = WrappedComponent => {
  class SelectAllHOC extends Component {
    /*
     * Function to determine if items should be selected or deselected
     * Select all item if none of them is selected
     * Deselect all item if at least one of them is selected
     */
    shouldSelectAll() {
      const { formData, items } = this.props
      return (
        Object.keys(pickBy(formData.values)).length < items.length ||
        items.length === 0
      )
    }

    toggleSelectAll() {
      const { items, itemProperty, selectItem } = this.props
      items.map(item => selectItem(item[itemProperty], this.shouldSelectAll()))
    }

    render() {
      return (
        <WrappedComponent
          disabled={this.props.items.length === 0}
          shouldSelectAll={this.shouldSelectAll()}
          toggleSelectAll={this.toggleSelectAll.bind(this)}
        />
      )
    }
  }
  SelectAllHOC.propTypes = {
    form: PropTypes.string.isRequired,
    formData: PropTypes.object.isRequired,
    itemProperty: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    selectItem: PropTypes.func.isRequired
  }
  SelectAllHOC.defaultProps = {
    formData: {},
    itemProperty: 'uuid'
  }

  const mapStateToProps = (state, ownProps) => ({
    formData: getFormValues(ownProps.form)(state)
  })

  const mapDispatchToProps = (dispatch, ownProps) => ({
    selectItem: (key, value) =>
      dispatch(change(ownProps.form, `values.${key}`, value))
  })

  return connect(mapStateToProps, mapDispatchToProps)(SelectAllHOC)
}

export const SelectAllButton = selectAll(
  ({ disabled, shouldSelectAll, toggleSelectAll }) => (
    <Button
      bsStyle="link"
      onClick={() => toggleSelectAll()}
      disabled={disabled}
    >
      {shouldSelectAll
        ? <FormattedMessage {...messages.selectAll} />
        : <FormattedMessage {...messages.deselectAll} />}
    </Button>
  )
)

export const SelectAllCheckBox = selectAll(
  ({ disabled, shouldSelectAll, toggleSelectAll }) => (
    <input
      disabled={disabled}
      type="checkbox"
      checked={!shouldSelectAll}
      onChange={toggleSelectAll}
    />
  )
)
