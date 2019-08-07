import activityLogsCollection from './activityLogs.model';
import BaseService from '../base/base.service';

class ActivityLogsService extends BaseService {
  constructor() {
    super(activityLogsCollection);
  }

  async getByConversation(id) {
    const result = await this.collection.find({
      'payload.conversationId': id,
    }).exec();

    return result;
  }

  async getByTicket(id) {
    const result = await this.collection.find({
      'payload.ticketId': id,
    }).exec();

    return result;
  }
}

export default new ActivityLogsService();
