import { REPLY_TYPE } from '../../../common/enums';
import {
  ticketStatus, userAction, botChat, userChat, ticketRating, otherChat, warningAction,
} from '../ChatItem';
import { combineChat, isAgent } from '../../utils/func-utils';

export const conversationTranscript = (messages) => {
  const textMessages = combineChat(messages).map((message) => {
    const {
      _id, type, params, sentAt,
      from: ownerMessage, contents,
    } = message;
    switch (type) {
      case REPLY_TYPE.TICKET_STATUS: {
        return ticketStatus(_id, params, sentAt);
      }
      case REPLY_TYPE.USER_ACTION: {
        return userAction(_id, ownerMessage, params, sentAt);
      }
      case REPLY_TYPE.BOT_RESPONSE: {
        return botChat(_id, contents);
      }
      case REPLY_TYPE.USER_NORMAL: {
        const { role } = ownerMessage;
        if (isAgent(role)) {
          return otherChat(_id, contents, ownerMessage.profile);
        }
        return userChat(_id, contents);
      }
      case REPLY_TYPE.RATING_ACTION:
        return ticketRating(_id, ownerMessage, params, sentAt);
      case REPLY_TYPE.WARNING_ACTION:
        return warningAction(_id, ownerMessage, contents, sentAt);
      default: return null;
    }
  });
  return textMessages;
};
