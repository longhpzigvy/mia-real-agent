import httpStatus from 'http-status';
import _ from 'lodash';
import _get from 'lodash/get';
import BaseController from '../base/base.controller';
import TicketService from './ticket.service';
import UserService from '../user/user.service';
import ConversationService from '../conversation/conversation.service';
import APIError, { ERROR_MESSAGE } from '../../utils/APIError';
import { isAgent } from '../../../app/utils/func-utils';
import {
  TICKET_STATUS, REPLY_TYPE, REPLY_USER_ACTION, CLOSED_TICKET_STATUSES,
} from '../../../common/enums';
import RequestQueue from '../queue/requestQueue';
import ReplyService from '../reply/reply.service';
import { getHistoryTicketUpdate } from '../../utils/utils';

const { CONTENT_NOT_FOUND, BAD_REQUEST, INSUFFICIENT_FUNDS } = ERROR_MESSAGE;
const emptyObjString = '{}';

class TicketController extends BaseController {
  constructor() {
    super(TicketService);
    this.get = this.get.bind(this);
    this.load = this.load.bind(this);
    this.insert = this.insert.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getAllConversations = this.getAllConversations.bind(this);
    this.getOwnerAndAssigneeProfile = this.getOwnerAndAssigneeProfile.bind(this);
    this.findAvailableAgents = this.findAvailableAgents.bind(this);
    this.closeTicket = this.closeTicket.bind(this);
  }


