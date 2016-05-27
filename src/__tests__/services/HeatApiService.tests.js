import when from 'when';

import * as utils from '../../js/services/utils';
import HeatApiService from '../../js/services/HeatApiService';

describe('HeatApiService', () => {

  describe('.getStacks() (success)', () => {
    const apiResponse = { stacks: [
      { stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' },
      { stack_name: 'anothercloud', stack_status: 'CREATE_FAILED' }
    ]};
    let result;

    beforeEach(done => {
      spyOn(utils, 'getServiceUrl').and.returnValue('example.com');
      spyOn(HeatApiService, 'request').and.returnValue(when.resolve(apiResponse));
      HeatApiService.getStacks().then(res => {
        result = res;
        done();
      });
    });

    it('returns a stack object based on <planName>', () => {
      expect(result).toEqual(apiResponse);
    });
  });
});
