import { List } from 'immutable';

import { mapStateToProps } from '../../../js/components/deployment-plan/DeploymentPlan.js';
import { InitialPlanState } from '../../../js/immutableRecords/plans';

describe('DeploymentPlan mapStateToProps', () => {
  describe('hasPlans flag', () => {
    it('returns ``hasPlans`` as `false`', () => {
      let props = mapStateToProps({ plans: InitialPlanState({
        all: List()
      })});
      expect(props.hasPlans).toBe(false);
    });
    it('returns ``hasPlans`` as `true`', () => {
      let props = mapStateToProps({ plans: InitialPlanState({
        all: List(['foo', 'bar'])
      })});
      expect(props.hasPlans).toBe(true);
    });
  });
});
