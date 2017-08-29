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

import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import React from 'react'
import PropTypes from 'prop-types'
import { Form, reduxForm } from 'redux-form'
import { pickBy } from 'lodash'

import NodesActions from '../../../actions/NodesActions'
import { getFilteredNodes, nodesInProgress } from '../../../selectors/nodes'

const messages = defineMessages({
  selectNodes: {
    id: 'NodesListForm.selectNodesValidationMessage',
    defaultMessage: 'Please select Nodes first'
  },
  operationInProgress: {
    id: 'NodesListForm.operationInProgressValidationMessage',
    defaultMessage: 'There is an operation in progress on some of the selected Nodes'
  }
})

class NodesListForm extends React.Component {
  componentWillReceiveProps(nextProps) {
    // remove form values of nodes which are not listed any more
    const removedValues = this.props.nodes
      .keySeq()
      .toSet()
      .subtract(nextProps.nodes.keySeq())
    removedValues.map(v => this.props.change(`values.${v}`, false))
  }

  handleFormSubmit(formData) {
    const nodeIds = Object.keys(pickBy(formData.values, value => !!value))

    switch (formData.submitAction) {
      case 'introspect':
        this.props.introspectNodes(nodeIds)
        break
      case 'provide':
        this.props.provideNodes(nodeIds)
        break
      case 'manage':
        this.props.manageNodes(nodeIds)
        break
      case 'tag':
        this.props.tagNodes(nodeIds, formData.tag)
        break
      case 'delete':
        this.props.deleteNodes(nodeIds)
        break
      default:
        break
    }

    this.props.reset()
  }

  render() {
    return (
      <Form
        onSubmit={this.props.handleSubmit(this.handleFormSubmit.bind(this))}
      >
        {this.props.children}
      </Form>
    )
  }
}
NodesListForm.propTypes = {
  change: PropTypes.func.isRequired,
  children: PropTypes.node,
  deleteNodes: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object,
  introspectNodes: PropTypes.func.isRequired,
  manageNodes: PropTypes.func.isRequired,
  nodes: ImmutablePropTypes.map.isRequired,
  provideNodes: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  tagNodes: PropTypes.func.isRequired
}

const validate = (formData, props) => {
  const errors = {}
  const nodeIds = Object.keys(pickBy(formData.values, value => !!value))
  const selectedInProgress = props.nodesInProgress.intersect(nodeIds).size
  if (nodeIds.length === 0) {
    errors._error = props.intl.formatMessage(messages.selectNodes)
  } else if (selectedInProgress > 0) {
    errors._error = props.intl.formatMessage(messages.operationInProgress)
  }
  return errors
}

const form = reduxForm({
  form: 'nodesListForm',
  initialValues: {
    values: {}
  },
  validate
})

const mapStateToProps = state => ({
  nodes: getFilteredNodes(state),
  nodesInProgress: nodesInProgress(state)
})

const mapDispatchToProps = dispatch => ({
  deleteNodes: nodeIds => dispatch(NodesActions.deleteNodes(nodeIds)),
  introspectNodes: nodeIds =>
    dispatch(NodesActions.startNodesIntrospection(nodeIds)),
  manageNodes: nodeIds => dispatch(NodesActions.startManageNodes(nodeIds)),
  provideNodes: nodeIds => dispatch(NodesActions.startProvideNodes(nodeIds)),
  tagNodes: (nodeIds, tag) => dispatch(NodesActions.tagNodes(nodeIds, tag))
})

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(form(NodesListForm))
)
