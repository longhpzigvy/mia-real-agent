import { fromJS } from 'immutable';
import _keyBy from 'lodash/keyBy';

export const SUBMIT = 'application/SUBMIT';
export const SUBMIT_SUCCESS = 'application/SUBMIT_SUCCESS';
export const SUBMIT_FAIL = 'application/SUBMIT_FAIL';

export const APPLICATION_SORTING = 'application/APPLICATION_SORTING';
export const APPLICATION_FILTER = 'application/APPLICATION_FILTER';
export const APPLICATION_FETCH = 'application/APPLICATION_FETCH';

export const APPLICATION_CHANGE_PAGE = 'application/APPLICATION_CHANGE_PAGE';

export const APPLICATION_ADMIN_GET_ALL = 'application/ADMIN_GET_ALL';

export const GET_ALL = 'application/GET_ALL';
export const GET_ALL_SUCCESS = 'application/GET_ALL_SUCCESS';
export const GET_ALL_FAIL = 'application/GET_ALL_FAIL';

export const APPLICATION_APPROVE = 'application/APPLICATION_APPROVE';
export const APPLICATION_APPROVE_COMPLETE = 'application/APPLICATION_APPROVE_COMPLETE';
export const APPLICATION_APPROVE_FAIL = 'application/APPLICATION_APPROVE_FAIL';

export const APPLICATION_REJECT = 'application/APPLICATION_REJECT';
export const APPLICATION_REJECT_COMPLETE = 'application/APPLICATION_REJECT_COMPLETE';
export const APPLICATION_REJECT_FAIL = 'application/APPLICATION_REJECT_FAIL';

export const APPLICATION_REVIEW = 'application/APPLICATION_REVIEW';
export const APPLICATION_REVIEW_COMPLETE = 'application/APPLICATION_REVIEW_COMPLETE';
export const APPLICATION_REVIEW_FAIL = 'application/APPLICATION_REVIEW_FAIL';

export const APPLICATION_PENDING = 'application/APPLICATION_PENDING';
export const APPLICATION_PENDING_COMPLETE = 'application/APPLICATION_PENDING_COMPLETE';
export const APPLICATION_PENDING_FAIL = 'application/APPLICATION_PENDING_COMPLETE';

export const APPLICATION_FETCH_SINGLE = 'application/APPLICATION_FETCH_SINGLE';
export const APPLICATION_FETCH_SINGLE_COMPLETE = 'application/APPLICATION_FETCH_SINGLE_COMPLETE';
export const APPLICATION_FETCH_SINGLE_FAIL = 'application/APPLICATION_FETCH_SINGLE_FAIL';

export const APPLICATION_CHECK_INFO = 'application/APPLICATION_CHECK_INFO';
export const APPLICATION_CHECK_INFO_COMPLETE = 'application/APPLICATION_CHECK_INFO_COMPLETE';
export const APPLICATION_CHECK_INFO_FAIL = 'application/APPLICATION_CHECK_INFO_FAIL';

export const APPLICATION_FORM_VALIDATE_STEP = 'application/APPLICATION_FORM_VALIDATE_STEP';
export const APPLICATION_FORM_VALIDATE_STEP_COMPLETE = 'application/APPLICATION_FORM_VALIDATE_STEP_COMPLETE';
export const APPLICATION_FORM_VALIDATE_STEP_FAIL = 'application/APPLICATION_FORM_VALIDATE_STEP_FAIL';

export const APPLICATION_DETAIL_EDIT = 'application/APPLICATION_DETAIL_EDIT';
export const APPLICATION_DETAIL_EDIT_COMPLETE = 'application/APPLICATION_DETAIL_EDIT_COMPLETE';
export const APPLICATION_DETAIL_EDIT_FAIL = 'application/APPLICATION_DETAIL_EDIT_FAIL';

export const APPLICATION_TOGGLE_REVIEW = 'application/APPLICATION_TOGGLE_REVIEW';

// action creator

const applicationToggleReview = toggle => ({
  type: APPLICATION_TOGGLE_REVIEW,
  toggle,
});

// Edit detail action
const applicationDetailEditAction = application => ({
  type: APPLICATION_DETAIL_EDIT,
  payload: { application },
});

const applicationDetailEditCompleteAction = application => ({
  type: APPLICATION_DETAIL_EDIT_COMPLETE,
  application,
});

const applicationDetailEditFailAction = errorMessage => ({
  type: APPLICATION_DETAIL_EDIT_FAIL,
  errorMessage,
});

const applicationFormValidateStepAction = (
  validateFuncAction,
  payload,
  completeActionType,
  failActionType,
) => ({
  type: APPLICATION_FORM_VALIDATE_STEP,
  payload: {
    validateFuncAction,
    payload,
    completeActionType,
    failActionType,
  },
});

