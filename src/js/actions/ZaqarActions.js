import NodesActions from './NodesActions';
import PlansActions from './PlansActions';
import RegisterNodesActions from './RegisterNodesActions';

export default {
  messageReceived(message) {
    return (dispatch, getState) => {
      switch (true) {

      case ( message.body.type === 'tripleo.baremetal.v1.register_or_update'):
        dispatch(RegisterNodesActions.nodesRegistrationFinished(message.body.payload));
        break;

      case ( message.body.type === 'tripleo.baremetal.v1.introspect'):
        dispatch(NodesActions.nodesIntrospectionFinished(message.body.payload));
        break;

      case ( message.body.type === 'tripleo.baremetal.v1.provide'):
        dispatch(NodesActions.provideNodesFinished(message.body.payload));
        break;

      case ( message.body.type === 'tripleo.plan_management.v1.list_plans'):
        dispatch(PlansActions.fetchPlansFinished(message.body.payload));
        break;

      default:
        break;
      }
    };
  }
};
