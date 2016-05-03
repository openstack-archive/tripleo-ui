import { List, Map } from 'immutable';

import { InitialPlanState } from '../../../js/immutableRecords/plans';
import { CurrentPlanState } from '../../../js/immutableRecords/currentPlan';
import { StacksState } from '../../../js/immutableRecords/stacks';
import { EnvironmentConfigurationState }
  from '../../../js/immutableRecords/environmentConfiguration';
import { mapStateToProps } from '../../../js/components/deployment_plan/DeploymentPlan.js';

describe('DeploymentPlan mapStateToProps', () => {
  describe('hasPlans flag', () => {
    it('returns ``hasPlans`` as `false`', () => {
      let props = mapStateToProps(
        {
          plans: new InitialPlanState({ all: List() }),
          currentPlan: new CurrentPlanState,
          stacks: new StacksState,
          roles: Map({
            loaded: false,
            isFetching: false,
            roles: Map()
          }),
          nodes: Map({
            isFetching: false,
            all: Map()
          }),
          environmentConfiguration: new EnvironmentConfigurationState()
        }
      );
      expect(props.hasPlans).toBe(false);
    });
    it('returns ``hasPlans`` as `false`', () => {
      let props = mapStateToProps(
        {
          plans: new InitialPlanState({ all: List(['foo', 'bar']) }),
          currentPlan: new CurrentPlanState,
          stacks: new StacksState,
          roles: Map({
            loaded: false,
            isFetching: false,
            roles: Map()
          }),
          nodes: Map({
            isFetching: false,
            all: Map()
          }),
          environmentConfiguration: new EnvironmentConfigurationState()
        }
      );
      expect(props.hasPlans).toBe(true);
    });
  });
});
