import { fromJS } from 'immutable';

export const FETCH_DETAIL = 'profile/FETCH_DETAIL';
export const FETCH_DETAIL_SUCCESS = 'profile/FETCH_DETAIL_SUCCESS';
export const FETCH_DETAIL_FAIL = 'profile/FETCH_DETAIL_FAIL';

export const CHECK_PASSWORD = 'profile/CHECK_PASSWORD';
export const CHECK_PASSWORD_SUCCESS = 'profile/CHECK_PASSWORD_SUCCESS';
export const CHECK_PASSWORD_FAIL = 'profile/CHECK_PASSWORD_FAIL';

export const UPDATE_PROFILE = 'profile/UPDATE_PROFILE';
export const UPDATE_PROFILE_SUCCESS = 'profile/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAIL = 'profile/UPDATE_PROFILE_FAIL';

export const UPDATE_PROFILE_AVATAR = 'profile/UPDATE_PROFILE_AVATAR';
export const UPDATE_PROFILE_AVATAR_SUCCESS = 'profile/UPDATE_PROFILE_AVATAR_SUCCESS';
export const UPDATE_PROFILE_AVATAR_FAIL = 'profile/UPDATE_PROFILE_AVATAR_FAIL';

export const CHANGE_PASSWORD = 'profile/CHANGE_PASSWORD';
export const CHANGE_PASSWORD_SUCCESS = 'profile/CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL = 'profile/CHANGE_PASSWORD_FAIL';

// Add credit card
export const USER_ADD_CREDIT_CARD = 'profile/USER_ADD_CREDIT_CARD';
export const USER_ADD_CREDIT_CARD_SUCCESS = 'profile/USER_ADD_CREDIT_CARD_SUCCESS';
export const USER_ADD_CREDIT_CARD_FAIL = 'profile/USER_ADD_CREDIT_CARD_FAIL';

// Add credit card
export const USER_REMOVE_CREDIT_CARD = 'profile/USER_REMOVE_CREDIT_CARD';
export const USER_REMOVE_CREDIT_CARD_SUCCESS = 'profile/USER_REMOVE_CREDIT_CARD_SUCCESS';
export const USER_REMOVE_CREDIT_CARD_FAIL = 'profile/USER_REMOVE_CREDIT_CARD_FAIL';

// Add credit card
export const USER_TOP_UP = 'profile/USER_TOP_UP';
export const USER_TOP_UP_SUCCESS = 'profile/USER_TOP_UP_SUCCESS';
export const USER_TOP_UP_FAIL = 'profile/USER_TOP_UP_FAIL';

// action creator
function updateAvatar(avatar) {
  return {
    type: UPDATE_PROFILE_AVATAR,
    payload: {
      avatar,
    },
  };
}

function updateAvatarSuccess(data) {
  return {
    type: UPDATE_PROFILE_AVATAR_SUCCESS,
    payload: data,
  };
}

function updateAvatarFail(errorMessage) {
  return {
    type: UPDATE_PROFILE_AVATAR_FAIL,
    errorMessage,
  };
}

function topUp(cardId, amount) {
  return {
    type: USER_TOP_UP,
    payload: {
      cardId,
      amount,
    },
  };
}

function topUpSuccess(data) {
  return {
    type: USER_TOP_UP_SUCCESS,
    payload: data,
  };
}

function topUpFail(errorMessage) {
  return {
    type: USER_TOP_UP_FAIL,
    errorMessage,
  };
}

function removeCreditCard(cardId) {
  return {
    type: USER_REMOVE_CREDIT_CARD,
    payload: {
      cardId,
    },
  };
}

function removeCreditCardSuccess(data) {
  return {
    type: USER_REMOVE_CREDIT_CARD_SUCCESS,
    payload: data,
  };
}

function removeCreditCardFail(errorMessage) {
  return {
    type: USER_REMOVE_CREDIT_CARD_FAIL,
    errorMessage,
  };
}

function addCreditCard(card) {
  return {
    type: USER_ADD_CREDIT_CARD,
    payload: {
      card,
    },
  };
}

function addCreditCardSuccess(data) {
  return {
    type: USER_ADD_CREDIT_CARD_SUCCESS,
    payload: data,
  };
}

function addCreditCardFail(errorMessage) {
  return {
    type: USER_ADD_CREDIT_CARD_FAIL,
    errorMessage,
  };
}

const fetchDetailAction = () => ({
  type: FETCH_DETAIL,
});

// payload: {
//   username: { type: String },
//   email: { type: String },
//   role: { type: String },
//   profile: {
//     // profile for individual customer
//     firstName: { type: String },
//     lastName: { type: String },
//     position: { type: String }, // position in company
//     dateOfBirth: { type: Date },
//     // profile for business customer
//     companySize: { type: String }, // need to discuss
//     companyFields: [{ type: String }], // company working fields
//     // both
//     company: { type: String },
//     phone: { type: String },
//     address: { type: String },
//   }
// }
const fetchDetailCompleteAction = payload => ({
  type: FETCH_DETAIL_SUCCESS,
  payload,
});

const fetchDetailFailAction = errorMessage => ({
  type: FETCH_DETAIL_FAIL,
  payload: {
    errorMessage,
  },
});

const checkPasswordAction = password => ({
  type: CHECK_PASSWORD,
  payload: {
    password,
  },
});

const checkPasswordCompleteAction = confirmed => ({
  type: CHECK_PASSWORD_SUCCESS,
  payload: confirmed,
});
const checkPasswordFailAction = errorMessage => ({
  type: CHECK_PASSWORD_FAIL,
  payload: {
    errorMessage,
  },
});

