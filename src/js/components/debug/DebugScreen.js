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
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ModalHeader, ModalTitle, ModalBody } from 'react-bootstrap';

import { CloseModalXButton } from '../ui/Modals';
import LoggerActions from '../../actions/LoggerActions';
import { InlineLoader } from '../ui/Loader';
import { RoutedModal } from '../ui/Modals';

const messages = defineMessages({
  debugPageTitle: {
    id: 'DebugScreen.debugPageTitle',
    defaultMessage: 'Debugging information'
  },
  downloadButton: {
    id: 'DebugScreen.downloadButton',
    defaultMessage: 'Download logs'
  },
  downloadButtonInProgress: {
    id: 'DebugScreen.downloadButtonInProgress',
    defaultMessage: 'Downloading logs...'
  },
  downloadLogs: {
    id: 'DebugScreen.downloadLogs',
    defaultMessage: 'Download logs'
  },
  cancel: {
    id: 'DebugScreen.cancel',
    defaultMessage: 'Cancel'
  },
  downloadingLogsLoader: {
    id: 'DebugScreen.downloadingLogsLoader',
    defaultMessage: 'Downloading logs...'
  },
  downloadLogsMessage: {
    id: 'DebugScreen.downloadLogsMessage',
    defaultMessage:
      'The file you requested is ready. Please click the button below to ' +
      'download the export. You might need to right-click the button and choose ' +
      '"Save link as...".'
  },
  downloadError: {
    id: 'DebugScreen.error',
    defaultMessage: 'An error has occurred while preparing the log download.'
  }
});

class DebugScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      logsHaveBeenRequested: false
    };
  }

  _downloadLogs() {
    this.setState({
      logsHaveBeenRequested: true
    });
    this.props.downloadLogs();
  }

  _renderDownloadButton() {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={this._downloadLogs.bind(this)}
      >
        <InlineLoader
          loaded={!this.props.isDownloadingLogs}
          content={this.props.intl.formatMessage(
            messages.downloadButtonInProgress
          )}
          inverse
        >
          <FormattedMessage {...messages.downloadButton} />
        </InlineLoader>
      </button>
    );
  }

  _renderMessage() {
    if (!this.state.logsHaveBeenRequested || this.props.isDownloadingLogs) {
      return;
    }

    return this.props.logsUrl ? (
      <div>
        <div>
          <FormattedMessage {...messages.downloadLogsMessage} />
        </div>
        <br />
        <a href={this.props.logsUrl} className="btn btn-success">
          <FormattedMessage {...messages.downloadLogs} />
        </a>
      </div>
    ) : (
      <div>
        <FormattedMessage {...messages.downloadError} />
      </div>
    );
  }

  render() {
    return (
      <RoutedModal bsSize="lg">
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <FormattedMessage {...messages.debugPageTitle} />
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {this._renderDownloadButton()}
          {this._renderMessage()}
        </ModalBody>
      </RoutedModal>
    );
  }
}

DebugScreen.propTypes = {
  downloadLogs: PropTypes.func,
  intl: PropTypes.object.isRequired,
  isDownloadingLogs: PropTypes.bool,
  logsUrl: PropTypes.string
};

function mapStateToProps(state) {
  return {
    isDownloadingLogs: state.logger.isDownloadingLogs,
    logsUrl: state.logger.logsUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    downloadLogs: () => dispatch(LoggerActions.downloadLogs())
  };
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DebugScreen)
);
