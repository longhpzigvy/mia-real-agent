import BaseRouter from '../base/base.route';
import ActivityLogsController from './activityLogs.controller';

class ActivityLogsRouter extends BaseRouter {
  constructor(controller) {
    super(controller);
    this.router.post('/', this.controller.getActivityByUser);
  }
}

export default new ActivityLogsRouter(ActivityLogsController);
