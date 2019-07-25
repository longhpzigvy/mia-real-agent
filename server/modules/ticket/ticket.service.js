import ticketCollection from './ticket.model';
import BaseService from '../base/base.service';

class TicketService extends BaseService {
  constructor(collection) {
    super(collection);
    this.countDocument = this.countDocument.bind(this);
    this.getByCondition = this.getByCondition.bind(this);
  }

  getByCondition(condition) {
    return this.collection.findOne(condition);
  }

  getAllByConditionWithPopulationInfo(condition, population) {
    return this.collection.find(condition).populate(population);
  }

  countDocument(filter) {
    return this.collection.countDocuments(filter);
  }

  async getAllWithUserData(condition, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const notDeletedCondition = {
      $or: [
        { deletedAt: { $exists: false } },
        { deletedAt: { $exists: true, $in: [null] } },
      ],
    };
    const notArchivedCondition = {
      $or: [
        { archived: { $exists: false } },
        { archived: { $exists: true, $in: [null] } },
      ],
    };
    const queryCondition = {
      $and: [condition, notDeletedCondition, notArchivedCondition],
    };

    const resultPromise = this.collection
      .find(queryCondition, null, options)
      .populate({ path: 'owner', select: ['_id', 'username'] }) // only get _id and username of owner
      .populate({ path: 'assignee', select: ['_id', 'username'] }) // only get _id and username of assignee
      .sort(sort)
      .skip(+skip)
      .limit(+limit || 10)
      .exec();

    return {
      result: await resultPromise,
      totalRecord: await this.countDocument(queryCondition),
    };
  }

  async getAll(condition, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const notDeletedCondition = {
      $or: [
        { deletedAt: { $exists: false } },
        { deletedAt: { $exists: true, $in: [null] } },
      ],
    };
    const notArchivedCondition = {
      $or: [
        { archived: { $exists: false } },
        { archived: { $exists: true, $in: [null] } },
      ],
    };
    const queryCondition = {
      $and: [condition, notDeletedCondition, notArchivedCondition],
    };

    const resultPromise = this.collection
      .find(queryCondition, null, options)
      .sort(sort)
      .skip(+skip)
      .limit(+limit || 10)
      .exec();

    return {
      result: await resultPromise,
      totalRecord: await this.countDocument(queryCondition),
    };
  }

  async getAllByOwner(owner) {
    const result = await this.collection.find({ owner }).exec();
    return result;
  }

  async getTicketCount(query) {
    const result = await this.collection.find(query).count();
    return result;
  }
}

export default new TicketService(ticketCollection);
