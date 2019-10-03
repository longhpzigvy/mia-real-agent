import {
  take, takeEvery, call, put, select, all, takeLatest,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import socketIOClient from 'socket.io-client';
import { notification } from 'antd';
import {
  getToken,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  getUserId,
} from '../../reducers/auth';
import { addNewMessage, fetchReplyMessages } from '../../reducers/replies';
import { actions as TICKET_ACTIONS } from '../../reducers/ticket';
import { actions as REQUEST_ACTIONS } from '../../reducers/requests';
import { actions as PROFILE_ACTIONS } from '../../reducers/profile';
import {
  actions as CONVERSATION_ACTIONS, fetchConversation,
  USER_JOIN_CONVERSATION, USER_TYPING, getCurrentConveration, USER_LEFT_CONVERSATION,
} from '../../reducers/conversations';
import { SOCKET_EMIT, REPLY_TYPE, TICKET_STATUS } from '../../../common/enums';
import history from '../../utils/history';


let socketConnection;

function createSocketChannel(socket, type) {
  return eventChannel((dispatch) => {
    socket.on(type, dispatch);

    const unsubscribe = () => {
      socket.off(type, dispatch);
    };
    return unsubscribe;
  });
}

function createSocketConnection(token) {
  // const endpoint = process.env.SOCKETIO_ENDPOINT;
  const socket = socketIOClient('/', {
    path: '/chat',
    upgradeTimeout: 30000, // 5 minutes
  });
  socket.heartbeatTimeout = 1000;
  socket.on('connect', () => {
    socket
      .emit('authenticate', { token }) // send the jwt
      .on('unauthorized', (msg) => {
        console.log(`[SOCKET] Unauthorized: ${JSON.stringify(msg.data)}`);
        // socket.disconnect();
      })
      .on('disconnect', (reason) => {
        console.log('[SOCKET] Server disconnected', reason);
        // socketConnection.connect();
      });
  });
  return socket;
}

function* handleNewMessage() {
  const socketChannel = yield call(createSocketChannel, socketConnection, SOCKET_EMIT.NEW_MESSAGE);

  // watch message and relay the action
  while (true) {
    const { conversationId, reply } = yield take(socketChannel);
    yield put(addNewMessage(conversationId, reply));
    const { type, params } = reply;
    if (type === REPLY_TYPE.TICKET_STATUS) {
      const { status } = params;
      if (status === TICKET_STATUS.SOLVED) {
        yield put(PROFILE_ACTIONS.fetchDetailAction());
      }
    }
  }
}

function* requestAgent() {
  const socketChannel = yield call(createSocketChannel, socketConnection, SOCKET_EMIT.REQUEST_AVAILABLE);

  // watch message and relay the action
  while (true) {
    const data = yield take(socketChannel);
    notification.success({ message: 'You got a new request' });
    yield put(REQUEST_ACTIONS.saveRequest(data));
  }
}

function* requestConfirm() {
  const socketChannel = yield call(createSocketChannel, socketConnection, SOCKET_EMIT.REQUEST_CONFIRM);

  // watch message and relay the action
  while (true) {
    const { ticketId, isConfirm } = yield take(socketChannel);
    if (isConfirm) {
      const conversationId = yield select(getCurrentConveration);
      notification.success({ message: `The Agent had accepted ticket: #${ticketId}` });
      yield put(TICKET_ACTIONS.getAction(ticketId));
      // Update conversation
      yield put(fetchConversation(conversationId));
      yield put(CONVERSATION_ACTIONS.userJoinConversation(conversationId));
    } else {
      notification.error({ message: 'The Agent had declined the request' });
    }
  }
}

function* observeUserTypingConversation() {
  const socketChannel = yield call(createSocketChannel, socketConnection, SOCKET_EMIT.RECEIVE_USER_TYPING);

  // watch message and relay the action
  while (true) {
    const { conversationId, messages } = yield take(socketChannel);
    yield put(CONVERSATION_ACTIONS.otherUserTyping(conversationId, messages));
  }
}

function* removeRequest() {
  const socketChannel = yield call(createSocketChannel, socketConnection, SOCKET_EMIT.REMOVE_REQUEST);

  // watch message and relay the action
  while (true) {
    const { ticketId } = yield take(socketChannel);
    yield put(REQUEST_ACTIONS.removeRequest(ticketId));
  }
}

function* foundSolution() {
  const socketChannel = yield call(createSocketChannel, socketConnection, SOCKET_EMIT.FOUND_SOLUTION);

  // watch message and relay the action
  while (true) {
    const { conversationId } = yield take(socketChannel);
    yield put(CONVERSATION_ACTIONS.foundSolution(conversationId));
  }
}


function* updateTicketNotification() {
  const socketChannel = yield call(createSocketChannel, socketConnection, SOCKET_EMIT.TICKET_UPDATE);

  // watch message and relay the action
  while (true) {
    const { ticketId } = yield take(socketChannel);
    yield put(TICKET_ACTIONS.getAction(ticketId));
  }
}

function* warningTicketNotification() {
  const socketChannel = yield call(createSocketChannel, socketConnection, SOCKET_EMIT.TICKET_WARNING);

  // watch message and relay the action
  while (true) {
    const { ticketId, conversationId } = yield take(socketChannel);
    notification.warning({
      message: ticketId,
      onClick: () => {
        history.push(`/admin/tickets-warning/${ticketId}`);
      },
      style: {
        cursor: 'pointer',
      },
    });
    yield put(fetchReplyMessages(conversationId));
  }
}

function* connectFlow() {
  const token = yield select(getToken);
  // user is not logged in
  if (!token) return;
  socketConnection = createSocketConnection(token);

  yield all([
    handleNewMessage(),
    requestAgent(),
    requestConfirm(),
    observeUserTypingConversation(),
    foundSolution(),
    removeRequest(),
    updateTicketNotification(),
    warningTicketNotification(),
  ]);
}

function* disconnectFlow() {
  if (socketConnection) socketConnection.disconnect();
}

function* userJoinConversation({ payload }) {
  const { conversationId } = payload;
  const userId = yield select(getUserId);
  socketConnection.emit(SOCKET_EMIT.JOIN_CONVERSATION, { conversationId, userId });
  // socketConnection.emit('JOIN_CONVERSATION', { conversationId, userId });
}

function* userLeftConversation({ payload }) {
  const { conversationId } = payload;
  const userId = yield select(getUserId);
  socketConnection.emit(SOCKET_EMIT.LEFT_CONVERSATION, { conversationId, userId });
}

function* userTyping({ payload }) {
  const { conversationId, messages } = payload;
  const userId = yield select(getUserId);
  socketConnection.emit(SOCKET_EMIT.USER_TYPING, { conversationId, userId, messages });
}

function* socketIOFlow() {
  yield takeEvery([AUTH_LOGIN_SUCCESS], connectFlow);
  yield takeEvery(AUTH_LOGOUT, disconnectFlow);
  yield takeLatest(USER_JOIN_CONVERSATION, userJoinConversation);
  yield takeLatest(USER_LEFT_CONVERSATION, userLeftConversation);
  yield takeLatest(USER_TYPING, userTyping);
}

export function emitReply(from, to, conversation, messages) {
  socketConnection.emit(SOCKET_EMIT.REPLY_MESSAGE, {
    from,
    to,
    conversation,
    messages,
  });
}

export default socketIOFlow;
