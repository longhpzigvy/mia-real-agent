import httpStatus from 'http-status';
import _assign from 'lodash/assign';
import _get from 'lodash/get';
import APIError, { ERROR_MESSAGE } from '../../utils/APIError';
import BaseController from '../base/base.controller';
import ConversationService from './conversation.service';
import ReplyService from '../reply/reply.service';
import ActivitiesLogsService from '../activityLogs/activityLogs.service';
import { CONVERSATION_EVENT } from '../../../common/activityLogsEnums';

class ConversationController extends BaseController {
  constructor() {
    super(ConversationService);
    this.getAll = this.getAll.bind(this);
    this.getReplyMessages = this.getReplyMessages.bind(this);
    this.getActivities = this.getActivities.bind(this);
  }

  async getReplyMessages(req, res) {
    try {
      const { id } = req.params;
      const replyMessages = await ReplyService.getByConversation(id);

      return res.status(httpStatus.OK).send(replyMessages);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async getActivities(req, res) {
    try {
      const { id } = req.params;
      const activities = await ActivitiesLogsService.getByConversation(id);

      return res.status(httpStatus.OK).send(activities);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async getAll(req, res) {
    try {
      const {
        user,
        query: {
          skip, limit, sort, ...params
        },
      } = req;

      if (!user) {
        throw new APIError(ERROR_MESSAGE.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
      }
      const { _id: owner } = user;
      const condition = { owner };

      const option = { skip, limit };
      if (sort) {
        const sortObj = JSON.parse(sort);
        option.sort = sortObj;
      }

      const query = JSON.parse(_get(params, 'query', '{}'));
      const newQuery = {
        ...query,
        ...condition,
      };

      const { result } = await this.service.getAll(newQuery, option);
      const total = await this.service.countDocument(condition);

      return res.status(httpStatus.OK).send({
        result,
        total,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async rating(req, res) {
    try {
      const { model, body } = req;
      const { score, comment } = body;

      _assign(model, { rating: { score, comment } });

      const { _id: conversationId } = model;

      const savedModel = await model.save();
      // async call, no need to wait OvOb
      ActivitiesLogsService.insert({
        createdBy: model.owner,
        action: CONVERSATION_EVENT.CONVERSATION_RATED,
        payload: {
          conversationId,
          score,
          comment,
        },
      });
      return res.status(httpStatus.OK).send(savedModel);
    } catch (error) {
      return super.handleError(res, error);
    }
  }
}

export default new ConversationController();
