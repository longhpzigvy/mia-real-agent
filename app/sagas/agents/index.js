import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import _get from 'lodash/get';
import { push } from 'connected-react-router';
import { notification } from 'antd';
import {
  AGENTS_FIND,
  AGENT_CONFIRM,
  findAgentRequestFailed,
  findAgentRequestSuccess,
  agentConfirmSuccessAction,
  agentConfirmFailAction,
  actions as REQUEST_ACTIONS,
} from '../../reducers/requests';
import {
  getConversationById,
  actions as CONVERSATION_ACTIONS,
  selectConversation,
} from '../../reducers/conversations';
import {
  actions,
} from '../../reducers/ticket';
import { findAgent } from '../../api/ticket';
import { acceptAgent } from '../../api/agent';

export function* findAvailableAgent({ payload }) {
  const { conversationId } = payload;
  const conversation = yield select(getConversationById, conversationId);
  const { error } = yield call(findAgent, conversation.ticketId);
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    notification.error({ message });
    yield put(findAgentRequestFailed(conversationId, message));
    return;
  }
  notification.success({ message: 'Agent found' });
  yield put(findAgentRequestSuccess(conversationId));
}

export function* confirmRequest({ payload }) {
  const {
    conversationId,
    ticketId,
    isConfirm,
  } = payload;
  const { error } = yield call(acceptAgent, conversationId, ticketId, isConfirm);
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    yield put(agentConfirmFailAction(message));
    return;
  }
  yield put(agentConfirmSuccessAction());
  yield put(actions.getAllTicketAction());
  yield put(selectConversation(conversationId));
  yield put(CONVERSATION_ACTIONS.userJoinConversation(conversationId));
  if (isConfirm) {
    yield put(push(`/conversation/${conversationId}`));
  } else {
    yield put(REQUEST_ACTIONS.removeRequest(ticketId));
  }
}

function* agentFlow() {
  yield takeLatest(AGENTS_FIND, findAvailableAgent);
  yield takeLatest(AGENT_CONFIRM, confirmRequest);
}

export default agentFlow;
