import reviewCollection from './review.model';
import BaseService from '../base/base.service';
import { REVIEW_STATUS } from '../../../common/enums';

class ReviewService extends BaseService {
  constructor(collection) {
    super(collection);
    this.countDocument = this.countDocument.bind(this);
    this.getByCondition = this.getByCondition.bind(this);
  }

  getByCondition(condition) {
    return this.collection.findOne(condition);
  }

  countDocument(filter) {
    return this.collection.countDocuments(filter);
  }

  async getReviewCount(query) {
    const result = await this.collection.find(query).count();
    return result;
  }

  async closeOtherReview(applicationId) {
    const result = await this.collection.updateMany({ applicationId }, { status: REVIEW_STATUS.CLOSED });
    return result;
  }
}

export default new ReviewService(reviewCollection);
