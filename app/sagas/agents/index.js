import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { notification } from 'antd';
import {
  AGENTS_FIND,
  AGENT_CONFIRM,
  findAgentRequestFailed,
  findAgentRequestSuccess,
  agentConfirmSuccessAction,
  agentConfirmFailAction,
} from '../../reducers/agents';
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
  try {
    const { error } = yield call(findAgent, conversation.ticketId);
    if (error) {
      throw error;
    }
    notification.success({ message: 'Agent found' });
    yield put(findAgentRequestSuccess(conversationId));
  } catch (error) {
    const errorMsg = error.message || error;
    notification.error({ message: errorMsg });
    yield put(findAgentRequestFailed(conversationId, errorMsg));
  }
}

export function* confirmRequest({ payload }) {
  const {
    conversationId,
    ticketId,
    isConfirm,
  } = payload;
  try {
    const { error } = yield call(acceptAgent, conversationId, ticketId, isConfirm);
    if (error) {
      throw error;
    }
    yield put(agentConfirmSuccessAction());
    yield put(actions.getAllTicketAction());
    yield put(selectConversation(conversationId));
    yield put(CONVERSATION_ACTIONS.userJoinConversation(conversationId));
    if (isConfirm) yield put(push(`/conversation/${conversationId}`));
  } catch (error) {
    const errorMsg = error.message || error;
    yield put(agentConfirmFailAction(errorMsg));
  }
}

function* agentFlow() {
  yield takeLatest(AGENTS_FIND, findAvailableAgent);
  yield takeLatest(AGENT_CONFIRM, confirmRequest);
}

export default agentFlow;
