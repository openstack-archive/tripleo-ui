import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import { allPreDeploymentValidationsSuccessful } from '../../selectors/validations';
import DeploymentConfirmation from './DeploymentConfirmation';
import DeploymentProgress from './DeploymentProgress';
import DeploymentSuccess from './DeploymentSuccess';
import DeploymentFailure from './DeploymentFailure';
import { getCurrentPlan } from '../../selectors/plans';
import { getCurrentStack,
         getCurrentStackDeploymentProgress } from '../../selectors/stacks';
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
import ValidationsActions from '../../actions/ValidationsActions';

const messages = defineMessages({
  close: {
    id: 'DeploymentDetail.close',
    defaultMessage: 'Close'
  },
  loadingStacksLoader: {
    id: 'DeploymentDetail.loadingStacksLoader',
    defaultMessage: 'Loading Stacks...'
  },
  modalTitle: {
    id: 'DeploymentDetail.modalTitle',
    defaultMessage: 'Plan {planName} deployment'
  }
});

class DeploymentDetail extends React.Component {
  renderStatus() {
    const { allPreDeploymentValidationsSuccessful,
            currentPlan,
            currentStack,
            currentStackDeploymentProgress,
            currentStackResources,
            currentStackResourcesLoaded,
            deployPlan,
            environmentConfigurationSummary,
            fetchStackResources,
            runPreDeploymentValidations,
            stacksLoaded } = this.props;

    if (!currentStack || currentStack.stack_status === stackStates.DELETE_COMPLETE) {
      return (
        <Loader loaded={stacksLoaded}
                content={this.props.intl.formatMessage(messages.loadingStacksLoader)}
                height={40}>
          <DeploymentConfirmation
            allValidationsSuccessful={allPreDeploymentValidationsSuccessful}
            currentPlan={currentPlan}
            deployPlan={deployPlan}
            environmentSummary={environmentConfigurationSummary}
            runPreDeploymentValidations={runPreDeploymentValidations}/>
        </Loader>
      );
    } else if (currentStack.stack_status.match(/PROGRESS/)) {
      return (
        <DeploymentProgress stack={currentStack}
                            stackResources={currentStackResources}
                            deploymentProgress={currentStackDeploymentProgress}
                            stackResourcesLoaded={currentStackResourcesLoaded}
                            fetchStackResources={fetchStackResources} />
      );
    } else if (currentStack.stack_status.match(/COMPLETE/)) {
      return (
        <DeploymentSuccess stack={currentStack}
                           stackResources={currentStackResources}
                           stackResourcesLoaded={currentStackResourcesLoaded}/>
      );
    } else {
      return (
        <DeploymentFailure fetchStackResources={fetchStackResources}
                           stack={currentStack}
                           stackResources={currentStackResources}
                           stackResourcesLoaded={currentStackResourcesLoaded}
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
              <FormattedMessage {...messages.modalTitle}
                                values={{planName: this.props.currentPlan.name}}/>
            </h2>
          </ModalPanelHeader>
          <ModalPanelBody>
            {this.renderStatus()}
          </ModalPanelBody>
          <ModalPanelFooter>
            <Link to="/deployment-plan"
                  type="button"
                  className="btn btn-default">
              <FormattedMessage {...messages.close}/>
            </Link>
          </ModalPanelFooter>
        </ModalPanel>
      </div>
    );
  }
}

DeploymentDetail.propTypes = {
  allPreDeploymentValidationsSuccessful: PropTypes.bool.isRequired,
  currentPlan: ImmutablePropTypes.record.isRequired,
  currentStack: ImmutablePropTypes.record,
  currentStackDeploymentProgress: PropTypes.number.isRequired,
  currentStackResources: ImmutablePropTypes.map,
  currentStackResourcesLoaded: PropTypes.bool.isRequired,
  deployPlan: PropTypes.func.isRequired,
  environmentConfigurationSummary: PropTypes.string,
  fetchStackResources: PropTypes.func.isRequired,
  intl: PropTypes.object,
  runPreDeploymentValidations: PropTypes.func.isRequired,
  stacksLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    allPreDeploymentValidationsSuccessful: allPreDeploymentValidationsSuccessful(state),
    currentPlan: getCurrentPlan(state),
    currentStack: getCurrentStack(state),
    currentStackDeploymentProgress: getCurrentStackDeploymentProgress(state),
    currentStackResources: state.stacks.resources,
    currentStackResourcesLoaded: state.stacks.resourcesLoaded,
    environmentConfigurationSummary: getEnvironmentConfigurationSummary(state),
    stacksLoaded: state.stacks.isLoaded
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deployPlan: planName => dispatch(PlanActions.deployPlan(planName)),
    fetchStackResources: (stack) =>
      dispatch(StacksActions.fetchResources(stack.stack_name, stack.id)),
    runPreDeploymentValidations: planName =>
      dispatch(ValidationsActions.runValidationGroups(['pre-deployment'], planName))
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DeploymentDetail));