const applicationFormValidateStepCompleteAction = () => ({
  type: APPLICATION_FORM_VALIDATE_STEP_COMPLETE,
});

const applicationFormValidateStepFailAction = errorMessage => ({
  type: APPLICATION_FORM_VALIDATE_STEP_FAIL,
  errorMessage,
});

const checkInfoAction = ({ nickname, email }) => ({
  type: APPLICATION_CHECK_INFO,
  payload: {
    nickname,
    email,
  },
});

const checkInfoCompleteAction = nicknameFound => ({
  type: APPLICATION_CHECK_INFO_COMPLETE,
  payload: {
    nicknameFound,
  },
});

const checkInfoFailAction = errorMessage => ({
  type: APPLICATION_CHECK_INFO_FAIL,
  payload: {
    errorMessage,
  },
});


const submitAction = application => ({
  type: SUBMIT,
  payload: {
    application,
  },
});

const submitCompleteAction = payload => ({
  type: SUBMIT_SUCCESS,
  payload,
});

const submitFailAction = errorMessage => ({
  type: SUBMIT_FAIL,
  payload: {
    errorMessage,
  },
});

const applicationAdminGetAll = payload => ({
  type: APPLICATION_ADMIN_GET_ALL,
  payload,
});

const getAllApplicationAction = payload => ({
  type: GET_ALL,
  payload,
});

const getAllApplicationCompleteAction = (data, totalRecord) => ({
  type: GET_ALL_SUCCESS,
  data,
  totalRecord,
});

const getAllApplicationFailAction = errorMsg => ({
  type: GET_ALL_FAIL,
  errorMsg,
});


const sortApplication = payload => ({
  type: APPLICATION_SORTING,
  payload,
});

const filterApplication = payload => ({
  type: APPLICATION_FILTER,
  payload,
});

const changePage = (pageIndex, sizePerPage) => ({
  type: APPLICATION_CHANGE_PAGE,
  pageIndex,
  sizePerPage,
});

const applicationApprove = ({ _id }) => ({
  type: APPLICATION_APPROVE,
  applicationId: _id,
});

const applicationApproveComplete = application => ({
  type: APPLICATION_APPROVE_COMPLETE,
  application,
});

const applicationApproveFail = errorMsg => ({
  type: APPLICATION_APPROVE_FAIL,
  errorMsg,
});

const applicationPending = ({ _id }) => ({
  type: APPLICATION_PENDING,
  applicationId: _id,
});

const applicationPendingComplete = application => ({
  type: APPLICATION_PENDING_COMPLETE,
  application,
});

const applicationPendingFail = errorMsg => ({
  type: APPLICATION_PENDING_FAIL,
  errorMsg,
});

const applicationReject = ({ _id }) => ({
  type: APPLICATION_REJECT,
  applicationId: _id,
});

const applicationRejectComplete = application => ({
  type: APPLICATION_REJECT_COMPLETE,
  application,
});

const applicationRejectFail = errorMsg => ({
  type: APPLICATION_REJECT_FAIL,
  errorMsg,
});

const applicationReview = ({ _id }) => ({
  type: APPLICATION_REVIEW,
  applicationId: _id,
});

const applicationReviewComplete = application => ({
  type: APPLICATION_REVIEW_COMPLETE,
  application,
});

const applicationReviewFail = errorMsg => ({
  type: APPLICATION_REVIEW_FAIL,
  errorMsg,
});

function fetchApplicationSingle(id) {
  return {
    type: APPLICATION_FETCH_SINGLE,
    id,
  };
}

function fetchApplicationSingleFail(id, errorMsg) {
  return {
    type: APPLICATION_FETCH_SINGLE_FAIL,
    errorMsg,
    id,
  };
}

function fetchApplicationSingleComplete(payload) {
  return {
    type: APPLICATION_FETCH_SINGLE_COMPLETE,
    payload,
  };
}

// selector
const getApplicationIsReviewing = ({ application }) => application.get('isReviewing');

const getApplicationIsSubmitting = ({ application }) => application.get('isSubmitting');
const getApplicationSubmitError = ({ application }) => application.get('submitError');

const getApplicationIsValidating = ({ application }) => application.get('isValidating');
const getApplicationValidateError = ({ application }) => application.get('validateError');

export const fetchingObj = {
  isFetching: false,
  errorMsg: '',
};

const initialState = fromJS({
  application: {},

  isSubmitting: false,
  submitError: '',

  isEditting: false,
  editError: '',

  applications: {},
  totalRecord: 0,
  pagination: fromJS({
    selectedPage: 1,
    sizePerPage: 20,
  }),
  visibleApplicationIds: [],
  sorting: fromJS({
    field: 'createdAt',
    order: -1,
  }),
  fetching: fetchingObj,

  isValidating: false,
  validateError: '',

  isReviewing: false,
});

