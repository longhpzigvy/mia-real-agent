import {
  call, put, select,
  takeLatest, take, all,
} from 'redux-saga/effects';
// lodash
import _get from 'lodash/get';
import _assign from 'lodash/assign';
import _pick from 'lodash/pick';
import _pickBy from 'lodash/pickBy';
// utils
import { getSkipLimit } from 'utils/func-utils';

import { notification } from 'antd';
import {
  getSelectedPage, getSizePerPage, reselectSorting,
} from 'selectors/billing';
import {
  actions, BILLING_GET_ALL, BILLING_SORTING, BILLING_CHANGE_PAGE,
  BILLING_FETCH_SINGLE,
} from '../../reducers/billing';
import {
  AUTH_LOGIN_SUCCESS, getUserId,
} from '../../reducers/auth';
import * as BillingApi from '../../api/billing';
import { USER_TOP_UP_SUCCESS } from '../../reducers/profile';

function* queryBillings(action) {
  const billingPayload = {};
  const { type } = action;
  switch (type) {
    case BILLING_SORTING:
      {
        const {
          payload: { field, order },
        } = action;
        _assign(billingPayload, { sort: { [field]: order } });
      }
      break;
    case BILLING_CHANGE_PAGE:
      {
        const { pageIndex, sizePerPage } = action;
        const { skip, limit } = getSkipLimit(pageIndex, sizePerPage);
        _assign(billingPayload, { skip, limit });
      }
      break;
    default:
      break;
  }

  yield put(actions.billingGetAll(billingPayload));
}

function* getAllBilling({ payload }) {
  const selectedPage = yield select(getSelectedPage);
  const sizePerPage = yield select(getSizePerPage);
  const sorting = yield select(reselectSorting);
  const userId = yield select(getUserId);
  const { skip, limit } = getSkipLimit(selectedPage, sizePerPage);
  const { field, order } = sorting;
  const sort = { [field]: order };

  const actionParam = _pickBy(
    _pick(payload, ['skip', 'limit', 'sort']),
    v => v !== null && v !== undefined,
  );

  const params = {
    sort,
    skip,
    limit,
    query: { userId },
    ...actionParam,
  };

  const { response, error } = yield call(BillingApi.getAllBilling, params);
  if (error) {
    const message = _get(
      error, 'response.data.message', error.message
    );
    yield put(actions.billingGetAllFail(message));
    return;
  }

  const data = _get(response, 'data', {});
  const { result, totalRecord } = data;

  yield put(actions.billingGetAllComplete(result, totalRecord));
}

function* billingFetchSingle({ id }) {
  try {
    const { response, error } = yield call(BillingApi.get, id);
    const data = _get(response, 'data', {});
    if (error) {
      throw new Error(error);
    }
    yield put(actions.fetchBillingSingleSuccess(data));
  } catch (error) {
    const errMsg = error.message || error;
    yield put(actions.fetchBillingSingleFail(id, errMsg));
    notification.error({ message: errMsg });
  }
}

function* billingFlow() {
  yield take(AUTH_LOGIN_SUCCESS);
  yield all([
    takeLatest([BILLING_CHANGE_PAGE, BILLING_SORTING], queryBillings),
    takeLatest([BILLING_GET_ALL, USER_TOP_UP_SUCCESS], getAllBilling),
    takeLatest(BILLING_FETCH_SINGLE, billingFetchSingle),
  ]);
}

export default billingFlow;
