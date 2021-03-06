export const toggleLeftSideBar = ({ admin }) => admin.get('toggleLeftSideBar');

const getTicketActivityData = ({ admin }) => admin.getIn(['ticketActivity', 'data'], {});

const getApplicationSummaryData = ({ admin }) => admin.getIn(['applicationSummary', 'data'], {});

const getUserSummaryData = ({ admin }) => admin.getIn(['userSummary', 'data'], {});

export const selectors = {
  getTicketActivityData,
  getApplicationSummaryData,
  getUserSummaryData,
};
