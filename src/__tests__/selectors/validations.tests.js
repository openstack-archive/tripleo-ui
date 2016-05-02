import { List, Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import * as selectors from '../../js/selectors/validations';
import { Validation,
         ValidationStage,
         ValidationResult,
         ValidationsStatusCounts } from '../../js/immutableRecords/validations';

describe(' validations selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  const state = {
    validations: Map({
      isFetching: false,
      validationStages:  Map({
        1: new ValidationStage({
          description: '',
          name: 'testStage',
          visible: false,
          stage: '',
          status: 'new',
          uuid: 1,
          validations: List(['1'])
        })
      }),
      validations: Map({
        1: new Validation({
          description: '',
          latest_result: undefined,
          name: 'testValidation',
          status: 'running',
          results: List([1]),
          uuid: 1
        })
      }),
      validationResults: Map({
        1: new ValidationResult({
          date: undefined,
          detailed_description: Map(),
          status: undefined,
          uuid: 1
        })
      })
    })
  };

  it('provides selector to get nested tree of Validation Stages and Validations', () => {
    expect(selectors.getValidationStages(state)).toEqualImmutable(Map({
      1: new ValidationStage({
        description: '',
        name: 'testStage',
        visible: false,
        stage: '',
        status: 'new',
        uuid: 1,
        validations: List([
          new Validation({
            description: '',
            latest_result: undefined,
            name: 'testValidation',
            status: 'running',
            results: List([1]),
            uuid: 1
          })
        ])
      })
    }));
  });

  it('provides selector to get validation status counts map', () => {
    expect(selectors.getValidationsStatusCounts(state)).toEqualImmutable(
      new ValidationsStatusCounts({
        new: 0,
        running: 1,
        success: 0,
        error: 0,
        failed: 0
      })
    );
  });
});
