/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import Scrollbar from 'components/Scrollbar';
import SpinnerLoading from 'components/PageLoading/SpinnerLoading';
import { AdminDetailsContainer, PleaseSelect } from 'components/Generals/ItemDetail.styled';
import ErrorContent from 'components/ErrorContent';
import TicketDetailInfoHeader from './TicketWarningInfoHeader';
import { conversationTranscript } from './TicketWarningConversationLog';
import { ConversationLogWrapper, ActionWrapper } from './styles';
import { ButtonPrimary } from '../../stylesheets/Button.style';
import { toI18n } from '../../utils/func-utils';
import TicketOverview from '../TicketDetail/TicketOverview';

const conversationScrollStyle = {
  height: 'calc(100vh - 220px)',
  width: '50%',
};

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

  render() {
    const { ticketDetail, isFetchingReplies, conversationLog } = this.props;
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
          <h2>
            {toI18n('ADMIN_TICKET_WARNING_DETAIL_VIOLATION_MESSAGES')}
          </h2>
          <Scrollbar autoHide style={conversationScrollStyle}>
            {conversationTranscript(conversationLog)}
          </Scrollbar>
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
