import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
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

export default class DeploymentConfiguration extends React.Component {
  render() {
    return (
      <Modal dialogClasses="modal-xl">
        <div className="modal-header">
          <Link to={this.props.parentPath} type="button" className="close">
            <span aria-hidden="true" className="pficon pficon-close" />
          </Link>
          <h4 className="modal-title">
            <FormattedMessage {...messages.deploymentConfiguration} />
          </h4>
        </div>

        <ul className="nav nav-tabs">
          <NavTab to="/deployment-plan/configuration/environment">
            <FormattedMessage {...messages.overallSettings} />
          </NavTab>
          <NavTab to="/deployment-plan/configuration/parameters">
            <FormattedMessage {...messages.parameters} />
          </NavTab>
        </ul>

        {React.cloneElement(this.props.children, {
          currentPlanName: this.props.currentPlanName,
          parentPath: this.props.parentPath
        })}
      </Modal>
    );
  }
}
DeploymentConfiguration.propTypes = {
  children: PropTypes.node,
  currentPlanName: PropTypes.string,
  parentPath: PropTypes.string
};
