import {
  call, put, takeLeading,
  take, all, select,
} from 'redux-saga/effects';
// lodash
import _get from 'lodash/get';
// utils
import {
  ACTIVITIES_CONVERSATION_FETCH,
  ACTIVITIES_TICKET_FETCH,
  ACTIVITIES_FETCH,
  getTicketActivities,
  getConversationActivities,
  actions,
} from '../../reducers/activities';
import {
  AUTH_LOGIN_SUCCESS,
} from '../../reducers/auth';
import {
  fetchTicketActivities,
  fetchConversationctivities,
  fetchMainActivities,
} from '../../api/activities';

function* fetchMainActivitiesSaga() {
  try {
    const { error, response } = yield call(fetchMainActivities, '5d37c39798e7311281ed4431');
    if (error) throw error;

    const { data } = response;
    const { result, totalRecord } = data;

    yield put(actions.fetchActivitiesSuccess(result, totalRecord));
  } catch (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    yield put(actions.fetchActivitiesFailed(message));
  }
}

function* fetchTicketActivitiesSaga({ payload }) {
  const { ticketId } = payload;
  try {
    const { error, response } = yield call(fetchTicketActivities, ticketId);
    if (error) throw error;

    const { data } = response;

    yield put(actions.fetchTicketActivitiesSuccess(ticketId, data));
  } catch (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    yield put(actions.fetchTicketActivitiesFailed(ticketId, message));
  }
}

/**
 *
 * @param {Object} redux action
 * Fetch all activity with conversationId of a current user
 */
function* fetchConversationActivitiesSaga({ payload }) {
  const { conversationId } = payload;
  try {
    const { error, response } = yield call(fetchConversationctivities, conversationId);
    if (error) throw error;

    const { data } = response;

    yield put(actions.fetchConversationActivitiesSuccess(conversationId, data));
  } catch (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    yield put(actions.fetchConversationActivitiesFailed(conversationId, message));
  }
}

function* ticketFlow() {
  yield take(AUTH_LOGIN_SUCCESS);
  yield all([
    fetchMainActivitiesSaga(),
    takeLeading(ACTIVITIES_CONVERSATION_FETCH, fetchConversationActivitiesSaga),
    takeLeading(ACTIVITIES_TICKET_FETCH, fetchTicketActivitiesSaga),
    takeLeading(ACTIVITIES_FETCH, fetchMainActivitiesSaga),
  ]);
}

export default ticketFlow;
