import { connect } from 'react-redux';
import { getUserId, getUserRole } from 'reducers/auth';
import { actions as cannedResponseActions } from 'reducers/cannedResponse';
import {
  isFetchingReplies,
  getErrorMessage,
  sendReplyMessage,
} from '../../reducers/replies';
import {
  actions,
} from '../../reducers/ticket';
import {
  getTicketById, getCurrentTicket,
} from '../../selectors/ticket';
import {
  getCurrentConveration,
  getConverationById,
  actions as CONVERSATION_ACTIONS,
} from '../../reducers/conversations';
import {
  submitFeedback,
} from '../../reducers/feedbacks';
import {
  isFindingAgent,
  findAgentRequest,
} from '../../reducers/requests';
import MessageBox from '../../components/MessageBox';
import { getCannedResponsesForUser } from '../../selectors/cannedResponse';

const mapStateToProps = (state) => {
  const conversationId = getCurrentConveration(state);
  return ({
    conversationId,
    userId: getUserId(state),
    currentConversation: getConverationById(state, conversationId),
    currentTicket: getTicketById(state, getCurrentTicket(state)),
    isFetchingReplies: isFetchingReplies(state, conversationId),
    errorMessage: getErrorMessage(state, conversationId),
    isFindingAgent: isFindingAgent(state, conversationId),
    userRole: getUserRole(state),
    cannedResponses: getCannedResponsesForUser(state),
  });
};

const mapDispatchToProps = {
  setCurrentTicket: actions.selectTicket,
  sendReplyMessage,
  findAgentRequest,
  submitRating: actions.submitTicketRating,
  submitFeedback,
  joinConversation: CONVERSATION_ACTIONS.userJoinConversation,
  leftConversation: CONVERSATION_ACTIONS.userLeftConversation,
  userTyping: CONVERSATION_ACTIONS.userTyping,
  fetchCannedResponseForUser: cannedResponseActions.fetchCannedResponseForUser,
  closeTicket: actions.closeAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox);
