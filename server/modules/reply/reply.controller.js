import httpStatus from 'http-status';
import axios from 'axios';
import BaseController from '../base/base.controller';
import ReplyService from './reply.service';
import Logger from '../../logger';
import IdleQueue from '../queue/idleQueue';
import ConversationService from '../conversation/conversation.service';
import TicketService from '../ticket/ticket.service';
import { TICKET_STATUS, SOCKET_EMIT, REPLY_TYPE } from '../../../common/enums';
import userQueue from '../queue/userQueue';

class ReplyController extends BaseController {
  constructor() {
    super(ReplyService);
    this.insertReply = this.insertReply.bind(this);
    this.insertWarning = this.insertWarning.bind(this);
    this.getResponseFromMia = this.getResponseFromMia.bind(this);
  }

  async getResponseFromMia(userReply) {
    const { WEBHOOK_ENDPOINT } = process.env;
    if (!WEBHOOK_ENDPOINT) {
      Logger.error('WEBHOOK_ENDPOINT not found');
      return;
    }
    try {
      const { messages, conversationId, from } = userReply;
      const response = await axios.post(`${WEBHOOK_ENDPOINT}/api/chats/dialog`, { content: messages });
      const { data: miaReply } = response;

      // Get mia full fillment text
      const { data: { queryResult } } = miaReply;
      const { fulfillmentText, allRequiredParamsPresent, intent } = queryResult;
      if (allRequiredParamsPresent && !intent.isFallback) {
        const socket = userQueue.getUser(from);
        socket.emit(SOCKET_EMIT.FOUND_SOLUTION, { conversationId });
      }

      const reply = {
        type: REPLY_TYPE.BOT_RESPONSE,
        conversationId,
        from: null,
        messages: fulfillmentText, // miaReply.message
      };

      await this.service.insert(reply);
    } catch (error) {
      Logger.error('Error while trying to fetch response from mia', error);
    }
  }

  async insertReply(req, res) {
    try {
      const reply = req.body;
      const { conversationId } = reply;
      // Get number of reply
      const noReply = await this.service.countDocument({ conversationId });
      const result = await this.service.insert(reply);
      const { ticketId } = await ConversationService.getOneByQuery({ _id: conversationId });
      // For processing time
      if (
        noReply === 2 // Skip first status log and welcome
      ) {
        TicketService.updateProcessingTime(ticketId);
      }
      // For idle queue
      IdleQueue.resetTimer(ticketId);
      if (reply.to) {
        TicketService.updateStatus(ticketId, TICKET_STATUS.PROCESSING);
      } else {
        setTimeout(() => this.getResponseFromMia(reply), 0);
      }
      return res.status(httpStatus.OK).send({ reply: result });
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async insertWarning(req, res) {
    try {
      const reply = req.body;
      await this.service.insert({
        ...reply,
        type: REPLY_TYPE.WARNING_ACTION,
      });
      return res.status(httpStatus.OK).send({ reply });
    } catch (error) {
      return super.handleError(res, error);
    }
  }
}

export default new ReplyController();
