import { List, Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import { Parameter,
         ParametersDefaultState} from '../../js/immutableRecords/parameters';

describe('parameter immutable records', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  it('ParametersDefaultState', () => {
    let state = new ParametersDefaultState();
    expect(state).toEqualImmutable(Map({
      loaded: false,
      isFetching: true,
      form: Map({
        formErrors: List(),
        formFieldErrors: Map()
      }),
      mistralParameters: Map(),
      resourceTree: Map()
    }));
  });

  it('Parameter', () => {
    let state = new Parameter();
    expect(state).toEqualImmutable(Map({
      Default: undefined,
      Description: undefined,
      Label: undefined,
      Name: undefined,
      NoEcho: undefined,
      Type: 'String'
    }));
  });
});
