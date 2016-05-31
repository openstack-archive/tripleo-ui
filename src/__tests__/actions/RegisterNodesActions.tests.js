import { browserHistory } from 'react-router';
import when from 'when';
import { Map } from 'immutable';

import MistralApiService from '../../js/services/MistralApiService';
import RegisterNodesActions from '../../js/actions/RegisterNodesActions';
import NodesActions from '../../js/actions/NodesActions';
import NotificationActions from '../../js/actions/NotificationActions';
import * as utils from '../../js/services/utils';
import { IronicNode } from '../../js/immutableRecords/nodes';

let createResolvingPromise = (data) => {
  return () => {
    return when.resolve(data);
  };
};

describe('Asynchronous Register Nodes Action', () => {
  beforeEach(done => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token');
    spyOn(utils, 'getServiceUrl').and.returnValue('mock-url');
    spyOn(RegisterNodesActions, 'startNodesRegistrationPending');
    spyOn(RegisterNodesActions, 'startNodesRegistrationSuccess');
    spyOn(RegisterNodesActions, 'startNodesRegistrationFailed');
    // Mock the service call.
    spyOn(MistralApiService, 'runWorkflow').and.callFake(
      createResolvingPromise({ state: 'RUNNING' })
    );

    const nodesToRegister = Map({
      1: new IronicNode({
        uuid: 1
      })
    });
    // Call the action creator and the resulting action.
    // In this case, dispatch and getState are just empty placeHolders.
    RegisterNodesActions.startNodesRegistration(nodesToRegister)(() => {}, () => {});
    // Call `done` with a minimal timeout.
    setTimeout(() => { done(); }, 1);
  });

  it('dispatches startNodesRegistrationPending', () => {
    expect(RegisterNodesActions.startNodesRegistrationPending).toHaveBeenCalled();
  });

  it('dispatches startNodesRegistrationSuccess', () => {
    expect(RegisterNodesActions.startNodesRegistrationSuccess).toHaveBeenCalledWith();
  });
});

describe('nodesRegistrationFinished', () => {
  beforeEach(() => {
    spyOn(NodesActions, 'addNodes');
    spyOn(NodesActions, 'fetchNodes');
  });

  it('handles successful nodes registration', () => {
    const messagePayload = {
      status: 'SUCCESS',
      registered_nodes: [
        {
          uuid: 1,
          name: 'node1'
        },
        {
          uuid: 2,
          name: 'node2'
        }
      ]
    };
    const normalizedRegisteredNodes = {
      1: { uuid: 1, name: 'node1' },
      2: { uuid: 2, name: 'node2' }
    };
    const successNotification = {
      type: 'success',
      title: 'Nodes Registration Complete',
      message: 'The nodes were successfully registered'
    };

    spyOn(NotificationActions, 'notify');
    spyOn(RegisterNodesActions, 'nodesRegistrationSuccess');
    spyOn(browserHistory, 'push');

    RegisterNodesActions.nodesRegistrationFinished(messagePayload)(() => {}, () => {});

    expect(NodesActions.addNodes).toHaveBeenCalledWith(normalizedRegisteredNodes);
    expect(NodesActions.fetchNodes).toHaveBeenCalledWith();
    expect(NotificationActions.notify).toHaveBeenCalledWith(successNotification);
    expect(RegisterNodesActions.nodesRegistrationSuccess).toHaveBeenCalled();
    expect(browserHistory.push).toHaveBeenCalledWith('/nodes/registered');
  });

  it('handles failed nodes registration', () => {
    const messagePayload = {
      status: 'FAILED',
      message: 'Nodes registration failed for some reason',
      registered_nodes: [
        {
          uuid: 1,
          name: 'node1'
        },
        {
          uuid: 2,
          name: 'node2'
        }
      ]
    };
    const normalizedRegisteredNodes = {
      1: { uuid: 1, name: 'node1' },
      2: { uuid: 2, name: 'node2' }
    };
    const errors = [{
      title: 'Nodes Registration Failed',
      message: JSON.stringify(messagePayload.message)
    }];

    spyOn(RegisterNodesActions, 'nodesRegistrationFailed');
    spyOn(browserHistory, 'push');

    RegisterNodesActions.nodesRegistrationFinished(messagePayload)(() => {}, () => {});

    expect(browserHistory.push).toHaveBeenCalledWith('/nodes/registered/register');
    expect(NodesActions.addNodes).toHaveBeenCalledWith(normalizedRegisteredNodes);
    expect(NodesActions.fetchNodes).toHaveBeenCalledWith();
    expect(RegisterNodesActions.nodesRegistrationFailed).toHaveBeenCalledWith(errors);
  });


});
