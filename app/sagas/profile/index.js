import {
  takeEvery, call, put, select,
} from 'redux-saga/effects';
import { notification } from 'antd';
import _get from 'lodash/get';
import {
  FETCH_DETAIL, actions, CHECK_PASSWORD,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  USER_ADD_CREDIT_CARD,
  USER_REMOVE_CREDIT_CARD,
  USER_TOP_UP,
  UPDATE_PROFILE_AVATAR,
} from '../../reducers/profile';
import {
  getUserId,
  updateToken,
  AUTH_LOGIN_SUCCESS,
} from '../../reducers/auth';
import * as UserApi from '../../api/user';
import * as UploadApi from '../../api/upload';
import { toI18n } from '../../utils/func-utils';
import { TICKET_CLOSE_SUCCESS } from '../../reducers/ticket';

function* fetchDetail() {
  const userId = yield select(getUserId);
  if (!userId) {
    yield put(actions.fetchDetailFailAction(toI18n('PROFILE_MISSING_USER_ID')));
    return;
  }
  const { response: { data }, error } = yield call(UserApi.getUserProfile, userId);
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    yield put(actions.fetchDetailFailAction(message));
    return;
  }
  yield put(actions.fetchDetailCompleteAction(data));
}

function* checkPassword({ payload }) {
  const { password } = payload;
  const userId = yield select(getUserId);
  const { response, error } = yield call(UserApi.checkPassword, userId, password);
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    yield put(actions.checkPasswordFailAction(message));
    return;
  }
  const { data } = response;
  const { confirmed } = data;
  yield put(actions.checkPasswordCompleteAction(confirmed));
}

function* updateProfile({ payload }) {
  const userId = yield select(getUserId);
  const { profile } = payload;
  const { response, error } = yield call(UserApi.updateUserProfile, userId, profile);
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    notification.error({ message });
    yield put(actions.updateProfileFailAction(message));
  }
  const { data } = response;
  notification.success({ message: toI18n('PROFILE_UPDATE_SUCCESS') });
  yield put(actions.updateProfileCompleteAction(data));
}

function* updateProfileAvatar({ payload }) {
  const userId = yield select(getUserId);
  const { avatar } = payload;
  const { error: uploadError, response: uploadResponse } = yield call(UploadApi.uploadFile, avatar);
  if (uploadError) {
    const message = _get(
      uploadError, 'response.data.message', uploadError.message
    );
    notification.error({ message });
    yield put(actions.updateAvatarFail(message));
  }
  const { fileUrl } = uploadResponse;
  const { response, error } = yield call(UserApi.updateUserProfile, userId, { avatar: fileUrl });
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    notification.error({ message });
    yield put(actions.updateAvatarFail(message));
    return;
  }
  const { data } = response;
  notification.success({ message: toI18n('PROFILE_UPDATE_SUCCESS') });
  yield put(actions.updateAvatarSuccess(data));
}

function* changePassword({ payload }) {
  const userId = yield select(getUserId);
  const { currentPassword, newPassword } = payload;
  const { response, error } = yield call(UserApi.changePassword, userId, currentPassword, newPassword);
  if (error) {
    const errMsg = _get(error, 'response.data.message', error.message);
    notification.error({ message: errMsg });
    yield put(actions.changePasswordFailAction(errMsg));
    return;
  }
  const { data } = response;
  const { token } = data;
  notification.success({ message: toI18n('PROFILE_CHANGE_PASSWORD_FORM_SUCCESS') });
  yield put(actions.changePasswordCompleteAction());
  yield put(updateToken(token));
}

function* addCreditCard({ payload }) {
  const { card } = payload;
  const userId = yield select(getUserId);
  try {
    const { data } = yield call(UserApi.addCreditCard, userId, card);
    notification.success({ message: toI18n('CREDIT_ADD_SUCCESS') });
    yield put(actions.addCreditCardSuccess(data));
  } catch (error) {
    const errMsg = _get(error, 'response.data.message', error.message);
    notification.error({ message: errMsg });
    yield put(actions.addCreditCardFail(errMsg));
  }
}

function* removeCreditCard({ payload }) {
  const { cardId } = payload;
  const userId = yield select(getUserId);
  try {
    const { data } = yield call(UserApi.removeCreditCard, userId, cardId);
    notification.success({ message: toI18n('CREDIT_REMOVE_SUCCESS') });
    yield put(actions.removeCreditCardSuccess(data));
  } catch (error) {
    const errMsg = _get(error, 'response.data.message', error.message);
    notification.error({ message: errMsg });
    yield put(actions.removeCreditCardFail(errMsg));
  }
}

function* topUp({ payload }) {
  const { cardId, amount } = payload;
  const userId = yield select(getUserId);
  try {
    const { data } = yield call(UserApi.topUp, userId, cardId, amount);
    notification.success({ message: toI18n('TOP_UP_SUCCESS') });
    yield put(actions.topUpSuccess(data));
  } catch (error) {
    const errMsg = _get(error, 'response.data.message', error.message);
    notification.error({ message: errMsg });
    yield put(actions.topUpFail(errMsg));
  }
}

function* profileFlow() {
<<<<<<< HEAD
  yield takeEvery([FETCH_DETAIL, TICKET_CLOSE_SUCCESS, AUTH_LOGIN_SUCCESS], fetchDetail);
=======
  yield takeEvery([FETCH_DETAIL, AUTH_LOGIN_SUCCESS, TICKET_CLOSE_SUCCESS], fetchDetail);
>>>>>>> Update Billing model
  yield takeEvery(UPDATE_PROFILE, updateProfile);
  yield takeEvery(CHECK_PASSWORD, checkPassword);
  yield takeEvery(CHANGE_PASSWORD, changePassword);
  yield takeEvery(USER_ADD_CREDIT_CARD, addCreditCard);
  yield takeEvery(USER_REMOVE_CREDIT_CARD, removeCreditCard);
  yield takeEvery(USER_TOP_UP, topUp);
  yield takeEvery(UPDATE_PROFILE_AVATAR, updateProfileAvatar);
}

export default profileFlow;
