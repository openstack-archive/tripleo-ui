import { List, Map } from 'immutable';

import { mapStateToProps } from '../../../js/components/deployment-plan/DeploymentPlan.js';

describe('DeploymentPlan mapStateToProps', () => {
  describe('hasPlans flag', () => {
    it('returns ``hasPlans`` as `false`', () => {
      let props = mapStateToProps(
        {
          plans: Map({ all: List() }),
          roles: Map({
            loaded: false,
            isFetching: false,
            roles: Map()
          }),
          nodes: Map({
            isFetching: false,
            all: Map()
          })
        }
      );
      expect(props.hasPlans).toBe(false);
    });
    it('returns ``hasPlans`` as `false`', () => {
      let props = mapStateToProps(
        {
          plans: Map({ all: List(['foo', 'bar']) }),
          roles: Map({
            loaded: false,
            isFetching: false,
            roles: Map()
          }),
          nodes: Map({
            isFetching: false,
            all: Map()
          })
        }
      );
      expect(props.hasPlans).toBe(true);
    });
  });
});
