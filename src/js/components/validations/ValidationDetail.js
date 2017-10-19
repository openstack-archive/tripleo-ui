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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { includes } from 'lodash';
import { ModalHeader, ModalTitle, ModalBody } from 'react-bootstrap';

import { Modal } from '../ui/Modals';
import { ValidationStatusIcon } from './ValidationStatusIcon';

const messages = defineMessages({
  close: {
    id: 'ValidationDetail.close',
    defaultMessage: 'Close'
  },
  description: {
    id: 'ValidationDetail.description',
    defaultMessage: 'Description:'
  },
  groups: {
    id: 'ValidationDetail.groups',
    defaultMessage: 'Groups:'
  },
  output: {
    id: 'ValidationDetail.output',
    defaultMessage: 'Output:'
  },
  status: {
    id: 'ValidationDetail.status',
    defaultMessage: 'Status:'
  },
  validationDetail: {
    id: 'ValidationDetail.validationDetail',
    defaultMessage: 'Validation Detail'
  }
});

class ValidationDetail extends React.Component {
  constructor() {
    super();
    this.state = { isPending: false, show: true };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isPending: false });
  }

  /**
   * Decide which validation action to run, if validation is pending (waits for execution to be
   * started) no action can be run
   */
  triggerValidationAction() {
    this.setState({ isPending: true });

    switch (true) {
      case this.state.isPending:
        break;
      case this.props.status === 'running':
        this.props.stopValidation(this.props.results.last().id);
        break;
      default:
        this.props.runValidation();
        break;
    }
  }

  renderValidationGroups() {
    return this.props.groups.map(group => {
      return (
        <small key={group}>
          <span className="label label-default">{group}</span>
          &nbsp;
        </small>
      );
    });
  }

  renderValidationOutput() {
    const lastResult = this.props.results.last();
    if (lastResult && !includes(['running', 'paused'], this.props.status)) {
      return (
        <div>
          <p><strong><FormattedMessage {...messages.output} /></strong></p>
          <pre>
            {lastResult.output.get('stdout', lastResult.output.get('result'))}
          </pre>
        </div>
      );
    }
  }

  render() {
    return (
      <Modal
        bsSize="lg"
        onHide={() => this.setState({ show: false })}
        onExited={this.props.hideValidationDetail}
        show={this.state.show}
      >
        <ModalHeader
          closeButton
          closeLabel={this.props.intl.formatMessage(messages.close)}
        >
          <ModalTitle>
            <FormattedMessage {...messages.validationDetail} />
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="validation-detail-title">
            <div className="list-view-pf-left">
              <ValidationStatusIcon
                status={this.state.isPending ? 'running' : this.props.status}
                triggerValidationAction={this.triggerValidationAction.bind(
                  this
                )}
              />
            </div>
            <h3>{this.props.name}</h3>
          </div>
          <p>
            <strong><FormattedMessage {...messages.description} /></strong>
            {' '}
            <br />
            {this.props.description}
          </p>
          <p>
            <strong><FormattedMessage {...messages.groups} /></strong>
            {' '}
            {this.renderValidationGroups()}
          </p>
          <p>
            <strong><FormattedMessage {...messages.status} /></strong>
            {' '}
            {this.props.status}
          </p>
          {this.renderValidationOutput()}
        </ModalBody>
      </Modal>
    );
  }
}

ValidationDetail.propTypes = {
  description: PropTypes.string,
  groups: ImmutablePropTypes.list.isRequired,
  hideValidationDetail: PropTypes.func,
  intl: PropTypes.object,
  name: PropTypes.string.isRequired,
  results: ImmutablePropTypes.map.isRequired,
  runValidation: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  stopValidation: PropTypes.func.isRequired
};

export default injectIntl(ValidationDetail);
