import { fromJS } from 'immutable';

export const SUBMIT = 'review/SUBMIT';
export const SUBMIT_SUCCESS = 'review/SUBMIT_SUCCESS';
export const SUBMIT_FAIL = 'review/SUBMIT_FAIL';

export const REVIEW_FETCH_SINGLE_BY_TOKEN = 'review/REVIEW_FETCH_SINGLE_BY_TOKEN';
export const REVIEW_FETCH_SINGLE_BY_TOKEN_COMPLETE = 'review/REVIEW_FETCH_SINGLE_BY_TOKEN_COMPLETE';
export const REVIEW_FETCH_SINGLE_BY_TOKEN_FAIL = 'review/REVIEW_FETCH_SINGLE_BY_TOKEN_FAIL';

export const REVIEW_FETCH_SINGLE = 'review/REVIEW_FETCH_SINGLE';
export const REVIEW_FETCH_SINGLE_COMPLETE = 'review/REVIEW_FETCH_SINGLE_COMPLETE';
export const REVIEW_FETCH_SINGLE_FAIL = 'review/REVIEW_FETCH_SINGLE_FAIL';

export const UPDATE_CHANGE_FOR_APPLICATION = 'review/UPDATE_CHANGE_FOR_APPLICATION';
export const UPDATE_CHANGE_FOR_APPLICATION_COMPLETE = 'review/UPDATE_CHANGE_FOR_APPLICATION_COMPLETE';
export const UPDATE_CHANGE_FOR_APPLICATION_FAIL = 'review/UPDATE_CHANGE_FOR_APPLICATION_FAIL';

// action creator
function updateChangeForApplication(token, application) {
  return {
    type: UPDATE_CHANGE_FOR_APPLICATION,
    payload: {
      token,
      application,
    },
  };
}

function updateChangeForApplicationFail(errorMsg) {
  return {
    type: UPDATE_CHANGE_FOR_APPLICATION_FAIL,
    errorMsg,
  };
}

function updateChangeForApplicationComplete(payload) {
  return {
    type: UPDATE_CHANGE_FOR_APPLICATION_COMPLETE,
    payload,
  };
}

function fetchReviewSingleByToken(token) {
  return {
    type: REVIEW_FETCH_SINGLE_BY_TOKEN,
    payload: {
      token,
    },
  };
}

function fetchReviewSingleByTokenFail(errorMsg) {
  return {
    type: REVIEW_FETCH_SINGLE_BY_TOKEN_FAIL,
    errorMsg,
  };
}

function fetchReviewSingleByTokenComplete(payload) {
  return {
    type: REVIEW_FETCH_SINGLE_BY_TOKEN_COMPLETE,
    payload,
  };
}

function fetchReviewSingle(id) {
  return {
    type: REVIEW_FETCH_SINGLE,
    id,
  };
}

function fetchReviewSingleFail(id, errorMsg) {
  return {
    type: REVIEW_FETCH_SINGLE_COMPLETE,
    errorMsg,
    id,
  };
}

function fetchReviewSingleComplete(payload) {
  return {
    type: REVIEW_FETCH_SINGLE_FAIL,
    payload,
  };
}

const submitAction = (review, applicationId) => ({
  type: SUBMIT,
  payload: {
    review,
    applicationId,
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


// selector
const getReviewIsSubmitting = ({ review }) => review.get('isSubmitting');
const getReviewSubmitError = ({ review }) => review.get('submitError');

const getReviewIsUpdating = ({ review }) => review.get('isUpdating');
const getReviewUpdateError = ({ review }) => review.get('updateError');

const getReviewIsFetching = ({ review }) => review.get('isFetching');
const getReviewFetchedId = ({ review }) => review.get('fetchedId');
const getReviewFetchError = ({ review }) => review.get('fetchError');

const initialState = fromJS({
  isSubmitting: false,
  submitError: '',
  reviews: {},
  isFetching: false,
  fetchedId: '',
  fetchError: '',
  isUpdating: false,
  updateError: '',
});

function reviewReducer(state = initialState, action) {
  switch (action.type) {
    case REVIEW_FETCH_SINGLE_BY_TOKEN:
      return state.set('isFetching', true);

    case REVIEW_FETCH_SINGLE_BY_TOKEN_COMPLETE: {
      const { payload } = action;
      const { _id } = payload;
      return state
        .set('isFetching', false)
        .set('fetchedId', _id)
        .setIn(['reviews', _id], fromJS(payload));
    }

    case REVIEW_FETCH_SINGLE_BY_TOKEN_FAIL: {
      const { errorMsg } = action;
      return state
        .set('isFetching', false)
        .set('fetchError', errorMsg);
    }


    case REVIEW_FETCH_SINGLE:
      return state.setIn(['reviews', action.id, 'isLoading'], true);

    case REVIEW_FETCH_SINGLE_COMPLETE: {
      const { payload } = action;
      const { _id } = payload;
      return state.setIn(['reviews', _id], fromJS(payload));
    }

    case REVIEW_FETCH_SINGLE_FAIL: {
      const { id, errorMsg } = action;
      return state.setIn(['reviews', id], fromJS({ error: errorMsg }));
    }

    case SUBMIT:
      return state.set('isSubmitting', true)
        .set('submitError', '');
    case SUBMIT_SUCCESS:
      return state.set('isSubmitting', false);
    case SUBMIT_FAIL:
      return state.set('isSubmitting', false)
        .set('submitError', action.errorMessage);

    case UPDATE_CHANGE_FOR_APPLICATION:
      return state.set('isUpdating', true)
        .set('updateError', '');
    case UPDATE_CHANGE_FOR_APPLICATION_COMPLETE:
      return state.set('isUpdating', false);
    case UPDATE_CHANGE_FOR_APPLICATION_FAIL:
      return state.set('isUpdating', false)
        .set('updateError', action.errorMessage);

    default: return state;
  }
}

export default reviewReducer;

export const actions = {
  submitAction,
  submitCompleteAction,
  submitFailAction,

  fetchReviewSingle,
  fetchReviewSingleComplete,
  fetchReviewSingleFail,

  fetchReviewSingleByToken,
  fetchReviewSingleByTokenComplete,
  fetchReviewSingleByTokenFail,

  updateChangeForApplication,
  updateChangeForApplicationComplete,
  updateChangeForApplicationFail,
};

export const selectors = {
  getReviewIsSubmitting,
  getReviewSubmitError,

  getReviewFetchedId,
  getReviewIsFetching,
  getReviewFetchError,

  getReviewIsUpdating,
  getReviewUpdateError,
};
