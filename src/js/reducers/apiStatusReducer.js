import ApiStatusConstants from '../constants/ApiStatusConstants';
import { ApiStatusItem, ApiStatusState } from '../immutableRecords/apistatus';

const initialState = new ApiStatusState();

export default function apiStatusReducer(state = initialState, action) {
  switch(action.type) {

  case ApiStatusConstants.FETCH_API_STATUS_PENDING:
    return state.setIn(['services', action.payload.key],
                       new ApiStatusItem({ isLoading: true }));

  case ApiStatusConstants.FETCH_API_STATUS_FAILED:
    return state.setIn(['services', action.payload.key],
                       new ApiStatusItem({ isLoading: false,
                                           success: false,
                                           status: action.payload.error.status,
                                           statusText: action.payload.error.statusText }));

  case ApiStatusConstants.FETCH_API_STATUS_SUCCESS:
    return state.setIn(['services', action.payload.key],
                       new ApiStatusItem({ isLoading: false,
                                           success: true }));

  default:
    return state;

  }
}
