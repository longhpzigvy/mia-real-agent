import { fromJS } from 'immutable';
import {
  AUTH_LOGOUT,
  AUTH_LOGIN_SUCCESS,
} from '../auth';

export const REHYDRATE_COMPLETE = 'root/REHYDRATE_COMPLETE';
export const CLEAR_TRANSACTION = 'root/CLEAR_TRANSACTION';
export const CHANGE_LANGUAGE = 'root/CHANGE_LANGUAGE';
export const FETCH_CURRENT_VERSION = 'root/FETCH_CURRENT_VERSION';
export const FETCH_CURRENT_VERSION_COMPLETE = 'root/FETCH_CURRENT_VERSION_COMPLETE';
export const FETCH_CURRENT_VERSION_FAIL = 'root/FETCH_CURRENT_VERSION_FAIL';

export const UPDATE_SYSTEM = 'system/UPDATE_SYSTEM';
export const UPDATE_SYSTEM_COMPLETE = 'system/UPDATE_SYSTEM_COMPLETE';
export const UPDATE_SYSTEM_FAIL = 'system/UPDATE_SYSTEM_FAIL';
// action creator
export const changeLanguage = lng => ({
  type: CHANGE_LANGUAGE,
  payload: {
    lng,
  },
});

export const updateSystemAction = system => ({
  type: UPDATE_SYSTEM,
  payload: {
    system,
  },
});

export const updateSystemComplete = system => ({
  type: UPDATE_SYSTEM_COMPLETE,
  payload: {
    system,
  },
});

export const updateSystemFail = errorMessage => ({
  type: UPDATE_SYSTEM_FAIL,
  errorMessage,
});

export const fetchCurrentVersionComplete = version => ({
  type: FETCH_CURRENT_VERSION_COMPLETE,
  payload: version,
});

export const fetchCurrentVersionFail = errorMessage => ({
  type: FETCH_CURRENT_VERSION_FAIL,
  errorMessage,
});

// selector
export const isPageLoading = ({ system }) => system.get('isLoading');

export const getSystemLanguage = ({ system }) => system.get('lng');

export const getSystem = ({ system }) => system.get('system');

export const getSystemIsUpdating = ({ system }) => system.get('isUpdating');

export const getSystemUpdateError = ({ system }) => system.get('updateError');

const initialState = fromJS({
  isLoading: true,
  lng: localStorage.getItem('i18nextLng') || 'en',
  system: {},

  isUpdating: false,
  updateError: '',
});

function systemReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_LOGOUT:
    case AUTH_LOGIN_SUCCESS: {
      return state.set('isLoading', false);
    }

    case UPDATE_SYSTEM: {
      return state
        .set('isUpdating', true)
        .set('updateError', '');
    }
    case UPDATE_SYSTEM_COMPLETE: {
      const { system } = action.payload;
      return state
        .set('isUpdating', false)
        .set('system', system);
    }
    case UPDATE_SYSTEM_FAIL: {
      const { errorMessage } = action;
      return state
        .set('isUpdating', false)
        .set('updateError', errorMessage);
    }

    case CLEAR_TRANSACTION: {
      return state.set('isLoading', true);
    }

    case CHANGE_LANGUAGE: {
      const { lng } = action.payload;
      return state.set('lng', lng);
    }

    case FETCH_CURRENT_VERSION_COMPLETE: {
      const version = action.payload;
      return state.set('system', version);
    }

    default: return state;
  }
}

export default systemReducer;

export const actions = {
};

export const selectors = {
  isPageLoading,
};