  async findAvailableAgents(req, res) {
    try {
      const { model: ticket } = req;
      // const replyMessages = await ReplyService.getByConversation(id);

      const request = RequestQueue.addRequest(ticket);
      const { conversationId, owner } = ticket;
      ReplyService.logUserAction(conversationId, owner, REPLY_USER_ACTION.REQUEST_AGENT);
      if (!request) {
        throw new APIError('Agent not found!', httpStatus.NOT_FOUND);
      }
      const { history } = ticket;
      const oldTicket = history.map(h => h.toJSON());
      const newHistory = getHistoryTicketUpdate(oldTicket, TICKET_STATUS.PENDING);
      _.assign(ticket, { status: TICKET_STATUS.PENDING, history: newHistory });

      ticket.save({});
      return res.status(httpStatus.OK).send();
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getAllConversations(req, res) {
    try {
      const { id } = req.params;
      const result = await ConversationService.getConversationByTicketId(id);

      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getOwnerAndAssigneeProfile(req, res) {
    const { id } = req.params;
    const ticket = await this.service.get({ _id: id });
    const { _id: ticketId, assignee, owner: ticketOwnerId } = ticket;
    const ticketOwner = await UserService.get(ticketOwnerId);
    const { profile, role: ownerRole } = ticketOwner;
    let assigneeProfile = null;

    if (assignee) {
      assigneeProfile = (await UserService.get(assignee)).profile;
    }
    return res.status(httpStatus.OK).send(
      {
        ticketId,
        ownerProfile: {
          role: ownerRole,
          profile,
        },
        assigneeProfile,
      },
    );
  }


  async load(req, res, next, id) {
    try {
      const { user } = req;
      if (!user) {
        throw new APIError(ERROR_MESSAGE.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
      }
      const { _id: userId, role } = user;

      const condition = isAgent(role)
        ? { assignee: userId, _id: id }
        : { owner: userId, _id: id };
      const model = await this.service.getByCondition(condition);

      if (model == null) {
        throw new APIError(CONTENT_NOT_FOUND, httpStatus.NOT_FOUND);
      }
      req.model = model;
      return next();
    } catch (error) {
      return this.handleError(res, error);
    }
  }


  async insert(req, res) {
    try {
      const { user, body: data } = req;

      if (!user) {
        throw new APIError(ERROR_MESSAGE.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
      }

      const { _id: owner } = user;
      const condition = { owner };
      const totalCount = await this.service.countDocument(condition);

      const newData = {
        ...data,
        ticketId: totalCount + 1,
        history: [{
          currentStatus: TICKET_STATUS.OPEN,
          startTime: new Date(),
        }],
        owner,
      };

      const result = await this.service.insert(newData);
      const { _id: ticketId } = result;
      try {
        // create a conversation with mia by default
        const conversation = await ConversationService.insert({
          owner,
          members: [],
          ticketId,
        });
        // eslint-disable-next-line no-underscore-dangle
        const { _id: conversationId } = conversation;
        result.conversationId = conversationId;
        await result.save();
        // Create first ticket status log
        ReplyService.insert({
          conversationId,
          messages: 'Ticket Created',
          type: REPLY_TYPE.TICKET_STATUS,
          params: { status: TICKET_STATUS.OPEN },
        });
        // Mia bot automatic welcome
        ReplyService.insert({
          conversationId,
          messages: 'Hello, How can I help you?',
          type: REPLY_TYPE.BOT_RESPONSE,
        });
      } catch (error) {
        this.service.delete(ticketId);
        throw new APIError('Unable to create ticket', httpStatus.INTERNAL_SERVER_ERROR);
      }
      const createdTicket = await this.service.getByCondition({ _id: ticketId });
      return res.status(httpStatus.OK).send(createdTicket);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getAll(req, res) {
    try {
      const {
        user, query: {
          skip, limit, sort, ...params
        },
      } = req;

      if (!user) {
        throw new APIError(ERROR_MESSAGE.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
      }
      const { _id, role } = user;
      const condition = (isAgent(role))
        ? { assignee: _id }
        : { owner: _id };

      const option = { skip, limit };
      if (sort) {
        const sortObj = JSON.parse(sort);
        option.sort = {
          status: 1,
          createdAt: -1,
          ...sortObj,
        };
      }

      const query = JSON.parse(_get(params, 'query', emptyObjString));
      const newQuery = {
        ...query,
        ...condition,
      };

      const result = await this.service.getAllWithUserData(newQuery, option);

      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }


  async closeTicket(req, res) {
    try {
      const { model: ticket, body: { status, unsolvedReason } } = req;
      if (!ticket) {
        throw new APIError(CONTENT_NOT_FOUND, httpStatus.NOT_FOUND);
      }
      if (!CLOSED_TICKET_STATUSES.includes(status)
        || (status === TICKET_STATUS.UNSOLVED && !unsolvedReason)) {
        throw new APIError(BAD_REQUEST, httpStatus.BAD_REQUEST);
      }
      // Charge ticket
      if (status === TICKET_STATUS.SOLVED) {
        if (!(await TicketService.handleChargeTicket(ticket))) {
          throw new APIError(INSUFFICIENT_FUNDS, httpStatus.PAYMENT_REQUIRED);
        }
      }
      const { history, conversationId } = ticket;
      const oldHistory = history.map(h => h.toJSON());
      const newHistory = getHistoryTicketUpdate(oldHistory, status);
      _.assign(ticket, { status, history: newHistory, unsolvedReason: (unsolvedReason || '') });

      const result = await ticket.save({});
      setTimeout(() => {
        this.service.sendTransciptConverstion(ticket, conversationId);
      }, 1000);
      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async rating(req, res) {
    try {
      const { model, body } = req;
      const { score, comment } = body;
      const {
        owner, assignee, status, conversationId,
      } = model;
      _.assign(model, { rating: { score, comment } });
      const savedModel = await model.save();
      const { _id } = owner;
      const ratingMessage = {
        conversationId,
        from: _id,
        type: REPLY_TYPE.RATING_ACTION,
        messages: 'Ticket Rating',
        params: {
          score,
          comment,
        },
      };

      ReplyService.insert(ratingMessage);
      // Calculate assignee rating
      UserService.updateRating(assignee, score, status === TICKET_STATUS.SOLVED);
      return res.status(httpStatus.OK).send(savedModel);
    } catch (error) {
      return super.handleError(res, error);
    }
  }
}

export default new TicketController(TicketService);
