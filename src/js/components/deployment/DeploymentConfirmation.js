import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import BlankSlate from '../ui/BlankSlate';
import { InlineNotification } from '../ui/InlineNotification';
import Loader from '../ui/Loader';
import { ModalPanelBackdrop,
         ModalPanel,
         ModalPanelHeader,
         ModalPanelBody,
         ModalPanelFooter } from '../ui/ModalPanel';

export default class DeploymentConfirmation extends React.Component {
  renderValidationsWarning() {
    if (!this.props.allValidationsSuccessful) {
      return (
        <InlineNotification className="test"
                            type="warning"
                            title="Not all pre-deployment validations have passed">
          <p>
            It is highly recommended that you resolve all validation issues before continuing.
          </p>
        </InlineNotification>
      );
    }
  }

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
                <p><strong>Summary:</strong> {this.props.environmentSummary}</p>
                {this.renderValidationsWarning()}
                <p>
                  Are you sure you want to deploy this plan? This could take close to 15 minutes,
                  <br/> you will be able to cancel this deployment if you choose.
                </p>
                <DeployButton
                  disabled={currentPlan.isRequestingPlanDeploy}
                  deploy={deployPlan.bind(this, this.props.currentPlan.name)}
                  isRequestingPlanDeploy={currentPlan.isRequestingPlanDeploy}/>
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
  allValidationsSuccessful: React.PropTypes.bool.isRequired,
  currentPlan: ImmutablePropTypes.record.isRequired,
  deployPlan: React.PropTypes.func.isRequired,
  environmentSummary: React.PropTypes.string.isRequired
};


export const DeployButton = ({ deploy,
                               disabled,
                               isRequestingPlanDeploy }) => {
  return (
    <button type="button"
            disabled={disabled}
            className="btn btn-lg btn-primary"
            onClick={() => deploy()}>
      <Loader loaded={!isRequestingPlanDeploy}
              content="Requesting a deploy..."
              component="span"
              inline>
        <span className="fa fa-cloud-upload"/> Deploy
      </Loader>
    </button>
  );
};

DeployButton.propTypes = {
  deploy: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  isRequestingPlanDeploy: React.PropTypes.bool.isRequired
};
