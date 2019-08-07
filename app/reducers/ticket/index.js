import { fromJS } from 'immutable';
import _keyBy from 'lodash/keyBy';
import _get from 'lodash/get';

export const TICKET_CREATE = 'ticket/CREATE';
export const TICKET_CREATE_SUCCESS = 'ticket/CREATE_SUCCESS';
export const TICKET_CREATE_FAIL = 'ticket/CREATE_FAIL';

export const TICKET_GET_ALL = 'ticket/GET_ALL';
export const TICKET_GET_ALL_SUCCESS = 'ticket/GET_ALL_SUCCESS';
export const TICKET_GET_ALL_FAIL = 'ticket/GET_ALL_FAIL';

export const TICKET_GET_DETAIL = 'ticket/GET';
export const TICKET_GET_DETAIL_SUCCESS = 'ticket/GET_SUCCESS';
export const TICKET_GET_DETAIL_FAIL = 'ticket/GET_FAIL';

export const TICKET_ARCHIVE = 'ticket/ARCHIVE';
export const TICKET_ARCHIVE_SUCCESS = 'ticket/ARCHIVE_SUCCESS';
export const TICKET_ARCHIVE_FAIL = 'ticket/GET_FAIL';

export const TICKET_UPDATE = 'ticket/UPDATE';
export const TICKET_UPDATE_SUCCESS = 'ticket/UPDATE_SUCCESS';
export const UPDATE_FAIL = 'ticket/UPDATE_FAIL';

export const TICKET_CLOSE = 'ticket/CLOSE';
export const TICKET_CLOSE_SUCCESS = 'ticket/CLOSE_SUCCESS';
export const TICKET_CLOSE_FAIL = 'ticket/CLOSE_FAIL';

export const TICKET_SORTING = 'ticket/TICKET_SORTING';
export const TICKET_FILTER = 'ticket/TICKET_FILTER';
export const TICKET_FETCH = 'ticket/TICKET_FETCH';

export const TICKET_FETCH_SINGLE = 'ticket/TICKET_FETCH_SINGLE';
export const TICKET_FETCH_SINGLE_SUCCESS = 'ticket/TICKET_FETCH_SINGLE_SUCCESS';
export const TICKET_FETCH_SINGLE_FAIL = 'ticket/TICKET_FETCH_SINGLE_FAIL';

export const TICKET_CHANGE_PAGE = 'ticket/TICKET_CHANGE_PAGE';
export const TICKET_ADMIN_GET_ALL = 'ticket/ADMIN_GET_ALL';
export const TICKET_SET_CURRENT = 'ticket/TICKET_SET_CURRENT';
// action creator

const selectTicket = ticketId => ({
  type: TICKET_SET_CURRENT,
  payload: {
    ticketId,
  },
});

const createAction = payload => ({
  type: TICKET_CREATE,
  payload,
});


const createCompleteAction = payload => ({
  type: TICKET_CREATE_SUCCESS,
  payload,
});

const createFailAction = errorMessage => ({
  type: TICKET_CREATE_FAIL,
  payload: {
    errorMessage,
  },
});

const ticketAdminGetAll = payload => ({
  type: TICKET_ADMIN_GET_ALL,
  payload,
});

export const getAllTicketAction = payload => ({
  type: TICKET_GET_ALL,
  payload,
});


const getAllTicketCompleteAction = (data, totalRecord) => ({
  type: TICKET_GET_ALL_SUCCESS,
  data,
  totalRecord,
});

const getAllTicketFailAction = errorMsg => ({
  type: TICKET_GET_ALL_FAIL,
  errorMsg,
});

const getAction = ticketId => ({
  type: TICKET_GET_DETAIL,
  payload: {
    ticketId,
  },
});

const getCompleteAction = ticket => ({
  type: TICKET_GET_DETAIL_SUCCESS,
  payload: {
    ticket,
  },
});

const getFailAction = errorMessage => ({
  type: TICKET_GET_DETAIL_FAIL,
  payload: {
    errorMessage,
  },
});

