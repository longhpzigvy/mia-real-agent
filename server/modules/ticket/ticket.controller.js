import httpStatus from 'http-status';
import _ from 'lodash';
import _get from 'lodash/get';
import BaseController from '../base/base.controller';
import TicketService from './ticket.service';
import UserService from '../user/user.service';
import ConversationService from '../conversation/conversation.service';
import ActivitiesLogsService from '../activityLogs/activityLogs.service';

import APIError, { ERROR_MESSAGE } from '../../utils/APIError';
import AgentQueue from '../queue/agentQueue';
import { getSocketByUser } from '../../socketio';
import { isAgent } from '../../../app/utils/func-utils';
import { TICKET_STATUS } from '../../../common/enums';

const { CONTENT_NOT_FOUND } = ERROR_MESSAGE;
const emptyObjString = '{}';

class TicketController extends BaseController {
  constructor() {
    super(TicketService);
    this.get = this.get.bind(this);
    this.load = this.load.bind(this);
    this.insert = this.insert.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getActivities = this.getActivities.bind(this);
    this.getAllConversations = this.getAllConversations.bind(this);
  }

  async getActivities(req, res) {
    try {
      const { id } = req.params;
      const activities = await ActivitiesLogsService.getByTicket(id);

      return res.status(httpStatus.OK).send(activities);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async findAvailableAgents(req, res) {
    try {
      const { model: ticket } = req;
      // const replyMessages = await ReplyService.getByConversation(id);
      const { category: ticketCategories = [] } = ticket;
      // Get owner information
      const queue = AgentQueue.get();
      const agents = queue.filter(
        ({ categories }) => {
          if (!categories) {
            return false;
          }
          return categories
            .some(category => ticketCategories.includes(category));
        }
      );
      if (!agents.length) {
        return res.status(httpStatus.NOT_FOUND).send('Agent not found!');
      }
      let hadSentToAgent = false;
      agents.forEach((agent) => {
        // eslint-disable-next-line no-underscore-dangle
        const socket = getSocketByUser(agent);
        if (socket) {
          hadSentToAgent = true;
          socket.emit('REQUEST_AVAILABLE', ticket.toObject());
        }
      });
      if (!hadSentToAgent) {
        return res.status(httpStatus.NOT_FOUND).send('Agent not found!');
      }

      _.assign(ticket, { status: TICKET_STATUS.PENDING });
      ticket.save({});
      return res.status(httpStatus.OK).send();
    } catch (error) {
      return super.handleError(res, error);
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

  async get(req, res) {
    try {
      const { model } = req;
      const ticket = model.toObject();
      const { assignee, owner: ticketOwnerId } = ticket;
      const ticketOwner = await UserService.get(ticketOwnerId);
      const { profile, role: ownerRole } = ticketOwner;
      let assigneeProfile = null;

      if (assignee) {
        assigneeProfile = (await UserService.get(assignee)).profile;
      }
      return res.status(httpStatus.OK).send(
        {
          ...model,
          _doc: {
            ...ticket,
            ownerProfile: {
              role: ownerRole,
              profile,
            },
            assigneeProfile,
          },
        }
      );
    } catch (error) {
      return this.handleError(res, error);
    }
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
        result.conversationId = conversation._id;
        await result.save();
      } catch (error) {
        this.service.delete(ticketId);
        throw new APIError('Unable to create ticket', httpStatus.INTERNAL_SERVER_ERROR);
      }

      return res.status(httpStatus.OK).send(result);
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

      const result = await this.service.getAll(newQuery, option);

      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }


  async closeTicket(req, res) {
    try {
      const { model: ticket } = req;
      if (!ticket) {
        throw new APIError(CONTENT_NOT_FOUND, httpStatus.NOT_FOUND);
      }
      _.assign(ticket, { status: TICKET_STATUS.CLOSED });
      const result = await ticket.save({});
      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export default new TicketController(TicketService);
