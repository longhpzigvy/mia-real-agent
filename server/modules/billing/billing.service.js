import BillingCollection from './billing.model';
import BaseService from '../base/base.service';
import { BILLING_TYPE } from '../../../common/enums';

class BillingService extends BaseService {
  constructor() {
    super(BillingCollection);
    this.countDocument = this.countDocument.bind(this);
    this.getByCondition = this.getByCondition.bind(this);
    this.ticketChargeBilling = this.ticketChargeBilling.bind(this);
  }

  async ticketChargeBilling(userId, content, total) {
    await BillingCollection.create({
      type: BILLING_TYPE.TICKET_CHARGE,
      userId,
      content,
      total,
    });
  }

  async topUpBilling(userId, content, total) {
    await BillingCollection.create({
      type: BILLING_TYPE.TOPUP,
      userId,
      content,
      total,
    });
  }

  getByCondition(condition) {
    return this.collection.findOne(condition);
  }

  countDocument(filter) {
    return this.collection.countDocuments(filter);
  }

  async getAll(condition, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const notDeletedCondition = {
      $or: [
        { deleted: { $exists: false } },
        { deleted: { $exists: true, $in: [false] } },
      ],
    };
    const queryCondition = {
      $and: [condition, notDeletedCondition],
    };

    const resultPromise = this.collection
      .find(queryCondition, null, options)
      .sort(sort)
      .skip(+skip)
      .limit(+limit || 10)
      .exec();
    const result = await resultPromise;
    return {
      result,
      totalRecord: await this.countDocument(queryCondition),
    };
  }

  async getBillingCount(query) {
    const result = await this.collection.find(query).count();
    return result;
  }
}

export default new BillingService();
