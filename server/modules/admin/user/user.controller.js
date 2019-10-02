import httpStatus from 'http-status';
import _get from 'lodash/get';
import BaseController from '../../base/base.controller';
import ApplicationService from '../../application/application.service';
import TicketService from '../../ticket/ticket.service';
import UserService from '../../user/user.service';
import { ROLES } from '../../../../common/enums';
import APIError, { ERROR_MESSAGE } from '../../../utils/APIError';
import { isAgent, isUser } from '../../../../app/utils/func-utils';

const emptyObjString = '{}';
class UserController extends BaseController {
  constructor() {
    super(UserService);
  }

  get = async (req, res) => {
    try {
      const { model: user } = req;
      const userObj = user.toObject();
      const { role, application: applicationId, _id } = userObj;

      if (isAgent(role)) {
        const applicationDoc = await ApplicationService.get(applicationId);
        userObj.applicationInfo = applicationDoc;
      }

      if (isAgent(role)) {
        const ticketCondition = { assignee: _id };
        const populateCondition = { path: 'owner', select: ['_id', 'username'] };
        const tickets = await TicketService.getAllByConditionWithPopulationInfo(ticketCondition, populateCondition);
        userObj.tickets = tickets;
      } else if (isUser(role)) {
        const ticketCondition = { owner: _id };
        const populateCondition = { path: 'assignee', select: ['_id', 'username'] };
        const tickets = await TicketService.getAllByConditionWithPopulationInfo(ticketCondition, populateCondition);
        userObj.tickets = tickets;
      }

      return res.status(httpStatus.OK).send(userObj);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  getAll = async (req, res) => {
    try {
      const {
        skip = 0, limit = 10, sort, ...params
      } = req.query;
      const option = { skip, limit };
      if (sort) {
        const sortObj = JSON.parse(sort);
        option.sort = sortObj;
      }
      const query = JSON.parse(_get(params, 'query', emptyObjString));
      const result = await UserService.getAll({ ...query, deletedAt: null }, option);
      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  delete = async (req, res) => {
    try {
      const { model } = req;
      if (!model) {
        throw new APIError(ERROR_MESSAGE.CONTENT_NOT_FOUND, httpStatus.NOT_FOUND);
      }
      const { _id } = model;
      const tickets = await TicketService.getAllByOwner(_id);
      tickets.forEach(async ({ _id: ticketId }) => {
        TicketService.delete(ticketId);
      });
      UserService.delete(_id);
      return res.status(httpStatus.OK).json(_id);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  getUserSummary = async (req, res) => {
    try {
      const notDeletedCondition = {
        $or: [
          { deleted: { $exists: false } },
          { deleted: { $exists: true, $in: [false] } },
        ],
      };
      const notArchivedCondition = {
        $or: [
          { archived: { $exists: false } },
          { archived: { $exists: true, $in: [false] } },
        ],
      };

      const queryCondition = {
        $and: [notDeletedCondition, notArchivedCondition],
      };

      const userQuery = {
        role: {
          $in: [
            ROLES.INDIVIDUAL,
            ROLES.BUSINESS,
          ],
        },
      };

      const agentQuery = {
        role: {
          $in: [
            ROLES.FREELANCER,
            ROLES.DEDICATED,
          ],
        },
      };

      const user = await this.service.getUserCount({ ...queryCondition, ...userQuery });
      const agent = await this.service.getUserCount({ ...queryCondition, ...agentQuery });
      return res.status(httpStatus.OK).send({
        user, agent,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export default new UserController();