function applicationReducer(state = initialState, action) {
  switch (action.type) {
    case APPLICATION_TOGGLE_REVIEW:
      return state.set('isReviewing', action.toggle);

    case APPLICATION_FORM_VALIDATE_STEP:
      return state.set('isValidating', true)
        .set('validateError', '');
    case APPLICATION_FORM_VALIDATE_STEP_COMPLETE:
      return state.set('isValidating', false);
    case APPLICATION_FORM_VALIDATE_STEP_FAIL:
      return state.set('isValidating', false)
        .set('validateError', action.errorMessage);

    case APPLICATION_DETAIL_EDIT:
      return state.set('isEditting', true)
        .set('editError', '');
    case APPLICATION_DETAIL_EDIT_COMPLETE: {
      const { application } = action;
      const { _id } = application;
      return state
        .set('isEditting', false)
        .setIn(['applications', _id], fromJS(application));
    }
    case APPLICATION_DETAIL_EDIT_FAIL:
      return state.set('isEditting', false)
        .set('editError', action.errorMessage);

    case SUBMIT:
      return state.set('isSubmitting', true)
        .set('submitError', '');
    case SUBMIT_SUCCESS:
      return state.set('isSubmitting', false);
    case SUBMIT_FAIL:
      return state.set('isSubmitting', false)
        .set('submitError', action.errorMessage);

    case APPLICATION_ADMIN_GET_ALL:
    case GET_ALL:
      return state.set('fetching', fromJS({ isFetching: true, errorMsg: '' }));
    case GET_ALL_SUCCESS: {
      const { data, totalRecord } = action;
      const newTickets = state
        .get('applications')
        .merge(fromJS(_keyBy(data, ({ _id }) => _id)));

      const visibleTicketIds = data.map(({ _id }) => _id);

      return state
        .set('visibleApplicationIds', fromJS(visibleTicketIds))
        .set('applications', newTickets)
        .set('totalRecord', totalRecord)
        .set('fetching', fromJS(fetchingObj));
    }
    case GET_ALL_FAIL:
      return state.set('fetching', fromJS({ isFetching: false, errorMsg: action.errorMsg }));
    case APPLICATION_CHANGE_PAGE:
      return state
        .set('fetching', fromJS({ isFetching: true, errorMsg: '' }))
        .setIn(['pagination', 'selectedPage'], action.pageIndex);

    case APPLICATION_FETCH_SINGLE:
      return state.setIn(['applications', action.id, 'isLoading'], true);
    case APPLICATION_FETCH_SINGLE_COMPLETE: {
      const { payload } = action;
      const { _id } = payload;
      return state.setIn(['applications', _id], fromJS(payload));
    }
    case APPLICATION_FETCH_SINGLE_FAIL: {
      const { id, errorMsg } = action;
      return state.setIn(['applications', id], fromJS({ error: errorMsg }));
    }
    case APPLICATION_REVIEW:
    case APPLICATION_PENDING:
    case APPLICATION_APPROVE:
    case APPLICATION_REJECT: {
      return state.setIn(['applications', action.applicationId, 'isLoading'], true);
    }

    case APPLICATION_REVIEW_COMPLETE:
    case APPLICATION_PENDING_COMPLETE:
    case APPLICATION_REJECT_COMPLETE:
    case APPLICATION_APPROVE_COMPLETE: {
      const { application } = action;
      const { _id } = application;
      return state
        .setIn(['applications', _id], fromJS(application));
    }
    default: return state;
  }
}

export default applicationReducer;

export const actions = {
  submitAction,
  submitCompleteAction,
  submitFailAction,

  applicationAdminGetAll,
  sortApplication,
  filterApplication,
  changePage,

  getAllApplicationAction,
  getAllApplicationCompleteAction,
  getAllApplicationFailAction,

  applicationApprove,
  applicationApproveComplete,
  applicationApproveFail,

  applicationReject,
  applicationRejectComplete,
  applicationRejectFail,

  applicationReview,
  applicationReviewComplete,
  applicationReviewFail,

  fetchApplicationSingle,
  fetchApplicationSingleComplete,
  fetchApplicationSingleFail,

  checkInfoAction,
  checkInfoCompleteAction,
  checkInfoFailAction,

  applicationFormValidateStepAction,
  applicationFormValidateStepCompleteAction,
  applicationFormValidateStepFailAction,

  applicationDetailEditAction,
  applicationDetailEditCompleteAction,
  applicationDetailEditFailAction,

  applicationPending,
  applicationPendingComplete,
  applicationPendingFail,

  applicationToggleReview,
};

export const selectors = {
  getApplicationIsReviewing,

  getApplicationIsSubmitting,
  getApplicationSubmitError,

  getApplicationIsValidating,
  getApplicationValidateError,
};
