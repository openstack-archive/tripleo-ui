import React from 'react';
import { Link } from 'react-router';

import NavTab from '../ui/NavTab';

export default class DeploymentConfiguration extends React.Component {
  render() {
    return (
      <div>
        <div className="modal modal-routed in" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <Link to={this.props.parentPath}
                      type="button"
                      className="close">
                  <span aria-hidden="true" className="pficon pficon-close"/>
                </Link>
                <h4 className="modal-title">Deployment Configuration</h4>
              </div>

              <ul className="nav nav-tabs">
                <NavTab to="/deployment-plan/configuration/environment">General</NavTab>
                <NavTab to="/deployment-plan/configuration/parameters">Parameters</NavTab>
              </ul>

              {React.cloneElement(this.props.children,
                                  {currentPlanName: this.props.currentPlanName,
                                   parentPath: this.props.parentPath})}
            </div>
          </div>
        </div>
        <div className="modal-backdrop in"></div>
      </div>
    );
  }
}
DeploymentConfiguration.propTypes = {
  children: React.PropTypes.node,
  currentPlanName: React.PropTypes.string,
  parentPath: React.PropTypes.string};
