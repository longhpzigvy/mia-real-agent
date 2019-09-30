/* eslint-disable no-underscore-dangle */
import cuid from 'cuid';
import {
  fromJS, Set as ISet, Map, OrderedMap,
} from 'immutable';

export const REPLIES_FETCH = 'replies/REPLIES_FETCH';
export const REPLIES_FETCH_SUCCESS = 'replies/REPLIES_FETCH_SUCCESS';
export const REPLIES_FETCH_FAILED = 'replies/REPLIES_FETCH_FAILED';

export const REPLIES_SEND_MESSAGE = 'replies/REPLIES_SEND_MESSAGE';
export const REPLIES_SEND_MESSAGE_SUCCESS = 'replies/REPLIES_SEND_MESSAGE_SUCCESS';
export const REPLIES_SEND_MESSAGE_FAILED = 'replies/REPLIES_SEND_MESSAGE_FAILED';

export const REPLIES_SEND_WARNING = 'replies/REPLIES_SEND_WARNING';
export const REPLIES_SEND_WARNING_SUCCESS = 'replies/REPLIES_SEND_WARNING_SUCCESS';
export const REPLIES_SEND_WARNING_FAILED = 'replies/REPLIES_SEND_WARNING_FAILED';

export const REPLIES_ADD_MESSAGE = 'replies/REPLIES_ADD_MESSAGE';

// action creator
export const sendReplyWarning = (conversationId, messages) => ({
  type: REPLIES_SEND_WARNING,
  payload: {
    conversationId,
    messages,
  },
});

export const sendReplyWarningSuccess = conversationId => ({
  type: REPLIES_SEND_WARNING_SUCCESS,
  payload: {
    conversationId,
  },
});

export const sendReplyWarningFailed = (conversationId, error) => ({
  type: REPLIES_SEND_WARNING_FAILED,
  payload: {
    conversationId,
    error,
  },
});

export const sendReplyMessage = (conversationId, messages) => ({
  type: REPLIES_SEND_MESSAGE,
  payload: {
    conversationId,
    messages,
    localMessageId: cuid(),
  },
});

export const sendReplyMessageSuccess = (conversationId, messages, localMessageId) => ({
  type: REPLIES_SEND_MESSAGE_SUCCESS,
  payload: {
    conversationId,
    messages,
    localMessageId,
  },
});

export const sendReplyMessageFailed = (conversationId, error, localMessageId) => ({
  type: REPLIES_SEND_MESSAGE_FAILED,
  payload: {
    conversationId,
    error,
    localMessageId,
  },
});

export const fetchReplyMessages = conversationId => ({
  type: REPLIES_FETCH,
  payload: {
    conversationId,
  },
});

export const fetchReplyMessagesSuccess = (conversationId, replies, total) => ({
  type: REPLIES_FETCH_SUCCESS,
  payload: {
    conversationId,
    replies,
    total,
  },
});

export const fetchReplyMessagesFailed = (conversationId, error) => ({
  type: REPLIES_FETCH_FAILED,
  payload: {
    conversationId,
    error,
  },
});

export const addNewMessage = (conversationId, message) => ({
  type: REPLIES_ADD_MESSAGE,
  payload: {
    conversationId,
    message,
  },
});

// selector
export const getTotalReplyMessages = ({ replies }) => replies.get('total');

export const getReplyMessagesByConversationId = ({ replies }, conversationId) => {
  const replyMessages = replies
    .getIn(['byId', conversationId]);
  if (!replyMessages) return [];
  return replyMessages.toList().toJS();
};

export const getErrorMessage = ({ replies }, conversationId) => {
  if (!conversationId) return '';
  const error = replies.getIn(['error', conversationId]);
  if (!error) return '';

  return error;
};

export const isFetchingReplies = ({ replies }, conversationId) => {
  if (!conversationId) return false;
  const isFetching = replies.get('isFetching');
  return isFetching.has(conversationId);
};

export const getSendingMessages = ({ replies }, conversationId) => {
  if (!conversationId) return [];
  const sendingMessage = replies.getIn(['sendingMessage', conversationId]);
  if (!sendingMessage) return [];

  return sendingMessage.toList().toJS();
};

export const getSendingMessagesError = ({ replies }, conversationId) => {
  if (!conversationId) return {};
  const sendingMessageError = replies.getIn(['sendingMessageError', conversationId]);
  if (!sendingMessageError) return {};

  return sendingMessageError.toJS();
};

const initialState = fromJS({
  isFetching: new ISet(),
  allIds: new ISet(),
  byId: {},
  error: {},
  total: 0,
  sendingMessage: {},
  sendingMessageError: {},
});

