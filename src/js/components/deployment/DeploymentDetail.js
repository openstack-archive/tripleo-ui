import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import { allPreDeploymentValidationsSuccessful } from '../../selectors/validations';
import DeploymentConfirmation from './DeploymentConfirmation';
import DeploymentProgress from './DeploymentProgress';
import DeploymentSuccess from './DeploymentSuccess';
import DeploymentFailure from './DeploymentFailure';
import { getCurrentPlan } from '../../selectors/plans';
import { getCurrentStack } from '../../selectors/stacks';
import { getEnvironmentConfigurationSummary } from '../../selectors/environmentConfiguration';
import Loader from '../ui/Loader';
import { ModalPanelBackdrop,
         ModalPanel,
         ModalPanelHeader,
         ModalPanelBody,
         ModalPanelFooter } from '../ui/ModalPanel';
import PlanActions from '../../actions/PlansActions';
import { stackStates } from '../../constants/StacksConstants';
import StacksActions from '../../actions/StacksActions';

class DeploymentDetail extends React.Component {
  renderStatus() {
    const { allPreDeploymentValidationsSuccessful,
            currentPlan,
            currentStack,
            deployPlan,
            environmentConfigurationSummary,
            fetchStack,
            stacksLoaded } = this.props;

    if (!currentStack || currentStack.stack_status === stackStates.DELETE_COMPLETE) {
      return (
        <Loader loaded={stacksLoaded}
                content="Loading Stacks..."
                height={40}>
          <DeploymentConfirmation
            allValidationsSuccessful={allPreDeploymentValidationsSuccessful}
            currentPlan={currentPlan}
            deployPlan={deployPlan}
            environmentSummary={environmentConfigurationSummary}/>
        </Loader>
      );
    } else if (currentStack.stack_status.match(/PROGRESS/)) {
      return (
        <DeploymentProgress stack={currentStack}
                            fetchStack={fetchStack} />
      );
    } else if (currentStack.stack_status.match(/COMPLETE/)) {
      return (
        <DeploymentSuccess stack={currentStack}
                           planName={currentPlan.name}/>
      );
    } else {
      return (
        <DeploymentFailure fetchStack={fetchStack}
                           stack={currentStack}
                           planName={currentPlan.name}/>
      );
    }
  }

  render() {
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
              Plan {this.props.currentPlan.name} deployment
            </h2>
          </ModalPanelHeader>
          <ModalPanelBody>
            {this.renderStatus()}
          </ModalPanelBody>
          <ModalPanelFooter>
            <Link to="/deployment-plan"
                  type="button"
                  className="btn btn-default">
              Close
            </Link>
          </ModalPanelFooter>
        </ModalPanel>
      </div>
    );
  }
}

DeploymentDetail.propTypes = {
  allPreDeploymentValidationsSuccessful: React.PropTypes.bool.isRequired,
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  deployPlan: React.PropTypes.func.isRequired,
  environmentConfigurationSummary: React.PropTypes.string,
  fetchStack: React.PropTypes.func.isRequired,
  stacksLoaded: React.PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    allPreDeploymentValidationsSuccessful: allPreDeploymentValidationsSuccessful(state),
    currentPlan: getCurrentPlan(state),
    currentStack: getCurrentStack(state),
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state),
    stacksLoaded: state.stacks.isLoaded
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deployPlan: planName => dispatch(PlanActions.deployPlan(planName)),
    fetchStack: (stack) => dispatch(StacksActions.fetchStack(stack.stack_name, stack.id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentDetail);
