import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

import NavTab from '../ui/NavTab';
import Modal from '../ui/Modal';

const messages = defineMessages({
  deploymentConfiguration: {
    id: 'DeploymentConfiguration.deploymentConfiguration',
    defaultMessage: 'Deployment Configuration'
  },
  overallSettings: {
    id: 'DeploymentConfiguration.overallSettings',
    defaultMessage: 'Overall Settings'
  },
  parameters: {
    id: 'DeploymentConfiguration.parameters',
    defaultMessage: 'Parameters'
  }
});

class DeploymentConfiguration extends React.Component {
  render() {
    const { formatMessage } = this.props.intl;

    return (
      <Modal dialogClasses="modal-lg">
        <div className="modal-header">
          <Link to={this.props.parentPath}
                type="button"
                className="close">
            <span aria-hidden="true" className="pficon pficon-close"/>
          </Link>
            <h4 className="modal-title">
              {formatMessage(messages.deploymentConfiguration)}
            </h4>
        </div>

        <ul className="nav nav-tabs">
          <NavTab to="/deployment-plan/configuration/environment">
            {formatMessage(messages.overallSettings)}
          </NavTab>
          <NavTab to="/deployment-plan/configuration/parameters">
            {formatMessage(messages.parameters)}
          </NavTab>
        </ul>

        {React.cloneElement(this.props.children,
                            {currentPlanName: this.props.currentPlanName,
                             parentPath: this.props.parentPath})}
      </Modal>
    );
  }
}
DeploymentConfiguration.propTypes = {
  children: React.PropTypes.node,
  currentPlanName: React.PropTypes.string,
  intl: React.PropTypes.object,
  parentPath: React.PropTypes.string
};

export default injectIntl(DeploymentConfiguration);
