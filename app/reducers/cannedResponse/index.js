import { fromJS } from 'immutable';
import _keyBy from 'lodash/keyBy';

export const CANNED_RESPONSE_FETCH_LIST = 'cannedResponse/FETCH_LIST';
export const CANNED_RESPONSE_FETCH_LIST_SUCCESS = 'cannedResponse/FETCH_LIST_SUCCESS';
export const CANNED_RESPONSE_FETCH_LIST_FAIL = 'cannedResponse/FETCH_LIST_FAIL';

export const CANNED_RESPONSE_SORTING = 'cannedResponse/SORTING';

// add cannedResponse
export const CANNED_RESPONSE_ADD_NEW = 'cannedResponse/ADD_NEW';
export const CANNED_RESPONSE_ADD_NEW_SUCCESS = 'cannedResponse/ADD_NEW_SUCCESS';
export const CANNED_RESPONSE_ADD_NEW_FAILED = 'cannedResponse/ADD_NEW_FAILED';

// fetch single cannedResponse
export const CANNED_RESPONSE_FETCH_SINGLE = 'cannedResponse/FETCH_SINGLE';
export const CANNED_RESPONSE_FETCH_SINGLE_SUCCESS = 'cannedResponse/FETCH_SINGLE_SUCCESS';
export const CANNED_RESPONSE_FETCH_SINGLE_FAIL = 'cannedResponse/FETCH_SINGLE_FAIL';

// update cannedResponse
export const CANNED_RESPONSE_UPDATE = 'cannedResponse/UPDATE';
export const CANNED_RESPONSE_UPDATE_SUCCESS = 'cannedResponse/UPDATE_SUCCESS';
export const CANNED_RESPONSE_UPDATE_FAIL = 'cannedResponse/UPDATE_FAIL';

// remove cannedResponse
export const CANNED_RESPONSE_REMOVE = 'cannedResponse/CANNED_RESPONSE_REMOVE';
export const CANNED_RESPONSE_REMOVE_SUCCESS = 'cannedResponse/CANNED_RESPONSE_REMOVE_SUCCESS';
export const CANNED_RESPONSE_REMOVE_FAIL = 'cannedResponse/CANNED_RESPONSE_REMOVE_FAIL';

// change page
export const CANNED_RESPONSE_CHANGE_PAGE = 'cannedResponse/CHANGE_PAGE';

export const CANNED_RESPONSE_FETCH_BY_USER = 'cannedResponse/FETCH_BY_USER';
export const CANNED_RESPONSE_FETCH_BY_USER_SUCCESS = 'cannedResponse/FETCH_BY_USER_SUCCESS';
export const CANNED_RESPONSE_FETCH_BY_USER_FAIL = 'cannedResponse/FETCH_BY_USER_FAIL';

function updateCannedResponse(payload) {
  return {
    type: CANNED_RESPONSE_UPDATE,
    payload,
  };
}

function updateCannedResponseSuccess(data) {
  return {
    type: CANNED_RESPONSE_UPDATE_SUCCESS,
    data,
  };
}

function updateCannedResponseFail(errorMsg) {
  return {
    type: CANNED_RESPONSE_UPDATE_FAIL,
    errorMsg,
  };
}

function fetchCannedResponseSingle(id) {
  return {
    type: CANNED_RESPONSE_FETCH_SINGLE,
    id,
  };
}

function fetchCannedResponseSingleFail(id, errorMsg) {
  return {
    type: CANNED_RESPONSE_FETCH_SINGLE_FAIL,
    errorMsg,
    id,
  };
}

function fetchCannedResponseSingleSuccess(payload) {
  return {
    type: CANNED_RESPONSE_FETCH_SINGLE_SUCCESS,
    payload,
  };
}

function fetchListCannedResponse(payload) {
  return {
    type: CANNED_RESPONSE_FETCH_LIST,
    payload,
  };
}

function fetchListCannedResponseSuccess(data, totalCount) {
  return {
    type: CANNED_RESPONSE_FETCH_LIST_SUCCESS,
    data,
    totalCount,
  };
}

