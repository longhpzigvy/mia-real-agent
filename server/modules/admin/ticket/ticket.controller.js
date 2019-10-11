import httpStatus from 'http-status';
// lodash
import _get from 'lodash/get';
import APIError, { ERROR_MESSAGE } from '../../../utils/APIError';
import BaseController from '../../base/base.controller';
import TicketService from '../../ticket/ticket.service';
import { TICKET_STATUS, CLOSED_TICKET_STATUSES } from '../../../../common/enums';
const { CONTENT_NOT_FOUND } = ERROR_MESSAGE;
const emptyObjString = '{}';

class AdminTicketController extends BaseController {
  constructor() {
    super(TicketService);
  }

  insert = async (req, res) => res.status(httpStatus.NOT_FOUND).send()

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
      const result = await this.service.getAllForAdmin(query, option);
      return res.status(httpStatus.OK).send(result);
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
      const model = await this.service.getByCondition({ _id: id });

      if (model == null) {
        throw new APIError(CONTENT_NOT_FOUND, httpStatus.NOT_FOUND);
      }
      req.model = model;
      return next();
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async get(req, res) {
    try {
      const { model } = req;

      return res.status(httpStatus.OK).send(model);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  getTicketActivity = async (req, res) => {
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

      const solved = await this.service.getTicketCount({ ...queryCondition, status: TICKET_STATUS.SOLVED });
      const unsolved = await this.service.getTicketCount({ ...queryCondition, status: TICKET_STATUS.UNSOLVED });
      const pending = await this.service.getTicketCount({ ...queryCondition, status: TICKET_STATUS.PENDING });
      const idle = await this.service.getTicketCount({ ...queryCondition, status: TICKET_STATUS.IDLE });
      const processing = await this.service.getTicketCount({ ...queryCondition, status: TICKET_STATUS.PROCESSING });
      return res.status(httpStatus.OK).send({
        solved, unsolved, pending, processing, idle,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export default new AdminTicketController(TicketService);