const archiveAction = ticketId => ({
  type: TICKET_ARCHIVE,
  payload: {
    ticketId,
  },
});

const archiveCompleteAction = ticket => ({
  type: TICKET_ARCHIVE_SUCCESS,
  payload: ticket,
});

const archiveFailAction = errorMessage => ({
  type: TICKET_ARCHIVE_FAIL,
  payload: {
    errorMessage,
  },
});

const updateAction = ticket => ({
  type: TICKET_UPDATE,
  payload: { ticket },
});


const updateCompleteAction = ticket => ({
  type: TICKET_UPDATE_SUCCESS,
  payload: ticket,
});

const updateFailAction = errorMessage => ({
  type: UPDATE_FAIL,
  payload: {
    errorMessage,
  },
});

const closeAction = ticketId => ({
  type: TICKET_CLOSE,
  payload: {
    ticketId,
  },
});

const closeCompleteAction = ticket => ({
  type: TICKET_CLOSE_SUCCESS,
  payload: ticket,
});

const closeFailAction = errorMessage => ({
  type: TICKET_CLOSE_FAIL,
  payload: {
    errorMessage,
  },
});

const sortTicket = payload => ({
  type: TICKET_SORTING,
  payload,
});

const filterTicket = payload => ({
  type: TICKET_FILTER,
  payload,
});

const changePage = (pageIndex, sizePerPage) => ({
  type: TICKET_CHANGE_PAGE,
  pageIndex,
  sizePerPage,
});

function fetchTicketSingle(id) {
  return {
    type: TICKET_FETCH_SINGLE,
    id,
  };
}

function fetchTicketSingleFail(id, errorMsg) {
  return {
    type: TICKET_FETCH_SINGLE_FAIL,
    errorMsg,
    id,
  };
}

function fetchTicketSingleSuccess(payload) {
  return {
    type: TICKET_FETCH_SINGLE_SUCCESS,
    payload,
  };
}

export const fetchingObj = {
  isFetching: false,
  errorMsg: '',
};

export const initialState = fromJS({
  // error value
  createError: '',
  updateError: '',
  archiveError: '',
  closeError: '',
  getError: '',

  ticket: {},

  tickets: {},
  totalRecord: 0,
  pagination: fromJS({
    selectedPage: 1,
    sizePerPage: 20,
  }),
  visibleTicketIds: [],
  sorting: fromJS({
    field: 'createdAt',
    order: -1,
  }),

  // processing value
  isCreating: false,
  isUpdating: false,
  isArchiving: false,
  isClosing: false,
  isGetting: false,
  fetching: fetchingObj,
  currentTicket: null,
});

