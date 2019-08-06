import BaseController from '../base/base.controller';
import ActivityLogsService from './activityLogs.service';

class ActivityLogsController extends BaseController {
  constructor() {
    super(ActivityLogsService);
  }
}

export default new ActivityLogsController();
