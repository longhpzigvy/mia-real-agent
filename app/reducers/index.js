/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import auth from './auth';
import profile from './profile';
import ticket from './ticket';
import chat from './chat';
import modal from './modal';
import application from './application';
import history from '../utils/history';
import user from './user';
import admin from './admin';
import system from './system';

export const REHYDRATE_COMPLETE = 'root/REHYDRATE_COMPLETE';
export const CLEAR_TRANSACTION = 'root/CLEAR_TRANSACTION';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    auth,
    profile,
    ticket,
    chat,
    modal,
    user,
    admin,
    application,
    system,
    router: connectRouter(history),
    ...injectedReducers,
  });

  // Wrap the root reducer and return a new root reducer with router state
  return rootReducer;
}
