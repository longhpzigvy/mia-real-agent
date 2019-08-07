/* eslint-disable no-underscore-dangle */
import {
  fromJS, List,
} from 'immutable';
import moment from 'moment';
import { getCurrentTicket, getTicketById } from '../../selectors/ticket';

export const ACTIVITIES_FETCH = 'activities/ACTIVITIES_FETCH';
export const ACTIVITIES_FETCH_SUCCESS = 'activities/ACTIVITIES_FETCH_SUCCESS';
export const ACTIVITIES_FETCH_FAILED = 'activities/ACTIVITIES_FETCH_FAILED';

export const ACTIVITIES_CONVERSATION_FETCH = 'activities/ACTIVITIES_CONVERSATION_FETCH';
export const ACTIVITIES_CONVERSATION_FETCH_SUCCESS = 'activities/ACTIVITIES_CONVERSATION_FETCH_SUCCESS';
export const ACTIVITIES_CONVERSATION_FETCH_FAILED = 'activities/ACTIVITIES_CONVERSATION_FETCH_FAILED';

export const ACTIVITIES_TICKET_FETCH = 'activities/ACTIVITIES_TICKET_FETCH';
export const ACTIVITIES_TICKET_FETCH_SUCCESS = 'activities/ACTIVITIES_TICKET_FETCH_SUCCESS';
export const ACTIVITIES_TICKET_FETCH_FAILED = 'activities/ACTIVITIES_TICKET_FETCH_FAILED';

export const ACTIVITIES_ADD_NEW = 'activities/ACTIVITIES_ADD_NEW';
export const ACTIVITIES_CONVERSATION_ADD_NEW = 'activities/ACTIVITIES_CONVERSATION_ADD_NEW';
export const ACTIVITIES_TICKET_ADD_NEW = 'activities/ACTIVITIES_TICKET_ADD_NEW';

// action creator
export const fetchActivities = () => ({
  type: ACTIVITIES_FETCH,
});

export const fetchActivitiesSuccess = (activities, total) => ({
  type: ACTIVITIES_FETCH_SUCCESS,
  payload: {
    activities,
    total,
  },
});

export const fetchActivitiesFailed = error => ({
  type: ACTIVITIES_FETCH_FAILED,
  payload: {
    error,
  },
});

// Ticket actions

export const fetchTicketActivities = ticketId => ({
  type: ACTIVITIES_TICKET_FETCH,
  payload: {
    ticketId,
  },
});

export const fetchTicketActivitiesSuccess = (ticketId, activities, total) => ({
  type: ACTIVITIES_TICKET_FETCH_SUCCESS,
  payload: {
    ticketId,
    activities,
    total,
  },
});

export const fetchTicketActivitiesFailed = (ticketId, error) => ({
  type: ACTIVITIES_TICKET_FETCH_FAILED,
  payload: {
    ticketId,
    error,
  },
});

// conversation fetch action

export const fetchConversationActivities = conversationId => ({
  type: ACTIVITIES_CONVERSATION_FETCH,
  payload: {
    conversationId,
  },
});

export const fetchConversationActivitiesSuccess = (conversationId, activities, total) => ({
  type: ACTIVITIES_CONVERSATION_FETCH_SUCCESS,
  payload: {
    conversationId,
    activities,
    total,
  },
});

export const fetchConversationActivitiesFailed = (conversationId, error) => ({
  type: ACTIVITIES_CONVERSATION_FETCH_FAILED,
  payload: {
    conversationId,
    error,
  },
});

// add new actions
export const addNewActivity = activity => ({
  type: ACTIVITIES_ADD_NEW,
  payload: {
    activity,
  },
});

export const addNewTicketActivity = (ticketId, activity) => ({
  type: ACTIVITIES_TICKET_ADD_NEW,
  payload: {
    ticketId,
    activity,
  },
});

export const addNewConversationActivity = (conversationId, activity) => ({
  type: ACTIVITIES_CONVERSATION_ADD_NEW,
  payload: {
    conversationId,
    activity,
  },
});


// selector

