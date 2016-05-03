import when from 'when';

import * as utils from '../../js/services/utils';
import PlansActions from '../../js/actions/PlansActions';
import TripleOApiService from '../../js/services/TripleOApiService';


// Use these to mock asynchronous functions which return a promise.
// The promise will immediately resolve/reject with `data`.
let createResolvingPromise = (data) => {
  return () => {
    return when.resolve(data);
  };
};

describe('PlansActions', () => {
  beforeEach(() => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token');
  });

  describe('updatePlan', () => {
    beforeEach(done => {
      spyOn(PlansActions, 'updatingPlan');
      spyOn(PlansActions, 'planUpdated');
      spyOn(PlansActions, 'fetchPlans');
      // Mock the service call.
      spyOn(TripleOApiService, 'updatePlan').and.callFake(createResolvingPromise());
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      PlansActions.updatePlan('somecloud', {})(() => {}, () => {});
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('dispatches updatingPlan', () => {
      expect(PlansActions.updatingPlan).toHaveBeenCalledWith('somecloud');
    });

    it('dispatches planUpdated', () => {
      expect(PlansActions.planUpdated).toHaveBeenCalledWith('somecloud');
    });

    it('dispatches fetchPlans', () => {
      expect(PlansActions.fetchPlans).toHaveBeenCalled();
    });
  });

  describe('createPlan', () => {
    beforeEach(done => {
      spyOn(PlansActions, 'creatingPlan');
      spyOn(PlansActions, 'planCreated');
      spyOn(PlansActions, 'fetchPlans');
      // Mock the service call.
      spyOn(TripleOApiService, 'createPlan').and.callFake(createResolvingPromise());
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      PlansActions.createPlan('somecloud', {})(() => {}, () => {});
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('dispatches creatingPlan', () => {
      expect(PlansActions.creatingPlan).toHaveBeenCalled();
    });

    it('dispatches planCreated', () => {
      expect(PlansActions.planCreated).toHaveBeenCalled();
    });

    it('dispatches fetchPlans', () => {
      expect(PlansActions.fetchPlans).toHaveBeenCalled();
    });
  });

  describe('deletePlans', () => {
    beforeEach(done => {
      spyOn(PlansActions, 'deletingPlan');
      spyOn(PlansActions, 'planDeleted');
      spyOn(PlansActions, 'fetchPlans');
      // Mock the service call.
      spyOn(TripleOApiService, 'deletePlan').and.callFake(createResolvingPromise());
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      PlansActions.deletePlan('somecloud')(() => {}, () => {});
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('dispatches deletingPlan', () => {
      expect(PlansActions.deletingPlan).toHaveBeenCalledWith('somecloud');
    });

    it('dispatches planDeleted', () => {
      expect(PlansActions.planDeleted).toHaveBeenCalledWith('somecloud');
    });

    it('dispatches fetchPlans', () => {
      expect(PlansActions.fetchPlans).toHaveBeenCalled();
    });
  });

  describe('fetchPlans', () => {
    let apiResponse = {
      plans: [
        { name: 'overcloud' },
        { name: 'another-cloud' }
      ]
    };

    beforeEach(done => {
      spyOn(PlansActions, 'requestPlans');
      spyOn(PlansActions, 'receivePlans');
      // Mock the service call.
      spyOn(TripleOApiService, 'getPlans').and.callFake(createResolvingPromise(apiResponse));
      // Call the action creator and the resulting action.
      // In this case, dispatch and getState are just empty placeHolders.
      PlansActions.fetchPlans()(() => {}, () => {});
      // Call done with a minimal timeout.
      setTimeout(() => { done(); }, 1);
    });

    it('dispatches requestPlans', () => {
      expect(PlansActions.requestPlans).toHaveBeenCalled();
    });

    it('dispatches receivePlans', () => {
      let expected = {
        result: ['overcloud', 'another-cloud'],
        entities: {
          plan: {
            'overcloud': { name: 'overcloud' },
            'another-cloud': { name: 'another-cloud' }
          }
        }
      };
      expect(PlansActions.receivePlans).toHaveBeenCalledWith(expected);
    });
  });

  describe('fetchPlan', () => {
    let apiResponse = {
      plan: {
        name: 'overcloud',
        files: {
          'overcloud.yaml': {
            contents: 'heat_template_version: 2015-04-30\n'
          },
          'capabilities_map.yaml': {
            contents: 'root_template: overcloud.yaml\n',
            meta: {
              'file-type': 'capabilities-map'
            }
          }
        }
      }
    };

    beforeEach(done => {
      spyOn(TripleOApiService, 'getPlan').and.callFake(createResolvingPromise(apiResponse));
      spyOn(PlansActions, 'requestPlan');
      spyOn(PlansActions, 'receivePlan');
      PlansActions.fetchPlan('overcloud')(() => {}, () => {});
      setTimeout(() => { done(); }, 1);
    });

    it('dispatches requestPlan', () => {
      expect(PlansActions.requestPlan).toHaveBeenCalled();
    });

    it('dispatches receivePlan', () => {
      expect(PlansActions.receivePlan).toHaveBeenCalledWith(apiResponse.plan);
    });

  });
});
