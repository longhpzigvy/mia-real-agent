import { connect } from 'react-redux';
import { getUserId, getUserRole } from 'reducers/auth';
import MessageList from 'components/MessageBox/MessageList';
import {
  getReplyMessagesByConversationId,
  getSendingMessages,
} from 'reducers/replies';
import {
  getTicketById, getCurrentTicket,
} from 'selectors/ticket';
import {
  getCurrentConveration,
  getOtherUserTyping,
  getSolution,
} from 'reducers/conversations';
import {
  isFindingAgent,
} from 'reducers/requests';

const mapStateToProps = (state) => {
  const conversationId = getCurrentConveration(state);
  const solutionFound = getSolution(state).includes(conversationId);
  return ({
    conversationId,
    userId: getUserId(state),
    currentTicket: getTicketById(state, getCurrentTicket(state)),
    replyMessages: getReplyMessagesByConversationId(state, conversationId),
    sendingMessages: getSendingMessages(state, conversationId),
    isFindingAgent: isFindingAgent(state, conversationId),
    userRole: getUserRole(state),
    otherUserTyping: getOtherUserTyping(state),
    solutionFound,
  });
};
export default connect(mapStateToProps)(MessageList);
