/**
 * Copyright 2018 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { Map } from 'immutable';

import {
  DeploymentStatus,
  DeploymentStatusUI
} from '../../js/immutableRecords/deploymentStatus';
import * as DeploymentActions from '../../js/actions/DeploymentActions';
import {
  deploymentStatusByPlan,
  deploymentStatusUI
} from '../../js/reducers/deploymentStatus';
import { deploymentStates } from '../../js/constants/DeploymentConstants';

describe('deploymentStatusByPlan reducer', () => {
  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = deploymentStatusByPlan(undefined, { type: 'undefined-action' });
    });

    it('produces default state', () => {
      expect(state).toEqual(Map());
    });
  });

  describe('getDeploymentStatusSuccess', () => {
    const newDeploymentStatus = {
      status: deploymentStates.DEPLOYING,
      message: 'I am deploying',
      type: 'tripleo.v1.deployment.deploy_plan'
    };

    it('creates plan deployment status', () => {
      expect(
        deploymentStatusByPlan(
          undefined,
          DeploymentActions.getDeploymentStatusSuccess(
            'overcloud',
            newDeploymentStatus
          )
        )
      ).toEqual(Map({ overcloud: new DeploymentStatus(newDeploymentStatus) }));
    });

    it('updates existing plan deployment status rather than overwrite it', () => {
      expect(
        deploymentStatusByPlan(
          Map({ overcloud: new DeploymentStatus(newDeploymentStatus) }),
          DeploymentActions.getDeploymentStatusSuccess('overcloud', {
            status: 'DEPLOYMENT_SUCCESS',
            message: 'Deployment was successful'
          })
        ).getIn(['overcloud', 'type'])
      ).toEqual('tripleo.v1.deployment.deploy_plan');
    });
  });
});

describe('deploymentStatusUI reducer', () => {
  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = deploymentStatusUI(undefined, { type: 'undefined-action' });
    });

    it('produces default state', () => {
      expect(state).toEqual(Map());
    });
  });

  describe('getDeploymentStatusPending', () => {
    it('sets isFetching', () => {
      expect(
        deploymentStatusUI(
          undefined,
          DeploymentActions.getDeploymentStatusPending('overcloud')
        ).getIn(['overcloud', 'isFetching'])
      ).toBe(true);
    });
  });

  describe('getDeploymentStatusFailed', () => {
    it('updates UI state correctly', () => {
      expect(
        deploymentStatusUI(
          undefined,
          DeploymentActions.getDeploymentStatusFailed(
            'overcloud',
            'something went wrong'
          )
        ).get('overcloud')
      ).toEqual(
        new DeploymentStatusUI({
          error: 'something went wrong',
          isLoaded: true,
          isFetching: false
        })
      );
    });
  });

  describe('getDeploymentStatusSuccess', () => {
    it('updates UI state correctly', () => {
      expect(
        deploymentStatusUI(
          undefined,
          DeploymentActions.getDeploymentStatusSuccess('overcloud', {})
        ).get('overcloud')
      ).toEqual(
        new DeploymentStatusUI({
          error: undefined,
          isLoaded: true,
          isFetching: false
        })
      );
    });
  });
});
