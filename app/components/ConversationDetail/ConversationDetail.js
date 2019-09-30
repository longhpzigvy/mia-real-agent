import React, { Component } from 'react';
import ShadowScrollbars from 'components/Scrollbar';
import _isEmpty from 'lodash/isEmpty';
import { Descriptions } from 'antd';

import { shape, string } from 'prop-types';
import {
  ConversationDetailWrapper,
  ConversationInfoWrapper,
  ConversationTimelineWrapper,
  ChatbotConversationDetailWrapper,
  TicketStatus,
  NoInformationText,
} from './styles';
import { ROLES } from '../../../common/enums';
import TimerWrapper from './Timer';
import { toI18n, isAgent } from '../../utils/func-utils';

const scrollStyle = {
  height: 'calc(100vh - 9em)',
  width: '100%',
};

export default class ConversationDetail extends Component {
  static propTypes = {
    ticket: shape(),
    userRole: string,
  }

  renderOwnerInfo = () => {
    const { ticket } = this.props;
    const { owner } = ticket;
    if (_isEmpty(owner)) {
      return (<NoInformationText>{toI18n('CONV_MESSAGE_BOX_DETAIL_NO_DATA')}</NoInformationText>);
    }
    const { role, profile = {} } = owner;
    const { firstName, lastName, company = 'N/A' } = profile;
    switch (role) {
      case ROLES.INDIVIDUAL:
        return `${firstName} ${lastName} - ${company}`;
      case ROLES.BUSINESS:
        return company;
      default: return `${owner}" - ${role}`;
    }
  }

  renderAssigneeInfo = () => {
    const { ticket } = this.props;
    const { assignee } = ticket;
    if (_isEmpty(assignee)) {
      return (<NoInformationText>{toI18n('CONV_MESSAGE_BOX_DETAIL_NO_DATA')}</NoInformationText>);
    }
    const { application } = assignee || {};
    const { nickname, billingRate } = application;
    return (
      <div className="assignee">
        <span>
          {nickname}
          {`  - $${billingRate}/h`}
        </span>
      </div>
    );
  }

  renderConversationInfo = () => {
    const { ticket, userRole } = this.props;
    if (!ticket) {
      return (
        <ConversationInfoWrapper>
          <Descriptions column={4}>
            {toI18n('CONV_MESSAGE_BOX_DETAIL_NO_DATA')}
          </Descriptions>
        </ConversationInfoWrapper>
      );
    }
    const {
      title, description, status, assignee, history, processingDate,
    } = ticket;
    return (
      <ConversationInfoWrapper>
        <TimerWrapper history={history} processingDate={processingDate} />
        <Descriptions column={_isEmpty(assignee) ? 4 : 5}>
          <Descriptions.Item label={toI18n('CONV_MESSAGE_BOX_DETAIL_STATUS')}>
            <TicketStatus status={status} />
            {status}
          </Descriptions.Item>
          <Descriptions.Item label={toI18n('CONV_MESSAGE_BOX_DETAIL_TICKET')}>{title}</Descriptions.Item>
          <Descriptions.Item label={toI18n('CONV_MESSAGE_BOX_DETAIL_DESCRIPTION')}>{description}</Descriptions.Item>
          <Descriptions.Item label={toI18n('CONV_MESSAGE_BOX_DETAIL_OWNER')}>{this.renderOwnerInfo()}</Descriptions.Item>
          {!_isEmpty(assignee) && !isAgent(userRole) ? (<Descriptions.Item label={toI18n('CONV_MESSAGE_BOX_DETAIL_ASSIGNEE')}>{this.renderAssigneeInfo()}</Descriptions.Item>) : <div />}
        </Descriptions>
      </ConversationInfoWrapper>
    );
  }

  renderConversationTimeline = () => (
    <ConversationTimelineWrapper>
      {/* <Timeline>
        <Timeline.Item dot={<Icon type="check-circle" style={{ fontSize: '16px' }} />} color="green">
          Con Luong opened 3 minutes ago
        </Timeline.Item>
        <Timeline.Item dot={<Icon type="edit" style={{ fontSize: '16px' }} />} color="red">
          The status changed to Processing
        </Timeline.Item>
        <Timeline.Item dot={<Icon type="exclamation-circle" style={{ fontSize: '16px' }} />} color="blue">
          Con Luong assigned Tri Nguyen
        </Timeline.Item>
      </Timeline> */}
    </ConversationTimelineWrapper>
  )

  render() {
    return (
      <ChatbotConversationDetailWrapper>
        <ShadowScrollbars autoHide style={scrollStyle}>
          <ConversationDetailWrapper>
            {this.renderConversationInfo()}
            {this.renderConversationTimeline()}
          </ConversationDetailWrapper>
        </ShadowScrollbars>
      </ChatbotConversationDetailWrapper>
    );
  }
}
