import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

// import action type
export const AUTH_LOGIN = 'auth/LOGIN';
export const AUTH_LOGOUT = 'auth/LOGOUT';
export const AUTH_LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const AUTH_LOGIN_FAIL = 'auth/LOGIN_FAIL';
export const AUTH_REGISTER = 'auth/REGISTER';
export const AUTH_REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
export const AUTH_REGISTER_FAIL = 'auth/REGISTER_FAIL';
export const AUTH_CHANGE_PASSWORD = 'auth/CHANGE_PASSWORD';
export const AUTH_CHANGE_PASSWORD_SUCCESS = 'auth/CHANGE_PASSWORD_SUCCESS';
export const AUTH_CHANGE_PASSWORD_FAIL = 'auth/CHANGE_PASSWORD_FAIL';
export const AUTH_CREATE_PASSWORD = 'auth/CREATE_PASSWORD';
export const AUTH_CREATE_PASSWORD_SUCCESS = 'auth/CREATE_PASSWORD_SUCCESS';
export const AUTH_CREATE_PASSWORD_FAIL = 'auth/CREATE_PASSWORD_FAIL';
export const AUTH_CLEAR_ERROR_MESSAGE = 'auth/CLEAR_ERROR_MESSAGE';
export const AUTH_SET_VERIFYING_EMAIL = 'auth/SET_VERIFYING_EMAIL';
export const AUTH_SEND_VERICATION_EMAIL = 'auth/SEND_VERICATION_EMAIL';
export const AUTH_SEND_VERICATION_EMAIL_SUCCESS = 'auth/SEND_VERICATION_EMAIL_SUCCESS';
export const AUTH_SEND_VERICATION_EMAIL_FAIL = 'auth/SEND_VERICATION_EMAIL_FAIL';

export const AUTH_FORGOT_PASSWORD = 'auth/AUTH_FORGOT_PASSWORD';
export const AUTH_FORGOT_PASSWORD_SUCCESS = 'auth/AUTH_FORGOT_PASSWORD_SUCCESS';
export const AUTH_FORGOT_PASSWORD_FAIL = 'auth/AUTH_FORGOT_PASSWORD_FAIL';

export const AUTH_RESET_PASSWORD = 'auth/AUTH_RESET_PASSWORD';
export const AUTH_RESET_PASSWORD_SUCCESS = 'auth/AUTH_RESET_PASSWORD_SUCCESS';
export const AUTH_RESET_PASSWORD_FAIL = 'auth/AUTH_RESET_PASSWORD_FAIL';

const CLEAR_TRANSACTION = 'root/CLEAR_TRANSACTION';
const UPDATE_TOKEN = 'auth/UPDATE_TOKEN';

// initialState
const initialState = fromJS({
  isLoading: false,
  email: null,
  role: null,
  token: null,
  userId: null,
  username: null,
  isLoggedIn: false,
  verifiedAt: null,
  errorMessage: null,
  isVerifing: false,
  verifyError: null,
  verifyingEmail: null,

  isForgetting: false,
  forgotError: null,

  isResetting: false,
  resetError: null,
});

// action creator
// forgot password creator
export const forgotPasswordAction = email => ({
  type: AUTH_FORGOT_PASSWORD,
  payload: {
    email,
  },
});

export const forgotPasswordSuccessAction = () => ({
  type: AUTH_FORGOT_PASSWORD_SUCCESS,
});

export const forgotPasswordFailAction = errorMessage => ({
  type: AUTH_FORGOT_PASSWORD_FAIL,
  errorMessage,
});


// reset password creator
export const resetPasswordAction = (newPassword, token) => ({
  type: AUTH_RESET_PASSWORD,
  payload: {
    newPassword,
    token,
  },
});

export const resetPasswordSuccessAction = () => ({
  type: AUTH_RESET_PASSWORD_SUCCESS,
});

export const resetPasswordFailAction = errorMessage => ({
  type: AUTH_RESET_PASSWORD_FAIL,
  errorMessage,
});


// update token creator
export const updateToken = token => ({
  type: UPDATE_TOKEN,
  payload: {
    token,
  },
});

// login/logout action creators
export function login({ usernameOrEmail, password }) {
  return {
    type: AUTH_LOGIN,
    payload: {
      usernameOrEmail,
      password,
    },
  };
}

