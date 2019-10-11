import {
  takeEvery, call, put, select,
} from 'redux-saga/effects';
import _get from 'lodash/get';
import {
  SUBMIT, actions, REVIEW_FETCH_SINGLE_BY_TOKEN,
  UPDATE_CHANGE_FOR_APPLICATION,
} from 'reducers/review';
import { actions as APPLICATION_ACTIONS } from 'reducers/application';
import { notification } from 'antd';
import * as ReviewApi from '../../api/review';
import * as UploadApi from '../../api/upload';
import { getUserId } from '../../reducers/auth';
import history from '../../utils/history';

function* submitReview({ payload }) {
  const { review, applicationId } = payload;
  const userId = yield select(getUserId);
  const { error, response } = yield call(ReviewApi.createReview,
    {
      fields: { ...review },
      applicationId,
      createdBy: userId,
    });
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    notification.error({ message });
    yield put(actions.submitFailAction(message));
    return;
  }

  const { data } = response;
  notification.success({ message: 'Request change submitted' });
  yield put(actions.submitCompleteAction(data));
  yield put(APPLICATION_ACTIONS.fetchApplicationSingle(applicationId));
}

function* getByToken({ payload }) {
  const { token } = payload;
  const { error, response } = yield call(ReviewApi.getByToken, token);
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    notification.error({ message });
    yield put(actions.fetchReviewSingleByTokenFail(message));
    history.push('/login');
    return;
  }

  const { data } = response;
  yield put(actions.fetchReviewSingleByTokenComplete(data));
}

function* uploadApplicationFile(file) {
  const { error, response } = yield call(UploadApi.uploadFile, file);
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    yield put(actions.updateChangeForApplicationFail(message));
    return null;
  }
  const { fileUrl } = response;
  return {
    url: fileUrl,
  };
}

function* handleExperienceCertificate(educations) {
  const mappedEducations = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const education of educations) {
    const { certificate, ...rest } = education;
    const certificateUrls = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const certificateFile of certificate) {
      const { url } = yield uploadApplicationFile(certificateFile);
      certificateUrls.push(url);
    }
    mappedEducations.push({ ...rest, certificate: certificateUrls });
  }
  return mappedEducations;
}


function* updateChangeForApplication({ payload }) {
  const { token } = payload;
  let { application } = payload;
  const { cv, educations } = application;
  if (cv) {
    const cvUrls = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const cvFile of cv) {
      const { url } = yield uploadApplicationFile(cvFile);
      cvUrls.push(url);
    }
    application = { ...application, cv: cvUrls };
  }

  if (educations) {
    const mappedEducations = yield handleExperienceCertificate(educations);
    application = { ...application, educations: mappedEducations };
  }

  const { error, response } = yield call(
    ReviewApi.updateByToken,
    token,
    application,
  );
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    notification.error({ message });
    yield put(actions.updateChangeForApplicationFail(message));
    return;
  }

  const { data } = response;
  notification.success({ message: 'Application Updated' });
  yield put(actions.updateChangeForApplicationComplete(data));
  history.push('/login');
}

function* reviewFlow() {
  yield takeEvery(SUBMIT, submitReview);
  yield takeEvery(REVIEW_FETCH_SINGLE_BY_TOKEN, getByToken);
  yield takeEvery(UPDATE_CHANGE_FOR_APPLICATION, updateChangeForApplication);
}

export default reviewFlow;