function fetchListCannedResponseFail(errMsg) {
  return {
    type: CANNED_RESPONSE_FETCH_LIST_FAIL,
    errorMsg: errMsg,
  };
}

function cannedResponseSorting(payload) {
  return {
    type: CANNED_RESPONSE_SORTING,
    payload,
  };
}

function addNewCannedResponse(payload) {
  return {
    type: CANNED_RESPONSE_ADD_NEW,
    payload,
  };
}

function addNewCannedResponseSuccess(data) {
  return {
    type: CANNED_RESPONSE_ADD_NEW_SUCCESS,
    data,
  };
}

function addNewCannedResponseFail(errMsg) {
  return {
    type: CANNED_RESPONSE_ADD_NEW_FAILED,
    message: errMsg,
  };
}

function removeCannedResponse({ _id }) {
  return {
    type: CANNED_RESPONSE_REMOVE,
    cannedResponseId: _id,
  };
}

function removeCannedResponseSuccess(cannedResponse) {
  return {
    type: CANNED_RESPONSE_REMOVE_SUCCESS,
    cannedResponse,
  };
}

function removeCannedResponseFail(errMsg) {
  return {
    type: CANNED_RESPONSE_REMOVE_FAIL,
    message: errMsg,
  };
}

function changePage(pageIndex, sizePerPage) {
  return {
    type: CANNED_RESPONSE_CHANGE_PAGE,
    pageIndex,
    sizePerPage,
  };
}

function fetchCannedResponseForUser() {
  return {
    type: CANNED_RESPONSE_FETCH_BY_USER,
  };
}

function fetchCannedResponseForUserSuccess(data) {
  return {
    type: CANNED_RESPONSE_FETCH_BY_USER_SUCCESS,
    data,
  };
}

function fetchCannedResponseForUserFail() {
  return {
    type: CANNED_RESPONSE_FETCH_BY_USER_FAIL,
  };
}


export const actions = {
  fetchListCannedResponse,
  fetchListCannedResponseSuccess,
  fetchListCannedResponseFail,
  cannedResponseSorting,
  addNewCannedResponse,
  addNewCannedResponseSuccess,
  addNewCannedResponseFail,
  changePage,
  fetchCannedResponseSingle,
  fetchCannedResponseSingleSuccess,
  fetchCannedResponseSingleFail,
  updateCannedResponse,
  updateCannedResponseSuccess,
  updateCannedResponseFail,
  removeCannedResponse,
  removeCannedResponseSuccess,
  removeCannedResponseFail,
  fetchCannedResponseForUser,
  fetchCannedResponseForUserSuccess,
  fetchCannedResponseForUserFail,
};

// initialState
export const initialState = fromJS({
  cannedResponse: {},
  visibleCannedResponseIds: [],
  isLoading: false,
  totalCount: 0,
  errorMsg: '',
  sorting: fromJS({
    field: 'createdAt',
    order: -1,
  }),
  pagination: fromJS({
    sizePerPage: 20,
    selectedPage: 1,
  }),
  addNew: fromJS({
    inProgress: false,
    message: '',
  }),
  update: fromJS({
    inProgress: false,
    message: '',
  }),
  detail: fromJS({
    inProgress: false,
    message: '',
  }),

  cannedResponseForUser: [],
});

