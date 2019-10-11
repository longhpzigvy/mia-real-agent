import TableManagement from 'components/TableManagement';
import { connect } from 'react-redux';
import { actions } from 'reducers/ticket';
import { createStructuredSelector } from 'reselect';
import history from 'utils/history';
import {
  getTicketsList,
  getIsFetching,
  getTicketTotalRecord,
  getSelectedPage,
  getSizePerPage,
} from 'selectors/ticket';
import { COLUMN_TYPE } from 'utils/constants';
import { toI18n } from '../../utils/func-utils';

const ticketColumns = [
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: '_id',
    columnAttr: {
      value: toI18n('ADMIN_TICKET_TABLE_TICKET_ID'),
      percent: 10,
      className: 'text-bold ticket-Id',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'title',
    columnAttr: {
      percent: 20,
      value: toI18n('ADMIN_TICKET_TABLE_TITLE'),
      className: 'text-bold ticket-title',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'category',
    columnAttr: {
      value: toI18n('ADMIN_TICKET_TABLE_CATEGORY'),
      percent: 13,
      className: 'ticket-category',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'owner.username',
    columnAttr: {
      value: toI18n('ADMIN_TICKET_TABLE_OWNER'),
      percent: 7,
      className: 'ticket-owner',
    },
  },
  {
    type: COLUMN_TYPE.TEXT,
    dataKey: 'assignee.username',
    columnAttr: {
      value: toI18n('ADMIN_TICKET_TABLE_ASSIGNEE'),
      percent: 10,
      className: 'ticket-assignee',
    },
  },
  {
    type: COLUMN_TYPE.STATUS,
    dataKey: 'status',
    columnAttr: {
      value: toI18n('ADMIN_TICKET_TABLE_STATUS'),
      textCenter: true,
      percent: 5,
      className: 'ticket-status',
    },
  },
];

const mapDispatchToProps = {
  fetchList: actions.ticketAdminGetAll,
  changePage: actions.changePage,
};

const structureSelectorFunc = createStructuredSelector({
  items: getTicketsList,
  isLoading: getIsFetching,
  totalCount: getTicketTotalRecord,
  selectedPage: getSelectedPage,
  sizePerPage: getSizePerPage,
});

const mapStateToProps = (state) => {
  const structureSelector = structureSelectorFunc(state);
  return {
    ...structureSelector,
    columns: ticketColumns,
    onClick: ({ _id }) => { history.push(`/admin/tickets/${_id}`); },
    endpoint: 'admin/tickets',
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableManagement);
