import TableManagement from 'components/TableManagement';
import { connect } from 'react-redux';
import { actions } from 'reducers/user';
import { createStructuredSelector } from 'reselect';
import {
  reselectUsers,
  getIsLoading,
  getTotalCount,
  getSelectedPage,
  getSizePerPage,
} from 'selectors/user';
import { COLUMN_TYPE } from 'utils/constants';
import { toI18n } from '../../utils/func-utils';

const userColumns = [
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'username',
    columnAttr: {
      value: toI18n('ADMIN_USERS_TABLE_USERNAME'),
      percent: '10',
      className: 'user-username text-bold',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'email',
    columnAttr: {
      value: toI18n('ADMIN_USERS_TABLE_EMAIL'),
      className: 'user-email text-bold',
      percent: '20',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'profile.company',
    columnAttr: {
      value: toI18n('ADMIN_USERS_TABLE_COMPANY'),
      percent: '15',
      className: 'user-company',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'profile.phone',
    columnAttr: {
      value: toI18n('ADMIN_USERS_TABLE_PHONE'),
      percent: '15',
      className: 'user-phone',
    },
  },
  {
    type: COLUMN_TYPE.UPPERCASE,
    dataKey: 'role',
    columnAttr: {
      value: toI18n('ADMIN_USERS_TABLE_ROLE'),
      percent: '15',
      className: 'user-role',
    },
  },
];

const mapDispatchToProps = {
  fetchList: actions.fetchListUser,
  changePage: actions.changePage,
};

const structureSelectorFunc = createStructuredSelector({
  items: reselectUsers,
  isLoading: getIsLoading,
  totalCount: getTotalCount,
  selectedPage: getSelectedPage,
  sizePerPage: getSizePerPage,
});

const mapStateToProps = (state) => {
  const structureSelector = structureSelectorFunc(state);

  return {
    ...structureSelector,
    columns: userColumns,
    endpoint: 'admin/user',
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableManagement);
