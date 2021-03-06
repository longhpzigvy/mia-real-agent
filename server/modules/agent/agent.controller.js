import httpStatus from 'http-status';
import { TICKET_STATUS, SOCKET_EMIT, REPLY_USER_ACTION } from '../../../common/enums';
import TicketService from '../ticket/ticket.service';
import ConversationService from '../conversation/conversation.service';
import AgentQueue from '../queue/agentQueue';
import UserQueue from '../queue/userQueue';
import IdleQueue from '../queue/idleQueue';
import Logger from '../../logger';
import APIError, { ERROR_MESSAGE } from '../../utils/APIError';
import RequestQueue from '../queue/requestQueue';
import ReplyService from '../reply/reply.service';
import { getHistoryTicketUpdate } from '../../utils/utils';

class AgentController {
  constructor() {
    this.handleError = this.handleError.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
  }

  handleError(res, error) {
    Logger.error(error.message);
    const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).send(error.message);
  }

  async acceptRequest(req, res) {
    try {
      const { user: agent } = req;
      const { ticketId, conversationId, isConfirm } = req.body;
      const [ticket, conversation] = await Promise.all([
        TicketService.get(ticketId),
        ConversationService.get(conversationId),
      ]);
      // eslint-disable-next-line no-underscore-dangle
      const agentId = agent._id;

      if (
        !ticket
        || !conversation
      ) {
        throw new APIError(ERROR_MESSAGE.BAD_REQUEST, httpStatus.BAD_REQUEST);
      }

      if (ticket.status !== TICKET_STATUS.PENDING) {
        return res.status(httpStatus.BAD_REQUEST).send();
      }
      if (isConfirm) {
        AgentQueue.remove(agentId);
        // update assign and members for tickets and conversations
        ticket.assignee = agentId;
        ticket.status = TICKET_STATUS.PROCESSING;
        const { history } = ticket;
        const oldHistory = history.map(h => h.toJSON());
        const newHistory = getHistoryTicketUpdate(oldHistory, TICKET_STATUS.PROCESSING);
        ticket.history = newHistory;
        if (conversation.members) {
          const agentIdStr = agentId.toString();
          const shouldAdd = !conversation.members.some(member => member.toString() === agentIdStr);

          if (shouldAdd) conversation.members.push(agentId);
        } else {
          conversation.members = [agentId];
        }
        await Promise.all([
          ticket.save(),
          conversation.save(),
        ]);
        const { owner } = ticket;
        const ownerSocket = UserQueue.getUser(owner);
        ownerSocket.emit(SOCKET_EMIT.REQUEST_CONFIRM, {
          isConfirm,
          ticketId,
        });
        RequestQueue.acceptRequest(ticketId);
        IdleQueue.addTimer(ticketId);
        ReplyService.logUserAction(conversationId, agentId, REPLY_USER_ACTION.ACCEPT_REQUEST);
      }
      return res.status(httpStatus.OK).send();
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export default new AgentController();
