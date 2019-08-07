import httpStatus from 'http-status';
import BaseController from '../base/base.controller';
import ActivityLogsService from './activityLogs.service';

class ActivityLogsController extends BaseController {
  constructor() {
    super(ActivityLogsService);
    this.getActivityByUser = this.getActivityByUser.bind(this);
  }

  async getActivityByUser(req, res) {
    try {
      const { user } = req;
      const options = req.query;
      const { _id: userId } = user;

      const activityList = await this.service.getAll({
        createdBy: userId,
      }, options);

      return res.status(httpStatus.OK).send(activityList);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

export default new ActivityLogsController();
