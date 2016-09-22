import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import BlankSlate from '../ui/BlankSlate';
import { InlineNotification } from '../ui/InlineNotification';
import { ModalPanelBackdrop,
         ModalPanel,
         ModalPanelHeader,
         ModalPanelBody,
         ModalPanelFooter } from '../ui/ModalPanel';

export default class DeploymentConfirmation extends React.Component {
  render() {
    const { currentPlan, deployPlan } = this.props;
    return (
      <div>
        <ModalPanelBackdrop />
        <ModalPanel>
          <ModalPanelHeader>
            <Link to="/deployment-plan"
                  type="button"
                  className="close">
              <span aria-hidden="true" className="pficon pficon-close"/>
            </Link>
            <h2 className="modal-title">
              Deploy Plan {currentPlan.name}
            </h2>
          </ModalPanelHeader>
          <ModalPanelBody>
            <div className="col-sm-12 deployment-summary">
              <BlankSlate iconClass="fa fa-cloud-upload"
                          title={`Deploy Plan ${currentPlan.name}`}>
                <InlineNotification type="warning"
                                    title="Some validations are failed">
                  <div>Hey</div>
                </InlineNotification>
                <ul className="list-group deploy-summary-checklist">
                  <li className="list-group-item">
                    <span className="pficon pficon-error-circle-o"/> There are 3 failed validations
                  </li>
                  <li className="list-group-item">
                    <span className="pficon pficon-error-circle-o"/> There are 3 failed validations
                  </li>
                  <li className="list-group-item">
                    <span className="pficon pficon-error-circle-o"/> There are 3 failed validations
                  </li>
                  <li className="list-group-item">
                    <span className="pficon pficon-error-circle-o"/> There are 3 failed validations
                  </li>
                </ul>
                <p>
                  Are you sure you want to deploy this plan? This could take close to 15 minutes,<br/>
                  you will be able to cancel this deployment if you choose.
                </p>
                <button type="submit" disabled={currentPlan.isRequestingPlanDeploy}
                        className="btn btn-primary btn-lg"
                        onClick={() => deployPlan(currentPlan.name)}>
                  Deploy!
                </button>
              </BlankSlate>
            </div>
          </ModalPanelBody>
          <ModalPanelFooter>
            <Link to="/deployment-plan"
                  type="button"
                  className="btn btn-default">
              Cancel
            </Link>
          </ModalPanelFooter>
        </ModalPanel>
      </div>
    );
  }
}

DeploymentConfirmation.propTypes = {
  currentPlan: ImmutablePropTypes.record.isRequired,
  deployPlan: React.PropTypes.func.isRequired
};