function cannedResponseReducer(state = initialState, action) {
  switch (action.type) {
    case CANNED_RESPONSE_FETCH_LIST:
      return state.set('isLoading', true);

    case CANNED_RESPONSE_FETCH_BY_USER:
      return state.set('isLoading', true);

    case CANNED_RESPONSE_FETCH_LIST_SUCCESS: {
      const { data, totalCount } = action;
      const visibleCannedResponseIds = data.map(({ _id }) => _id);
      const newCannedResponses = state.get('cannedResponse').mergeDeep(fromJS(_keyBy(data, '_id')));

      return state
        .set('isLoading', false)
        .set('cannedResponse', newCannedResponses)
        .set('message', '')
        .set('visibleCannedResponseIds', fromJS(visibleCannedResponseIds))
        .set('totalCount', totalCount);
    }

    case CANNED_RESPONSE_FETCH_BY_USER_SUCCESS: {
      const { data } = action;
      return state
        .set('isLoading', false)
        .set('cannedResponseForUser', data);
    }

    case CANNED_RESPONSE_FETCH_BY_USER_FAIL: {
      return state
        .set('isLoading', false);
    }

    case CANNED_RESPONSE_FETCH_LIST_FAIL:
      return state.set('isLoading', false).set('errorMsg', action.message);

    case CANNED_RESPONSE_SORTING:
      return state
        .setIn(['pagination', 'selectedPage'], 1)
        .set('isLoading', true)
        .set('sorting', fromJS(action.payload));

    case CANNED_RESPONSE_ADD_NEW: {
      return state
        .setIn(['addNew', 'inProgress'], true)
        .setIn(['addNew', 'message'], '');
    }

    case CANNED_RESPONSE_ADD_NEW_SUCCESS: {
      const { _id } = action.data;
      const visibleCannedResponseIds = state.get('visibleCannedResponseIds').toJS();
      const newVisibleCannedResponseIds = [_id, ...visibleCannedResponseIds];

      return state
        .setIn(['addNew', 'inProgress'], false)
        .setIn(['cannedResponse', _id], fromJS(action.data))
        .set('visibleCannedResponseIds', fromJS(newVisibleCannedResponseIds));
    }
    case CANNED_RESPONSE_ADD_NEW_FAILED: {
      const { message } = action;
      return state
        .setIn(['addNew', 'inProgress'], false)
        .setIn(['addNew', 'message'], message);
    }

    case CANNED_RESPONSE_CHANGE_PAGE:
      return state
        .set('isLoading', true)
        .setIn(['pagination', 'selectedPage'], action.pageIndex);

    case CANNED_RESPONSE_FETCH_SINGLE:
      return state.setIn(['cannedResponse', action.id, 'isLoading'], true);

    case CANNED_RESPONSE_FETCH_SINGLE_SUCCESS: {
      const { payload } = action;
      const { _id } = payload;

      return state.setIn(['cannedResponse', _id], fromJS(payload));
    }

    case CANNED_RESPONSE_FETCH_SINGLE_FAIL: {
      const { id, errorMsg } = action;

      return state.setIn(['cannedResponse', id], fromJS({ error: errorMsg }));
    }

    case CANNED_RESPONSE_UPDATE: {
      return state
        .setIn(['update', 'inProgress'], true)
        .setIn(['update', 'message'], '');
    }

    case CANNED_RESPONSE_UPDATE_SUCCESS: {
      const { _id } = action.data;

      return state
        .setIn(['update', 'inProgress'], false)
        .setIn(['cannedResponse', _id], fromJS(action.data));
    }

    case CANNED_RESPONSE_UPDATE_FAIL: {
      const { errorMsg } = action;

      return state
        .setIn(['update', 'inProgress'], false)
        .setIn(['update', 'message'], errorMsg);
    }

    case CANNED_RESPONSE_REMOVE: {
      return state
        .setIn(['update', 'inProgress'], true)
        .setIn(['update', 'message'], '');
    }

    case CANNED_RESPONSE_REMOVE_SUCCESS: {
      const { _id } = action.cannedResponse;
      const visibleCannedResponseIds = state.get('visibleCannedResponseIds').toJS();
      const newVisibleCannedResponseIds = visibleCannedResponseIds.filter(value => value !== _id);
      return state
        .setIn(['update', 'inProgress'], false)
        .deleteIn(['cannedResponse', _id])
        .set('visibleCannedResponseIds', fromJS(newVisibleCannedResponseIds));
    }

    case CANNED_RESPONSE_REMOVE_FAIL: {
      const { errorMsg } = action;

      return state
        .setIn(['update', 'inProgress'], false)
        .setIn(['update', 'message'], errorMsg);
    }

    default:
      return state;
  }
}

export default cannedResponseReducer;
