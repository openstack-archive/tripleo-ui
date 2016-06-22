import ValidationsActions from '../../js/actions/ValidationsActions';
import ValidationsConstants from '../../js/constants/ValidationsConstants';

describe('Validations actions', () => {
  it('should create an action for pending Validations request', () => {
    const expectedAction = {
      type: ValidationsConstants.FETCH_VALIDATIONS_PENDING
    };
    expect(ValidationsActions.fetchValidationsPending()).toEqual(expectedAction);
  });

  it('should create an action for successful Validations retrieval', () => {
    const normalizedValidations = {
      '512e': {
        description: '',
        metadata: {},
        id: '512e',
        groups: [ 'pre-deployment' ],
        name: 'Advanced Format 512e Support'
      },
      'check-network-gateway': {
        description: '',
        metadata: {},
        id: 'check-network-gateway',
        groups: [ 'pre-deployment' ],
        name: 'Check network_gateway on the provisioning network'
      }
    };
    const expectedAction = {
      type: ValidationsConstants.FETCH_VALIDATIONS_SUCCESS,
      payload: normalizedValidations
    };
    expect(ValidationsActions.fetchValidationsSuccess(normalizedValidations))
      .toEqual(expectedAction);
  });

  it('should create an action for failed Validations request', () => {
    const expectedAction = {
      type: ValidationsConstants.FETCH_VALIDATIONS_FAILED
    };
    expect(ValidationsActions.fetchValidationsFailed()).toEqual(expectedAction);
  });

});