export const getMainActivities = ({ activities }) => activities.get('mainActivityList').toJS();
export const getConversationActivities = ({ activities }, conversationId) => (activities.getIn(['conversationActivityList', conversationId]) || fromJS([])).toJS();
export const getTicketActivities = ({ activities }, ticketId) => (activities.get(['ticketActivityList', ticketId]) || fromJS([])).toJS();
export const getCurrentActivities = (state) => {
  const ticketId = getCurrentTicket(state);
  const ticket = getTicketById(state, ticketId);
  const { conversationId } = ticket;

  const conversationActivites = getConversationActivities(state, conversationId);
  const ticketActivites = getTicketActivities(state, ticketId);

  const activityList = conversationActivites.concat(ticketActivites);

  return activityList.sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)));
};

// reducer

const initialState = fromJS({
  mainActivityList: [],
  ticketActivityList: {},
  conversationActivityList: {},
  isFetching: {},
  error: {},
  total: 0,
});

function reducer(state = initialState, action) {
  switch (action.type) {
    // handle activities list from API
    case ACTIVITIES_TICKET_FETCH:
    case ACTIVITIES_CONVERSATION_FETCH:
    case ACTIVITIES_FETCH: {
      const { ticketId, conversationId } = action.payload;
      const key = ticketId || conversationId || 'main';

      return state
        .setIn(['isFetching', key], true)
        .setIn(['error', key], null);
    }

    case ACTIVITIES_CONVERSATION_FETCH_FAILED:
    case ACTIVITIES_TICKET_FETCH_FAILED:
    case ACTIVITIES_FETCH_FAILED: {
      const { error, ticketId, conversationId } = action.payload;
      const key = ticketId || conversationId || 'main';

      return state
        .setIn(['isFetching', key], false)
        .setIn(['error', key], error);
    }

    case ACTIVITIES_FETCH_SUCCESS: {
      const {
        activities = [], total,
      } = action.payload;
      const mainActivityList = state.get('mainActivityList').push(...activities);

      return state
        .setIn(['isFetching', 'main'], false)
        .set('mainActivityList', mainActivityList)
        .set('total', total);
    }

    case ACTIVITIES_TICKET_FETCH_SUCCESS: {
      const {
        activities = [],
        ticketId,
      } = action.payload;
      let activityList = state
        .getIn(['ticketActivityList', ticketId]);

      // with the first success, activity list will not be available
      // hence we should create new list
      if (!activityList) {
        activityList = new List(activities);
      } else {
        activityList = activityList.push(...activities);
      }

      return state
        .setIn(['isFetching', ticketId], false)
        .setIn(['ticketActivityList', ticketId], activityList);
    }

    case ACTIVITIES_CONVERSATION_FETCH_SUCCESS: {
      const {
        activities = [],
        conversationId,
      } = action.payload;
      let activityList = state
        .getIn(['conversationActivityList', conversationId]);

      // with the first success, activity list will not be available
      // hence we should create new list
      if (!activityList) {
        activityList = new List(activities);
      } else {
        activityList = activityList.push(...activities);
      }

      return state
        .setIn(['isFetching', conversationId], false)
        .setIn(['conversationActivityList', conversationId], activityList);
    }

    // add new actions created and emitted from socket.io

    case ACTIVITIES_ADD_NEW: {
      const { activity } = action.payload;
      const mainActivityList = state.get('mainActivityList').unshift(activity);

      return state.set('mainActivityList', mainActivityList);
    }

    case ACTIVITIES_CONVERSATION_ADD_NEW: {
      const { activity, conversationId } = action.payload;
      const activityList = state
        .getIn(['conversationActivityList', conversationId])
        .unshift(activity);

      return state
        .setIn(['conversationActivityList', conversationId], activityList);
    }

    case ACTIVITIES_TICKET_ADD_NEW: {
      const { activity, ticketId } = action.payload;
      const activityList = state
        .getIn(['ticketActivityList', ticketId])
        .unshift(activity);

      return state
        .setIn(['ticketActivityList', ticketId], activityList);
    }


    default: {
      return state;
    }
  }
}

export default reducer;

export const actions = {
  fetchActivities,
  fetchActivitiesSuccess,
  fetchActivitiesFailed,

  fetchTicketActivities,
  fetchTicketActivitiesSuccess,
  fetchTicketActivitiesFailed,

  fetchConversationActivities,
  fetchConversationActivitiesSuccess,
  fetchConversationActivitiesFailed,
};

export const selectors = {
};
