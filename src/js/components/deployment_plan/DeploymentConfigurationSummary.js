import { defineMessages, injectIntl } from 'react-intl';
import React from 'react';

import Loader from '../ui/Loader';

const messages = defineMessages({
  loadingCurrentConfiguration: {
    id: 'DeploymentConfigurationSummary.loadingCurrentConfiguration',
    defaultMessage: 'Loading current Deployment Configuration...'
  }
});

class DeploymentConfigurationSummary extends React.Component {
  componentDidMount() {
    if(this.props.planName) {
      this.props.fetchEnvironmentConfiguration(this.props.planName);
    }
  }

  componentDidUpdate() {
    if(this.props.loaded === false && this.props.isFetching === false && this.props.planName) {
      this.props.fetchEnvironmentConfiguration(this.props.planName);
    }
  }

  render() {
    return (
      <Loader loaded={this.props.loaded}
              content={this.props.intl.formatMessage(messages.loadingCurrentConfiguration)}
              component="span"
              inline>
        <span>{this.props.summary}</span>
      </Loader>
    );
  }
}
DeploymentConfigurationSummary.propTypes = {
  fetchEnvironmentConfiguration: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object,
  isFetching: React.PropTypes.bool.isRequired,
  loaded: React.PropTypes.bool.isRequired,
  planName: React.PropTypes.string,
  summary: React.PropTypes.string.isRequired
};

export default injectIntl(DeploymentConfigurationSummary);
