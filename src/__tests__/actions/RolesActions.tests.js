import RolesActions from '../../js/actions/RolesActions';
import RolesConstants from '../../js/constants/RolesConstants';

describe('Roles actions', () => {
  it('should create an action for pending Roles request', () => {
    const expectedAction = {
      type: RolesConstants.FETCH_ROLES_PENDING
    };
    expect(RolesActions.fetchRolesPending()).toEqual(expectedAction);
  });

  it('should create an action for successful Roles retrieval', () => {
    const normalizedRolesResponse = {
      entities: {
        roles: {
          1: 'first role',
          2: 'second role'
        }
      },
      result: [1, 2]
    };
    const expectedAction = {
      type: RolesConstants.FETCH_ROLES_SUCCESS,
      payload: normalizedRolesResponse.entities.roles
    };
    expect(RolesActions.fetchRolesSuccess(normalizedRolesResponse.entities.roles))
      .toEqual(expectedAction);
  });

  it('should create an action for failed Roles request', () => {
    const expectedAction = {
      type: RolesConstants.FETCH_ROLES_FAILED
    };
    expect(RolesActions.fetchRolesFailed()).toEqual(expectedAction);
  });
});
