import {
  takeEvery, select,
  call, put,
} from 'redux-saga/effects';
import get from 'lodash/get';
import {
  REPLIES_SEND_MESSAGE,
  sendReplyMessageSuccess,
  sendReplyMessageFailed,
} from '../../reducers/replies';
import { actions as TICKET_ACTIONS } from '../../reducers/ticket';
import { getConverationById } from '../../reducers/conversations';
import { getUserId } from '../../reducers/auth';
import { sendReplyMessage as sendReplyMessageAPI } from '../../api/reply';

function* sendReplyMessage({ payload }) {
  const {
    conversationId,
    messages,
    localMessageId,
  } = payload;
  const { owner, members, ticketId } = yield select(getConverationById, conversationId);
  const userId = yield select(getUserId);
  const to = userId !== owner ? owner : members[0];
  // from, to, conversation, message
  try {
    const { response, error } = yield call(sendReplyMessageAPI, userId, to, conversationId, messages);
    if (error) throw error;
    const { reply } = get(response, 'data', {});

    yield put(sendReplyMessageSuccess(conversationId, reply, localMessageId));
    yield put(TICKET_ACTIONS.getAction(ticketId));
  } catch (error) {
    console.log('[REPLY SAGA] ERROR: ', error.message || error);
    yield put(sendReplyMessageFailed(conversationId, error.message || error, localMessageId));
  }
}

function* repliesSaga() {
  yield takeEvery(REPLIES_SEND_MESSAGE, sendReplyMessage);
}

export default repliesSaga;
