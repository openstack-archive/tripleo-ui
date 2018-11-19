/**
 * Copyright 2018 Red Hat Inc.
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

import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { MessageDialog, Label } from 'patternfly-react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';

const messages = defineMessages({
  dialogTitle: {
    id: 'AvailableRoleDetailDialog.dialogTitle',
    defaultMessage: 'Detailed Role Information'
  },
  descriptionLabel: {
    id: 'AvailableRoleDetailDialog.descriptionLabel',
    defaultMessage: 'Description:'
  },
  tagsLabel: {
    id: 'AvailableRoleDetailDialog.tagsLabel',
    defaultMessage: 'Tags:'
  },
  networksLabel: {
    id: 'AvailableRoleDetailDialog.networksLabel',
    defaultMessage: 'Networks:'
  },
  servicesLabel: {
    id: 'AvailableRoleDetailDialog.servicesLabel',
    defaultMessage: 'Services:'
  },
  close: {
    id: 'AvailableRoleDetailDialog.close',
    defaultMessage: 'Close'
  },
  disable: {
    id: 'AvailableRoleDetailDialog.disable',
    defaultMessage: 'Disable'
  },
  enable: {
    id: 'AvailableRoleDetailDialog.enable',
    defaultMessage: 'Enable'
  }
});

class AvailableRoleDetailDialog extends Component {
  state = {
    show: false
  };

  primaryAction = () => {
    this.props.toggle();
    this.secondaryAction();
  };

  secondaryAction = () => {
    this.setState(() => ({ show: false }));
  };

  showModal = () => {
    this.setState(() => ({ show: true }));
  };

  render() {
    const {
      enabled,
      intl: { formatMessage },
      role: { name, description, networks, tags, ServicesDefault }
    } = this.props;
    const primaryContent = <p className="lead">{name}</p>;
    const secondaryContent = (
      <Fragment>
        <p>
          <strong>
            <FormattedMessage {...messages.descriptionLabel} />
          </strong>{' '}
          <br />
          {description}
        </p>
        {!tags.isEmpty() && (
          <p>
            <strong>
              <FormattedMessage {...messages.tagsLabel} />
            </strong>{' '}
            {tags.map(t => (
              <span key={t}>
                <Label key={t}>{t}</Label>{' '}
              </span>
            ))}
          </p>
        )}
        <strong>
          <FormattedMessage {...messages.networksLabel} />
        </strong>
        <ul>{networks.map(network => <li key={network}>{network}</li>)}</ul>
        <strong>
          <FormattedMessage {...messages.servicesLabel} />
        </strong>
        <ul>
          {ServicesDefault.map(service => <li key={service}>{service}</li>)}
        </ul>
      </Fragment>
    );

    return (
      <Fragment>
        <a className="link" onClick={this.showModal}>
          {name}
        </a>
        <MessageDialog
          show={this.state.show}
          onHide={this.secondaryAction}
          primaryAction={this.primaryAction}
          secondaryAction={this.secondaryAction}
          primaryActionButtonContent={
            enabled
              ? formatMessage(messages.disable)
              : formatMessage(messages.enable)
          }
          secondaryActionButtonContent={formatMessage(messages.close)}
          title={formatMessage(messages.dialogTitle)}
          primaryContent={primaryContent}
          secondaryContent={secondaryContent}
        />
      </Fragment>
    );
  }
}
AvailableRoleDetailDialog.propTypes = {
  ServicesDefault: ImmutablePropTypes.list.isRequired,
  enabled: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  role: ImmutablePropTypes.record.isRequired,
  toggle: PropTypes.func.isRequired
};

export default injectIntl(AvailableRoleDetailDialog);
