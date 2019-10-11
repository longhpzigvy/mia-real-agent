import UserService from '../modules/user/user.service';
import { ROLES } from '../../common/enums';
import Logger from '../logger';
import { hashFunc } from '../utils/bcrypt';

export default async function () {
  try {
    Logger.info('[STARTUP TASKS] CREATING ACCOUNT FOR ADMIN');
    const admin = await UserService.getByUsername('admin');
    if (admin) {
      Logger.info(`[STARTUP TASKS] ADMIN HAS ALREADY CREATED WITH ID: ${admin._id}`);
      Logger.info('admin@miaconsult.com/admin');
      return;
    }
    const password = await hashFunc('admin');
    const newAdmin = await UserService.insert({
      username: 'admin',
      email: 'admin@miaconsult.com',
      password,
      role: ROLES.ADMIN,
    });
    if (newAdmin) {
      Logger.success(`[STARTUP TASKS] SUCCESSFULLY CREATED ADMIN WITH ID: ${newAdmin._id}`);
      Logger.info('admin@miaconsult.com/admin');
    }
  } catch (error) {
    Logger.error('[STARTUP TASKS] ERROR WHY TRYING TO CREATING ADMIN', error);
  }
}
