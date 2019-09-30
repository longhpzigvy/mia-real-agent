import {
  takeEvery, select,
  call, put,
} from 'redux-saga/effects';
import get from 'lodash/get';
import {
  REPLIES_SEND_MESSAGE,
  sendReplyMessageSuccess,
  sendReplyMessageFailed,
  REPLIES_SEND_WARNING,
  sendReplyWarningSuccess,
  sendReplyWarningFailed,
  sendReplyWarning as sendWarningAction,
} from '../../reducers/replies';
import { actions as TICKET_ACTIONS } from '../../reducers/ticket';
import { getConverationById } from '../../reducers/conversations';
import { getUserId, getAuthenticatedData } from '../../reducers/auth';
import * as ReplyMessageAPI from '../../api/reply';
import { validateMessage } from './utils';

function* sendReplyMessage({ payload }) {
  const {
    conversationId,
    messages,
    localMessageId,
  } = payload;
  const { owner, members, ticketId } = yield select(getConverationById, conversationId);
  const userId = yield select(getUserId);
  const to = userId !== owner ? owner : members[0];
  // Validate messages
  if (validateMessage(messages)) {
    yield put(sendWarningAction(conversationId, messages));
  }
  // from, to, conversation, message
  try {
    const { response, error } = yield call(ReplyMessageAPI.sendReplyMessage, userId, to, conversationId, messages);
    if (error) throw new Error(error);
    const { reply } = get(response, 'data', {});
    const { username, role } = yield select(getAuthenticatedData);
    yield put(sendReplyMessageSuccess(conversationId, {
      ...reply,
      from: {
        _id: userId,
        username,
        role,
      },
    }, localMessageId));
    yield put(TICKET_ACTIONS.getAction(ticketId));
  } catch (error) {
    console.log('[REPLY SAGA] ERROR: ', error.message || error);
    yield put(sendReplyMessageFailed(conversationId, error.message || error, localMessageId));
  }
}

function* sendReplyWarning({ payload }) {
  const {
    conversationId,
    messages,
  } = payload;
  const userId = yield select(getUserId);
  try {
    const { error } = yield call(ReplyMessageAPI.sendWarningMessage, userId, conversationId, messages);
    if (error) throw new Error(error);
    yield put(sendReplyWarningSuccess(conversationId));
  } catch (error) {
    console.log('[REPLY WARNING SAGA] ERROR: ', error.message || error);
    yield put(sendReplyWarningFailed(conversationId, error.message || error));
  }
}

function* repliesSaga() {
  yield takeEvery(REPLIES_SEND_MESSAGE, sendReplyMessage);
  yield takeEvery(REPLIES_SEND_WARNING, sendReplyWarning);
}

export default repliesSaga;
