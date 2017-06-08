import React from 'react';
import { Link, Route } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import DownloadLogsModal from './DownloadLogsModal';

const messages = defineMessages({
  debugPageTitle: {
    id: 'DebugScreen.debugPageTitle',
    defaultMessage: 'Debugging information'
  },
  downloadButton: {
    id: 'DebugScreen.downloadButton',
    defaultMessage: 'Download logs'
  }
});

export default class DebugScreen extends React.Component {
  _renderDownloadButton() {
    return (
      <Link to="/debug/download" type="button" className="btn btn-primary">
        <FormattedMessage {...messages.downloadButton} />
      </Link>
    );
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h1><FormattedMessage {...messages.debugPageTitle} /></h1>
        </div>
        <div>
          {this._renderDownloadButton()}
          <Route path="/debug/download" component={DownloadLogsModal} />
        </div>
      </div>
    );
  }
}