function repliesReducer(state = initialState, action) {
  switch (action.type) {
    case REPLIES_FETCH: {
      const { conversationId } = action.payload;
      const isFetching = state.get('isFetching').add(conversationId);
      const error = state.get('error').delete(conversationId);

      return state
        .set('isFetching', isFetching)
        .set('error', error);
    }

    case REPLIES_FETCH_SUCCESS: {
      const {
        conversationId,
        replies = [], total,
      } = action.payload;
      const allIds = state.get('allIds').add(conversationId);
      const isFetching = state.get('isFetching').delete(conversationId);
      let currentReplies = state.getIn(['byId', conversationId]);
      const repliesMap = replies.reduce((acc, reply) => {
        acc[reply._id] = reply;
        return acc;
      }, {});

      if (!currentReplies) {
        currentReplies = new OrderedMap(repliesMap);
      } else {
        currentReplies = currentReplies.merge(repliesMap);
      }

      return state
        .set('isFetching', isFetching)
        .set('allIds', allIds)
        .set('total', total)
        .setIn(['byId', conversationId], currentReplies);
    }

    case REPLIES_FETCH_FAILED: {
      const { error: errorMsg, conversationId } = action.payload;
      const isFetching = state.get('isFetching').delete(conversationId);
      const error = state.setIn(['error', conversationId], errorMsg);

      return state
        .set('isFetching', isFetching)
        .set('error', error);
    }

    /**
     * Handle sending message
     * We will have a sendingMessage map
     * each key in map is a conversationId
     * and value is another map which has localMessageId as a key and message as a value
     * [conversationId]: {
     *  [localMessageId]: {
     *    id: localMessageId
     *    message,
     *  }
     *  [localMessageId]: {
     *    id: localMessageId
     *    message,
     *  }
     * }
     */
    case REPLIES_SEND_MESSAGE: {
      const { messages, localMessageId, conversationId } = action.payload;
      let sendingList = state.getIn(['sendingMessage', conversationId]);
      const error = state.get('error').delete(conversationId);

      if (!sendingList) {
        sendingList = new Map({
          [localMessageId]: {
            id: localMessageId,
            messages,
          },
        });
      } else {
        sendingList = sendingList.set(localMessageId, {
          id: localMessageId,
          messages,
        });
      }

      return state
        .setIn(['sendingMessage', conversationId], sendingList)
        .set('error', error);
    }

    case REPLIES_SEND_MESSAGE_SUCCESS: {
      const { localMessageId, conversationId, messages: reply } = action.payload;
      const sendingList = state.getIn(['sendingMessage', conversationId]).delete(localMessageId);
      const { _id: msgId, messages } = reply;
      let currentReplies = state.getIn(['byId', conversationId]);
      const allIds = state.get('allIds').add(conversationId);
      if (!currentReplies) {
        currentReplies = new OrderedMap({
          [msgId]: messages,
        });
      } else {
        currentReplies = currentReplies.set(msgId, reply);
      }
      return state
        .set('allIds', allIds)
        .setIn(['byId', conversationId], currentReplies)
        .setIn(['sendingMessage', conversationId], sendingList);
    }

    /**
     * Handle sending message failure
     * Similar to sending message map
     * each key in map is a conversationId
     * and value is another map which has localMessageId as a key and error as a value
     * [conversationId]: {
     *  [localMessageId]: {
     *    id: localMessageId
     *    error,
     *  }
     *  [localMessageId]: {
     *    id: localMessageId
     *    error,
     *  }
     * }
     */
    case REPLIES_SEND_MESSAGE_FAILED: {
      const { localMessageId, conversationId, error } = action.payload;
      const sendingList = state.getIn(['sendingMessage', conversationId]).delete(localMessageId);
      let sendingMessageError = state.getIn(['sendingMessageError', conversationId]);

      if (!sendingMessageError) {
        sendingMessageError = new Map({
          [localMessageId]: {
            id: localMessageId,
            error,
          },
        });
      } else {
        sendingMessageError = sendingMessageError.set(localMessageId, {
          id: localMessageId,
          error,
        });
      }

      return state
        .set('sendingMessageError', sendingMessageError)
        .set('sendingList', sendingList);
    }

    case REPLIES_ADD_MESSAGE: {
      const { message } = action.payload;
      const { _id: msgId, conversationId } = message;
      let currentReplies = state.getIn(['byId', conversationId]);
      const allIds = state.get('allIds').add(conversationId);

      if (!currentReplies) {
        currentReplies = new OrderedMap({
          [msgId]: message,
        });
      } else {
        currentReplies = currentReplies.set(msgId, message);
      }

      return state
        .set('allIds', allIds)
        .setIn(['byId', conversationId], currentReplies);
    }

    default: {
      return state;
    }
  }
}

export default repliesReducer;

export const actions = {
  fetchReplyMessages,
  fetchReplyMessagesSuccess,
  fetchReplyMessagesFailed,

  sendReplyWarning,
  sendReplyWarningSuccess,
  sendReplyWarningFailed,
};

export const selectors = {
  getErrorMessage,
  isFetchingReplies,
  getTotalReplyMessages,
};