const updateProfileAction = profile => ({
  type: UPDATE_PROFILE,
  payload: {
    profile,
  },
});

// payload: same as fetchDetailCompleteAction
const updateProfileCompleteAction = payload => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload,
});

const updateProfileFailAction = errorMessage => ({
  type: UPDATE_PROFILE_FAIL,
  payload: {
    errorMessage,
  },
});

const changePasswordAction = (currentPassword, newPassword) => ({
  type: CHANGE_PASSWORD,
  payload: {
    currentPassword, newPassword,
  },
});

// payload: same as fetchDetailCompleteAction
const changePasswordCompleteAction = () => ({
  type: CHANGE_PASSWORD_SUCCESS,
});

const changePasswordFailAction = errorMessage => ({
  type: CHANGE_PASSWORD_FAIL,
  errorMessage,
});


// selector
const getProfileIsFetching = ({ profile }) => profile.get('isFetching');
const getProfileFetchedProfile = ({ profile }) => profile.get('fetchUser');

const getProfilePasswordIsChecking = ({ profile }) => profile.get('isCheckingPassword');
const getProfilePasswordIsConfirmed = ({ profile }) => profile.get('checkPasswordConfirm');

const getProfileIsUpdating = ({ profile }) => profile.get('isUpdating');
const getProfileUpdateError = ({ profile }) => profile.get('updateError');

const getProfilePasswordIsChanging = ({ profile }) => profile.get('isChangingPassword');
const getProfilePasswordChangeError = ({ profile }) => profile.get('changePasswordError');

const initialState = fromJS({
  isFetching: false,
  fetchError: '',
  fetchUser: {},

  isCheckingPassword: false,
  checkPasswordError: '',
  checkPasswordConfirm: false,

  isUpdating: false,
  updateError: '',

  isChangingPassword: false,
  changePasswordError: '',
});

function profileReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DETAIL:
      return state.set('isFetching', true)
        .set('fetchError', '');
    case FETCH_DETAIL_SUCCESS:
      return state.set('isFetching', false)
        .set('fetchUser', action.payload);
    case FETCH_DETAIL_FAIL:
      return state.set('isFetching', false)
        .set('fetchError', action.errorMessage);

    case CHECK_PASSWORD:
      return state
        .set('isCheckingPassword', true)
        .set('checkPasswordError', '')
        .set('checkPasswordConfirm', false);
    case CHECK_PASSWORD_SUCCESS:
      return state
        .set('isCheckingPassword', false)
        .set('checkPasswordConfirm', action.payload);
    case CHECK_PASSWORD_FAIL:
      return state
        .set('isCheckingPassword', false)
        .set('checkPasswordError', action.errorMessage);

    case UPDATE_PROFILE:
      return state.set('isUpdating', true)
        .set('updateError', '');
    case UPDATE_PROFILE_SUCCESS:
      return state.set('isUpdating', false)
        .set('fetchUser', action.payload);
    case UPDATE_PROFILE_FAIL:
      return state.set('isUpdating', false)
        .set('updateError', action.errorMessage);

    case CHANGE_PASSWORD:
      return state.set('isChangingPassword', true)
        .set('changePasswordError', '');
    case CHANGE_PASSWORD_SUCCESS:
      return state.set('isChangingPassword', false);
    case CHANGE_PASSWORD_FAIL:
      return state.set('isChangingPassword', false)
        .set('changePasswordError', action.errorMessage);

    case USER_TOP_UP:
    case UPDATE_PROFILE_AVATAR:
    case USER_ADD_CREDIT_CARD:
    case USER_REMOVE_CREDIT_CARD:
      return state.set('isUpdating', true)
        .set('updateError', '');

    case USER_TOP_UP_SUCCESS:
    case UPDATE_PROFILE_AVATAR_SUCCESS:
    case USER_REMOVE_CREDIT_CARD_SUCCESS:
    case USER_ADD_CREDIT_CARD_SUCCESS: {
      return state.set('isUpdating', false)
        .set('fetchUser', action.payload);
    }

    case USER_TOP_UP_FAIL:
    case UPDATE_PROFILE_AVATAR_FAIL:
    case USER_ADD_CREDIT_CARD_FAIL:
    case USER_REMOVE_CREDIT_CARD_FAIL:
      return state.set('isUpdating', false)
        .set('updateError', action.errorMessage);

    default: return state;
  }
}

export default profileReducer;

export const actions = {
  updateAvatar,
  updateAvatarSuccess,
  updateAvatarFail,

  fetchDetailAction,
  fetchDetailCompleteAction,
  fetchDetailFailAction,

  checkPasswordAction,
  checkPasswordCompleteAction,
  checkPasswordFailAction,

  updateProfileAction,
  updateProfileCompleteAction,
  updateProfileFailAction,

  changePasswordAction,
  changePasswordCompleteAction,
  changePasswordFailAction,

  addCreditCard,
  addCreditCardFail,
  addCreditCardSuccess,

  removeCreditCard,
  removeCreditCardFail,
  removeCreditCardSuccess,

  topUp,
  topUpFail,
  topUpSuccess,
};

export const selectors = {
  getProfileIsFetching,
  getProfileFetchedProfile,

  getProfilePasswordIsChecking,
  getProfilePasswordIsConfirmed,

  getProfileIsUpdating,
  getProfileUpdateError,

  getProfilePasswordIsChanging,
  getProfilePasswordChangeError,
};
