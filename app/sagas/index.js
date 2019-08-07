import { all, put, take } from 'redux-saga/effects';
import { configAxios } from '../api/config';
import { CLEAR_TRANSACTION, REHYDRATE_COMPLETE } from '../reducers';
import authSaga from './auth';
import socketioSaga from './socketio';
import profileSaga from './profile';
import ticketSaga from './ticket';
import userSaga from './user';
import adminSaga from './admin';
import applicationSaga from './application';
import conversationSaga from './conversations';
import repliesSaga from './replies';
import agentsSaga from './agents';
import activitiesSaga from './activities';

export default function* rootSagas() {
  configAxios();
  yield all([
    put({
      type: CLEAR_TRANSACTION,
    }),
    take(REHYDRATE_COMPLETE),
  ]);

  yield all([
    authSaga(),
    socketioSaga(),
    profileSaga(),
    ticketSaga(),
    userSaga(),
    applicationSaga(),
    adminSaga(),
    conversationSaga(),
    repliesSaga(),
    agentsSaga(),
    activitiesSaga(),
  ]);
}
