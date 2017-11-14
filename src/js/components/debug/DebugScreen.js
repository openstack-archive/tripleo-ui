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
import { getAppVersion, getAppVersionGitSha } from '../../selectors/appConfig';

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
  },
  version: {
    id: 'DebugScreen.version',
    defaultMessage: 'Version'
  },
  gitSha: {
    id: 'DebugScreen.gitSha',
    defaultMessage: 'Git Sha'
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

  _renderVersion() {
    const { version, gitSha } = this.props;
    return (
      <div>
        <p>
          <strong>
            <FormattedMessage {...messages.version} />
          </strong>
          : {version} (<FormattedMessage {...messages.gitSha} />: {gitSha})
        </p>
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
          {this._renderVersion()}
          {this._renderDownloadButton()}
          {this._renderMessage()}
        </ModalBody>
      </RoutedModal>
    );
  }
}

DebugScreen.propTypes = {
  downloadLogs: PropTypes.func,
  gitSha: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  isDownloadingLogs: PropTypes.bool,
  logsUrl: PropTypes.string,
  version: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    gitSha: getAppVersionGitSha(state),
    isDownloadingLogs: state.logger.isDownloadingLogs,
    logsUrl: state.logger.logsUrl,
    version: getAppVersion(state)
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
