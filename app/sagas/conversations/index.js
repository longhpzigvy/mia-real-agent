import {
  takeLatest, call, put, select,
} from 'redux-saga/effects';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { notification } from 'antd';
import { getConversation, getConversationMessage, submitRating } from '../../api/conversation';
import {
  CONVERSATION_FETCH,
  actions,
  CONVERSATION_SET_CURRENT,
  getConverationById,
  fetchConversation as fetchConversationAction,
  CONVERSATION_RATING_SUBMIT,
} from '../../reducers/conversations';
import {
  REPLIES_FETCH,
  fetchReplyMessagesSuccess,
  fetchReplyMessagesFailed,
  getReplyMessagesByConversationId,
  fetchReplyMessages,
} from '../../reducers/replies';
import {
  getConversationActivities,
  fetchConversationActivities,
} from '../../reducers/activities';

function* fetchConversationMessages({ payload }) {
  const { conversationId } = payload;
  if (!conversationId) return;
  try {
    const { response, error } = yield call(getConversationMessage, conversationId);
    if (error) throw error;
    const data = _get(response, 'data', {});

    yield put(fetchReplyMessagesSuccess(conversationId, data));
  } catch (error) {
    console.log('[CONVERSATION SAGA - fetchConversationMessages] ERROR:', error.message);
    yield put(fetchReplyMessagesFailed(conversationId, error.message || error));
  }
}

function* setCurrentConversation({ payload }) {
  const { conversationId } = payload;
  const conversation = yield select(getConverationById, conversationId);
  const replies = yield select(getReplyMessagesByConversationId, conversationId);
  const convActivities = yield select(getConversationActivities, conversationId);

  if (!convActivities || !convActivities.length) {
    yield put(fetchConversationActivities(conversationId));
  }

  if (_isEmpty(conversation)) {
    yield put(fetchConversationAction(conversationId));
  }

  if (_isEmpty(replies)) {
    yield put(fetchReplyMessages(conversationId));
  }
}

function* fetchConversation({ payload }) {
  const { conversationId } = payload;
  try {
    const { response, error } = yield call(getConversation, conversationId);
    if (error) throw error;
    const data = _get(response, 'data', {});

    yield put(actions.fetchConversationSuccess(data));
  } catch (error) {
    console.log('[CONVERSATION SAGA - fetchConversation] ERROR:', error.message);
    yield put(actions.fetchConversationFailed(error.message || error));
  }
}

// function* fetchAllConversationBasedOnTicket({ data }) {
//   for (let i = 0; i < data.length; i += 1) {
//     const ticket = data[i];
//     const { conversationId } = ticket;
//     if (!_isEmpty(conversationId)) {
//       yield put(actions.fetchConversation(conversationId));
//       yield take([
//         CONVERSATION_FETCH_FAILED,
//         CONVERSATION_FETCH_SUCCESS,
//       ]);
//     }
//   }
// }

function* submitConversationRating({ payload }) {
  const { conversationId, rating } = payload;
  try {
    const { response, error } = yield call(submitRating, conversationId, rating);
    if (error) throw error;
    const data = _get(response, 'data', {});
    notification.success({ message: 'Rating submitted' });
    yield put(actions.submitConversationRatingSuccess(data));
  } catch (error) {
    const errorMessage = error.message || error;
    notification.error({ message: errorMessage });
    yield put(actions.submitConversationRatingFailed(errorMessage));
  }
}

function* conversationFlow() {
  yield takeLatest(CONVERSATION_FETCH, fetchConversation);
  yield takeLatest(CONVERSATION_SET_CURRENT, setCurrentConversation);
  // yield takeLatest(TICKET_GET_ALL_SUCCESS, fetchAllConversationBasedOnTicket);
  yield takeLatest(REPLIES_FETCH, fetchConversationMessages);
  yield takeLatest(CONVERSATION_RATING_SUBMIT, submitConversationRating);
}

export default conversationFlow;
