import NodesActions from './NodesActions';
import PlansActions from './PlansActions';
import RegisterNodesActions from './RegisterNodesActions';
import ValidationsActions from './ValidationsActions';

export default {
  messageReceived(message) {
    return (dispatch, getState) => {
      const { type, payload } = message.body;
      switch (type) {
      case ('tripleo.baremetal.v1.register_or_update'):
        dispatch(RegisterNodesActions.nodesRegistrationFinished(payload));
        break;

      case ('tripleo.baremetal.v1.introspect'):
        dispatch(NodesActions.nodesIntrospectionFinished(payload));
        break;

      case ('tripleo.baremetal.v1.provide'):
        dispatch(NodesActions.provideNodesFinished(payload));
        break;

      case ('tripleo.validations.v1.run_validation'): {
        dispatch(ValidationsActions.runValidationMessage(payload));
        break;
      }

      case ('tripleo.plan_management.v1.create_deployment_plan'): {
        dispatch(PlansActions.createPlanFinished(payload));
        break;
      }

      default:
        break;
      }
    };
  }
};