function loginSuccess(authInfo) {
  return {
    type: AUTH_LOGIN_SUCCESS,
    payload: {
      authInfo,
    },
  };
}

function loginFail(errorMessage) {
  return {
    type: AUTH_LOGIN_FAIL,
    errorMessage,
  };
}

function logout() {
  return {
    type: AUTH_LOGOUT,
  };
}

// register action creators
export function register(payload) {
  return {
    type: AUTH_REGISTER,
    payload,
  };
}

function registerSucces() {
  return {
    type: AUTH_REGISTER_SUCCESS,
  };
}

function registerFail(errorMessage) {
  return {
    type: AUTH_REGISTER_FAIL,
    errorMessage,
  };
}

// change password action creators
function changePassword(oldPassword, newPassword) {
  return {
    type: AUTH_CHANGE_PASSWORD,
    payload: {
      oldPassword,
      newPassword,
    },
  };
}

function changePasswordSuccess() {
  return {
    type: AUTH_CHANGE_PASSWORD_SUCCESS,
  };
}

function changePasswordFail(errorMessage) {
  return {
    type: AUTH_CHANGE_PASSWORD_FAIL,
    errorMessage,
  };
}

// create password action creators
function createPassword(newPassword) {
  return {
    type: AUTH_CREATE_PASSWORD,
    payload: {
      newPassword,
    },
  };
}

function createPasswordSuccess() {
  return {
    type: AUTH_CREATE_PASSWORD_SUCCESS,
  };
}

function createPasswordFail(errorMessage) {
  return {
    type: AUTH_CREATE_PASSWORD_FAIL,
    errorMessage,
  };
}

function clearErrorMessage() {
  return {
    type: AUTH_CLEAR_ERROR_MESSAGE,
  };
}

// verify email action creators
function setVerifyingEmail(email) {
  return {
    type: AUTH_SET_VERIFYING_EMAIL,
    email,
  };
}

function sendVericationEmail() {
  return {
    type: AUTH_SEND_VERICATION_EMAIL,
  };
}

function sendVericationEmailSuccess() {
  return {
    type: AUTH_SEND_VERICATION_EMAIL_SUCCESS,
  };
}

function sendVericationEmailFail(errorMessage) {
  return {
    type: AUTH_SEND_VERICATION_EMAIL_FAIL,
    errorMessage,
  };
}

export const actions = {
  login,
  loginSuccess,
  loginFail,
  logout,
  register,
  registerSucces,
  registerFail,
  changePassword,
  changePasswordSuccess,
  changePasswordFail,
  createPassword,
  createPasswordSuccess,
  createPasswordFail,
  clearErrorMessage,
  setVerifyingEmail,
  sendVericationEmail,
  sendVericationEmailSuccess,
  sendVericationEmailFail,
  forgotPasswordSuccessAction,
  forgotPasswordFailAction,
  resetPasswordSuccessAction,
  resetPasswordFailAction,
};

// selector
export const selectAuthenticationReducer = state => state.auth;
export const getAuthenticatedData = createSelector(
  selectAuthenticationReducer,
  (authState) => {
    const email = authState.get('email');
    const username = authState.get('username');
    const role = authState.get('role');
    const token = authState.get('token');
    const userId = authState.get('userId');
    const verifiedAt = authState.get('verifiedAt');

    return {
      email,
      username,
      role,
      token,
      userId,
      verifiedAt,
    };
  },
);

// remove reselect because we don't use nested object anymore
// btw, we shouldn't use nested object if we REALLY don't need it
export const getIsLoading = ({ auth }) => auth.get('isLoading', false);
export const getUserRole = ({ auth }) => auth.get('role');
export const getToken = ({ auth }) => auth.get('token');
export const getUserEmail = ({ auth }) => auth.get('email');
export const getUserId = ({ auth }) => auth.get('userId');
export const getUsername = ({ auth }) => auth.get('username');
export const getCreditTime = ({ auth }) => auth.get('creditTime');
export const checkAuthenticatedStatus = ({ auth }) => !!auth.get('isLoggedIn');
export const selectErrorMessage = ({ auth }) => auth.get('errorMessage');
export const getIsSendingEmail = ({ auth }) => auth.get('isVerifing', false);
export const getVerifyEmailError = ({ auth }) => auth.get('verifyError');
export const getVerifyingEmail = ({ auth }) => auth.get('verifyingEmail');

