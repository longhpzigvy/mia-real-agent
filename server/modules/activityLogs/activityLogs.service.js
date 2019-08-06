import activityLogsCollection from './activityLogs.model';
import BaseService from '../base/base.service';

class ActivityLogsService extends BaseService {
  constructor() {
    super(activityLogsCollection);
  }
}

export default new ActivityLogsService();
