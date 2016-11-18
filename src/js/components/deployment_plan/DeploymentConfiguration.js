import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

import NavTab from '../ui/NavTab';
import Modal from '../ui/Modal';

export default class DeploymentConfiguration extends React.Component {
  render() {
    return (
      <Modal dialogClasses="modal-lg">
        <div className="modal-header">
          <Link to={this.props.parentPath}
                type="button"
                className="close">
            <span aria-hidden="true" className="pficon pficon-close"/>
          </Link>
            <h4 className="modal-title">
              <FormattedMessage id="deployment-configuration"
                                defaultMessage="Deployment Configuration"
                                description="Deployment Configuration"/>
            </h4>
        </div>

        <ul className="nav nav-tabs">
          <NavTab to="/deployment-plan/configuration/environment">
            <FormattedMessage id="overall-settings"
                              defaultMessage="Overall Settings"
                              description="Overall Settings"/>
          </NavTab>
          <NavTab to="/deployment-plan/configuration/parameters">
            <FormattedMessage id="parameters"
                              defaultMessage="Parameters"
                              description="Parameters"/>
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
  parentPath: React.PropTypes.string
};
