import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';
import LoggerActions from '../../actions/LoggerActions';

const messages = defineMessages({
  downloadLogs: {
    id: 'DownloadLogsModal.downloadLogs',
    defaultMessage: 'Download logs'
  },
  cancel: {
    id: 'DownloadLogsModal.cancel',
    defaultMessage: 'Cancel'
  },
  downloadingLogsLoader: {
    id: 'DownloadLogsModal.downloadingLogsLoader',
    defaultMessage: 'Downloading logs...'
  },
  downloadLogsMessage: {
    id: 'DownloadLogsModal.downloadLogsMessage',
    defaultMessage: 'The file you requested is ready. Please click the button below to ' +
      'download the export. You might need to right-click the button and choose ' +
      '"Save link as...".'
  },
  downloadError: {
    id: 'DownloadLogsModal.error',
    defaultMessage: 'An error has occurred while preparing the log download.'
  }
});

class DownloadLogsModal extends React.Component {
  componentDidMount() {
    this.props.downloadLogs();
  }

  render() {
    return (
      <Modal dialogClasses="modal-sm">
        <div className="modal-header">
          <Link to="/debug" type="button" className="close">
            <span aria-hidden="true" className="pficon pficon-close" />
          </Link>

          <h4 className="modal-title">
            <FormattedMessage {...messages.downloadLogs} />
          </h4>

        </div>

        <div className="modal-body text-center">
          <Loader
            loaded={!this.props.isDownloadingLogs}
            size="lg"
            height={60}
            content={this.props.intl.formatMessage(
              messages.downloadingLogsLoader
            )}
          >
            {this.props.logsUrl
              ? <div>
                  <div>
                    <FormattedMessage {...messages.downloadLogsMessage} />
                  </div>
                  <br />
                  <a href={this.props.logsUrl} className="btn btn-success">
                    <FormattedMessage {...messages.downloadLogs} />
                  </a>
                </div>
              : <div>
                  <FormattedMessage {...messages.downloadError} />
                </div>}
          </Loader>
        </div>
        <div className="modal-footer">
          <Link to="/debug" type="button" className="btn btn-default">
            <FormattedMessage {...messages.cancel} />
          </Link>
        </div>
      </Modal>
    );
  }
}

DownloadLogsModal.propTypes = {
  downloadLogs: PropTypes.func,
  intl: PropTypes.object,
  isDownloadingLogs: PropTypes.bool,
  logsUrl: PropTypes.string,
  params: PropTypes.object
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
  connect(mapStateToProps, mapDispatchToProps)(DownloadLogsModal)
);
