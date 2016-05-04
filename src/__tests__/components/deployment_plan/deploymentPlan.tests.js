import { List, Map } from 'immutable';

import { InitialPlanState } from '../../../js/immutableRecords/plans';
import { EnvironmentConfigurationState }
  from '../../../js/immutableRecords/environmentConfiguration';
import { mapStateToProps } from '../../../js/components/deployment_plan/DeploymentPlan.js';

describe('DeploymentPlan mapStateToProps', () => {
  describe('hasPlans flag', () => {
    it('returns ``hasPlans`` as `false`', () => {
      let props = mapStateToProps(
        {
          plans: new InitialPlanState({ all: List() }),
          roles: Map({
            loaded: false,
            isFetching: false,
            roles: Map()
          }),
          nodes: Map({
            isFetching: false,
            all: Map()
          }),
          environmentConfiguration: new EnvironmentConfigurationState(),
          validations: Map()
        }
      );
      expect(props.hasPlans).toBe(false);
    });
    it('returns ``hasPlans`` as `false`', () => {
      let props = mapStateToProps(
        {
          plans: new InitialPlanState({ all: List(['foo', 'bar']) }),
          roles: Map({
            loaded: false,
            isFetching: false,
            roles: Map()
          }),
          nodes: Map({
            isFetching: false,
            all: Map()
          }),
          environmentConfiguration: new EnvironmentConfigurationState(),
          validations: Map()
        }
      );
      expect(props.hasPlans).toBe(true);
    });
  });
});
