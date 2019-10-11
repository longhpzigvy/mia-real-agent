import TableManagement from 'components/TableManagement';
import { connect } from 'react-redux';
import { actions } from 'reducers/application';
import { createStructuredSelector } from 'reselect';
import {
  getApplicationList,
  getIsFetching,
  getApplicationTotalRecord,
  getSelectedPage,
  getSizePerPage,
} from 'selectors/application';
import { COLUMN_TYPE } from 'utils/constants';
import { APPLICATION_STATUS } from '../../../common/enums';
import { toI18n } from '../../utils/func-utils';

const applicationColumns = [
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'nickname',
    columnAttr: {
      value: toI18n('ADMIN_APPLICATION_TABLE_NICKNAME'),
      percent: 15,
      className: 'application-name text-bold',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: ['firstName', 'lastName'],
    columnAttr: {
      value: toI18n('ADMIN_APPLICATION_TABLE_FULL_NAME'),
      percent: 15,
      className: 'application-name text-bold',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'categories',
    columnAttr: {
      value: toI18n('ADMIN_APPLICATION_TABLE_CATEGORY'),
      percent: 25,
      className: 'application-categories',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'yearsOfExp',
    columnAttr: {
      value: toI18n('ADMIN_APPLICATION_TABLE_YEARS_OF_EXP'),
      percent: 10,
      className: 'application-yearsOfExp',
    },
  },
  {
    type: COLUMN_TYPE.ARRAY,
    dataKey: 'languages',
    key: 'name',
    columnAttr: {
      value: toI18n('ADMIN_APPLICATION_TABLE_LANGUAGE'),
      percent: 25,
      className: 'application-languages',
    },
  },
  // {
  //   type: COLUMN_TYPE.LINK,
  //   dataKey: 'cv',
  //   columnAttr: {
  //     value: toI18n('ADMIN_APPLICATION_TABLE_CV'),
  //     percent: 5,
  //     className: 'application-cv',
  //   },
  // },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'role',
    columnAttr: {
      value: toI18n('ADMIN_APPLICATION_TABLE_ROLE'),
      percent: 10,
      className: 'application-role',
    },
  },
  {
    type: COLUMN_TYPE.STATUS,
    dataKey: 'status',
    columnAttr: {
      value: toI18n('ADMIN_APPLICATION_TABLE_STATUS'),
      percent: 15,
      className: 'application-status',
    },
  },
  // {
  //   type: COLUMN_TYPE.ACTIONS,
  //   actions: [
  //     {
  //       dataKey: 'status',
  //       oneOf: [APPLICATION_STATUS.PENDING],
  //       action: 'applicationApprove',
  //       type: 'review',
  //       className: 'application-review',
  //     },
  //   ],
  //   columnAttr: {
  //     value: toI18n('ADMIN_APPLICATION_TABLE_ACTIONS'),
  //     percent: 10,
  //     className: 'application-action',
  //   },
  // },
];

const mapDispatchToProps = {
  fetchList: actions.applicationAdminGetAll,
  changePage: actions.changePage,
  applicationApprove: actions.applicationApprove,
  applicationReject: actions.applicationReject,
  applicationReview: actions.applicationReview,
};

const structureSelectorFunc = createStructuredSelector({
  items: getApplicationList,
  isLoading: getIsFetching,
  totalCount: getApplicationTotalRecord,
  selectedPage: getSelectedPage,
  sizePerPage: getSizePerPage,
});

const mapStateToProps = (state) => {
  const structureSelector = structureSelectorFunc(state);
  return {
    ...structureSelector,
    columns: applicationColumns,
    endpoint: 'admin/applications',
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableManagement);
