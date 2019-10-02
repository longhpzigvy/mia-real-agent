import { REPLY_TYPE } from '../../../common/enums';
import {
  warningAction,
} from '../ChatItem';
import { combineChat } from '../../utils/func-utils';

export const conversationTranscript = (messages) => {
  const textMessages = combineChat(messages).map((message) => {
    const {
      _id, type, sentAt,
      from: ownerMessage, contents,
    } = message;
    switch (type) {
      case REPLY_TYPE.WARNING_ACTION:
        return warningAction(_id, ownerMessage, contents, sentAt);
      default: return null;
    }
  });
  return textMessages;
};
