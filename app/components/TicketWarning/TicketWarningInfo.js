/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import TableDetail from 'components/Generals/TableDetail';
import SpinnerLoading from 'components/PageLoading/SpinnerLoading';
import { AdminDetailsContainer, PleaseSelect } from 'components/Generals/ItemDetail.styled';
import ErrorContent from 'components/ErrorContent';
import TicketDetailInfoHeader from './TicketWarningInfoHeader';
import { ConversationLogWrapper, ActionWrapper } from './styles';
import { ButtonPrimary } from '../../stylesheets/Button.style';
import { toI18n } from '../../utils/func-utils';
import TicketOverview from '../TicketDetail/TicketOverview';
import { REPLY_TYPE } from '../../../common/enums';
import { COLUMN_TYPE, DATE_TIME_FORMAT } from '../../utils/constants';

const defaultColumns = [
  {
    headerPropertise: {
      value: toI18n('ADMIN_TICKET_WARNING_TABLE_FROM'),
      percent: 10,
    },
    contentPropertise: {
      percent: 10,
    },
    dataKey: 'from.username',
    type: COLUMN_TYPE.TEXT,
  },
  {
    headerPropertise: {
      value: toI18n('ADMIN_TICKET_WARNING_TABLE_SEND_AT'),
      percent: 20,
    },
    contentPropertise: {
      percent: 20,
    },
    dataKey: 'sentAt',
    type: COLUMN_TYPE.DATE,
    format: DATE_TIME_FORMAT.DATE_TIME,
  },
  {
    headerPropertise: {
      value: toI18n('ADMIN_TICKET_WARNING_TABLE_MESSAGES'),
      percent: 70,
    },
    contentPropertise: {
      percent: 70,
    },
    dataKey: 'messages',
    type: COLUMN_TYPE.TEXT,
  },
];

class TicketWarningInfo extends PureComponent {
  componentDidMount() {
    const { ticketId, fetchTicketSingle } = this.props;
    if (ticketId) {
      fetchTicketSingle(ticketId);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      ticketId, ticketDetail,
      fetchTicketSingle, fetchConversationLog,
    } = this.props;
    const { ticketId: prevticketId, ticketDetail: prevTicketDetail } = prevProps;

    if (prevticketId !== ticketId && ticketId) {
      fetchTicketSingle(ticketId);
      const { conversationId } = ticketDetail || {};
      fetchConversationLog(conversationId);
      return;
    }
    const { conversationId } = ticketDetail || {};
    const { conversationId: prevConversationId } = prevTicketDetail || {};
    if (conversationId !== prevConversationId) {
      fetchConversationLog(conversationId);
    }
  }

  renderConversationLog = () => {
    const { conversationLog } = this.props;
    const warnings = conversationLog.filter(({ type }) => type === REPLY_TYPE.WARNING_ACTION);
    return <TableDetail columns={defaultColumns} items={warnings} emptyMsg="No tickets available" />;
  }

  render() {
    const { ticketDetail, isFetchingReplies } = this.props;
    if (ticketDetail.isLoading || isFetchingReplies) {
      return (
        <AdminDetailsContainer>
          <SpinnerLoading />
        </AdminDetailsContainer>
      );
    }

    if (_isEmpty(ticketDetail)) {
      return (
        <AdminDetailsContainer>
          <PleaseSelect>{toI18n('ADMIN_TICKET_WARNING_DETAIL_SELECT_TICKET')}</PleaseSelect>
        </AdminDetailsContainer>
      );
    }


    if (ticketDetail.error) {
      return (
        <AdminDetailsContainer>
          <ErrorContent error={ticketDetail.error} />
        </AdminDetailsContainer>
      );
    }

    const { title, status } = ticketDetail;

    return (
      <AdminDetailsContainer>
        <TicketDetailInfoHeader title={title} status={status} />
        <ConversationLogWrapper>
          <TicketOverview ticketDetail={ticketDetail} />
          {this.renderConversationLog()}
          <ActionWrapper>
            <ButtonPrimary type="primary">
              {toI18n('ADMIN_TICKET_WARNING_DETAIL_CONTACT_AGENT')}
            </ButtonPrimary>
          </ActionWrapper>
        </ConversationLogWrapper>
      </AdminDetailsContainer>
    );
  }
}

TicketWarningInfo.propTypes = {
  ticketId: PropTypes.string.isRequired,
  fetchTicketSingle: PropTypes.func.isRequired,
  fetchConversationLog: PropTypes.func.isRequired,
  isFetchingReplies: PropTypes.bool.isRequired,
  ticketDetail: PropTypes.object.isRequired,
  conversationLog: PropTypes.arrayOf(PropTypes.shape()),
};

export default TicketWarningInfo;
