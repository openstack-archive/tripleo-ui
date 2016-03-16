import { List, Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import { Parameter,
         ParametersDefaultState} from '../../js/immutableRecords/parameters';

describe('parameter immutable records', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  it('ParametersDefaultState', () => {
    let state = ParametersDefaultState();
    expect(state).toEqualImmutable(Map({
      isPending: true,
      form: Map({
        formErrors: List(),
        formFieldErrors: Map()
      }),
      parameters: Map()
    }));
  });

  it('Parameter', () => {
    let state = Parameter();
    expect(state).toEqualImmutable(Map({
      Default: undefined,
      Description: '',
      Label: undefined,
      Name: '',
      NoEcho: undefined,
      Parameters: undefined,
      NestedParameters: undefined,
      Type: ''
    }));
  });
});