function ticketReducer(state = initialState, action) {
  switch (action.type) {
    case TICKET_SET_CURRENT: {
      const { ticketId } = action.payload;
      return state.set('currentTicket', ticketId);
    }

    case TICKET_CREATE:
      return state.set('isCreating', true)
        .set('createError', '');

    case TICKET_CREATE_SUCCESS: {
      const { payload } = action;
      const { _id } = payload;
      const visibleTicketIds = state.get('visibleTicketIds').toJS();
      const totalRecord = state.get('totalRecord');
      const newVisibleTicketIds = [_id, ...visibleTicketIds];
      return state
        .set('isCreating', false)
        .set('totalRecord', totalRecord + 1)
        .setIn(['tickets', _id], fromJS(payload))
        .set('visibleTicketIds', fromJS(newVisibleTicketIds));
    }

    case TICKET_CREATE_FAIL:
      return state.set('isCreating', false)
        .set('createError', action.errorMessage);

    case TICKET_GET_DETAIL:
      return state.set('isGetting', true)
        .set('getError', '');

    case TICKET_GET_DETAIL_SUCCESS: {
      const { ticket } = action.payload;
      const { _id } = ticket;
      return state.set('isGetting', false)
        .setIn(['tickets', _id], fromJS(ticket));
    }

    case TICKET_GET_DETAIL_FAIL:
      return state.set('isGetting', false)
        .set('getError', action.payload.errorMessage);

    case TICKET_ARCHIVE:
      return state.set('isArchiving', true)
        .set('archiveError', '');

    case TICKET_ARCHIVE_SUCCESS: {
      const { payload } = action;
      const { _id } = payload;
      const visibleTicketIds = state.get('visibleTicketIds').toJS();
      const newVisibleTicketIds = visibleTicketIds.filter(id => id !== _id);
      return state
        .set('isArchiving', false)
        .removeIn(['tickets', _id])
        .set('visibleTicketIds', fromJS(newVisibleTicketIds));
    }

    case TICKET_ARCHIVE_FAIL:
      return state.set('isArchiving', false)
        .set('archiveError', action.payload.errorMessage);

    case TICKET_UPDATE:
      return state.set('isUpdating', true)
        .set('updateError', '');

    case TICKET_UPDATE_SUCCESS: {
      const { payload } = action;
      const { _id } = payload;
      return state.set('isUpdating', false)
        .setIn(['tickets', _id], fromJS(payload));
    }

    case UPDATE_FAIL:
      return state.set('isUpdating', false)
        .set('updateError', action.payload.errorMessage);

    case TICKET_CLOSE:
      return state.set('isClosing', true)
        .set('closeError', '');

    case TICKET_CLOSE_SUCCESS: {
      const { payload } = action;
      const { _id } = payload;
      return state
        .set('isClosing', false)
        .setIn(['tickets', _id], fromJS(payload));
    }

    case TICKET_CLOSE_FAIL:
      return state.set('isClosing', false)
        .set('closeError', action.payload.errorMessage);

    case TICKET_ADMIN_GET_ALL:
    case TICKET_GET_ALL:
      return state.set('fetching', fromJS({ isFetching: true, errorMsg: '' }));

    case TICKET_GET_ALL_SUCCESS: {
      const { data, totalRecord } = action;
      const newTickets = state
        .get('tickets')
        .merge(fromJS(_keyBy(data, ({ _id }) => _id)));
      const visibleTicketIds = data.map(({ _id }) => _id);

      return state
        .set('visibleTicketIds', fromJS(visibleTicketIds))
        .set('tickets', newTickets)
        .set('totalRecord', totalRecord)
        .set('fetching', fromJS(fetchingObj));
    }
    case TICKET_GET_ALL_FAIL:
      return state.set('fetching', fromJS({ isFetching: false, errorMsg: action.errorMsg }));

    case TICKET_CHANGE_PAGE:
      return state
        .set('fetching', fromJS({ isFetching: true, errorMsg: '' }))
        .setIn(['pagination', 'selectedPage'], action.pageIndex);

    case TICKET_FETCH_SINGLE:
      return state.setIn(['ticket', action.id, 'isLoading'], true);

    case TICKET_FETCH_SINGLE_SUCCESS: {
      const { payload } = action;
      const { _id } = payload;
      return state.setIn(['ticket', _id], fromJS(payload));
    }

    case TICKET_FETCH_SINGLE_FAIL: {
      const { id, errorMsg } = action;
      return state.setIn(['ticket', id], fromJS({ error: errorMsg }));
    }

    // case TICKET_SET_CURRENT: {
    //   const { id } = action.payload;
    //   const ticket = state.get('byId').get(id);
    //   return state.set('currentTicket', ticket);
    // }
    default: return state;
  }
}

export default ticketReducer;

export const actions = {
  createAction,
  createCompleteAction,
  createFailAction,

  ticketAdminGetAll,
  getAllTicketAction,
  getAllTicketCompleteAction,
  getAllTicketFailAction,

  getAction,
  getCompleteAction,
  getFailAction,

  updateAction,
  updateCompleteAction,
  updateFailAction,

  closeAction,
  closeCompleteAction,
  closeFailAction,

  sortTicket,
  filterTicket,

  changePage,
  archiveAction,
  archiveCompleteAction,
  archiveFailAction,

  fetchTicketSingle,
  fetchTicketSingleFail,
  fetchTicketSingleSuccess,

  selectTicket,
};
