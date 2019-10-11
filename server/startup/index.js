import createMiaAccountTask from './createMiaAccount';
import createDefaultSystemVersion from './createDefaultSystemVersion';
import createAdminAccount from './createAdminAccount';
import Logger from '../logger';

const startUpTask = async () => {
  await Promise.all([
    createMiaAccountTask(),
    createAdminAccount(),
    createDefaultSystemVersion(),
  ]);
  Logger.info('Finished all start up tasks');
};

export default startUpTask;