export const getIsForgetting = ({ auth }) => auth.get('isForgetting');
export const getForgotError = ({ auth }) => auth.get('forgotError');
export const getIsResetting = ({ auth }) => auth.get('isResetting');
export const getResetError = ({ auth }) => auth.get('resetError');

// reducer
function authReducer(state = initialState, action) {
  switch (action.type) {
    // login/logout actions
    case AUTH_LOGIN:
      return state.set('isLoading', true)
        .set('errorMessage', '')
        .set('isLoggedIn', false);

    case AUTH_LOGIN_SUCCESS: {
      const { authInfo } = action.payload;
      return state.set('email', authInfo.email)
        .set('role', authInfo.role)
        .set('token', authInfo.token)
        .set('userId', authInfo.userId)
        .set('verifiedAt', authInfo.verifiedAt)
        .set('username', authInfo.username)
        .set('creditTime', authInfo.creditTime)
        .set('isLoading', false)
        .set('isLoggedIn', true);
    }
    case AUTH_LOGIN_FAIL:
      return state.set('isLoading', false)
        .set('errorMessage', action.errorMessage);

    case AUTH_LOGOUT:
      return initialState;

    // forgot actions
    case AUTH_FORGOT_PASSWORD:
      return state.set('isForgetting', true);

    case AUTH_FORGOT_PASSWORD_SUCCESS:
      return state
        .set('isForgetting', false)
        .set('forgotError', '');

    case AUTH_FORGOT_PASSWORD_FAIL:
      return state.set('isForgetting', false)
        .set('forgotError', action.errorMessage);

    // reset actions
    case AUTH_RESET_PASSWORD:
      return state.set('isResetting', true);

    case AUTH_RESET_PASSWORD_SUCCESS:
      return state
        .set('isResetting', false)
        .set('resetError', '');

    case AUTH_RESET_PASSWORD_FAIL:
      return state.set('isResetting', false)
        .set('resetError', action.errorMessage);

    // register actions
    case AUTH_REGISTER:
      return state.set('isLoading', true);

    case AUTH_REGISTER_SUCCESS:
      return state
        .set('isLoading', false)
        .set('errorMessage', '');

    case AUTH_REGISTER_FAIL:
      return state.set('isLoading', false)
        .set('errorMessage', action.errorMessage);

    // change password actions
    case AUTH_CHANGE_PASSWORD:
      return state.set('isLoading', true);

    case AUTH_CHANGE_PASSWORD_SUCCESS:
      return state.set('errorMessage', '')
        .set('isLoading', false);

    case AUTH_CHANGE_PASSWORD_FAIL:
      return state.set('errorMessage', action.errorMessage)
        .set('isLoading', false);

    // create password actions
    case AUTH_CREATE_PASSWORD:
      return state.set('isLoading', true);

    case AUTH_CREATE_PASSWORD_SUCCESS:
      return state.set('errorMessage', '')
        .set('isLoading', false);

    case AUTH_CREATE_PASSWORD_FAIL:
      return state.set('errorMessage', action.errorMessage)
        .set('isLoading', false);

    case AUTH_CLEAR_ERROR_MESSAGE:
      return state.set('errorMessage', '')
        .set('verifyError', '');

    // verifying email actions
    case AUTH_SET_VERIFYING_EMAIL:
      return state.set('verifyingEmail', action.email);

    case AUTH_SEND_VERICATION_EMAIL:
      return state.set('isVerifing', true);

    case AUTH_SEND_VERICATION_EMAIL_SUCCESS:
      return state.set('isVerifing', false);

    case AUTH_SEND_VERICATION_EMAIL_FAIL:
      return state.set('isVerifing', false)
        .set('verifyError', action.errorMessage);

    case CLEAR_TRANSACTION:
      return state.set('isLoading', false)
        .set('errorMessage', '')
        .set('isVerifing', false)
        .set('verifyError', '');

    case UPDATE_TOKEN: {
      const { payload } = action;
      return state.set('token', payload.token);
    }

    default:
      return state;
  }
}

export default authReducer;
