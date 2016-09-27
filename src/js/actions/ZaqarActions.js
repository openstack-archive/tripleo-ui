import NodesActions from './NodesActions';
import PlansActions from './PlansActions';
import RegisterNodesActions from './RegisterNodesActions';
import ValidationsActions from './ValidationsActions';
import MistralConstants from '../constants/MistralConstants';

export default {
  messageReceived(message) {
    return (dispatch, getState) => {
      const { type, payload } = message.body;
      switch (type) {
      case (MistralConstants.BAREMETAL_REGISTER_OR_UPDATE):
        dispatch(RegisterNodesActions.nodesRegistrationFinished(payload));
        break;

      case (MistralConstants.BAREMETAL_INTROSPECT):
        dispatch(NodesActions.nodesIntrospectionFinished(payload));
        break;

      case (MistralConstants.BAREMETAL_PROVIDE):
        dispatch(NodesActions.provideNodesFinished(payload));
        break;

      case (MistralConstants.VALIDATIONS_RUN): {
        dispatch(ValidationsActions.runValidationMessage(payload));
        break;
      }

      case (MistralConstants.PLAN_CREATE): {
        dispatch(PlansActions.createPlanFinished(payload));
        break;
      }

      case (MistralConstants.DEPLOYMENT_DEPLOY_PLAN): {
        dispatch(PlansActions.deployPlanFinished(payload));
        break;
      }

      default:
        break;
      }
    };
  }
};
