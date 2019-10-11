/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { shape } from 'prop-types';
import {
  TicketActivityWrapper,
  TicketActivityLeftItem,
  TicketActivityRightItem,
  TicketActivityTitle,
  TicketActivityGroupItem,
  TicketActivityItem,
  TicketActivityNumber,
  TicketActivityUnit,
  TicketActivityPurpose,
} from './TicketActivity.styled';
import TicketDetailStatistic from './TicketDetailStatistic';
import { toI18n } from '../../../utils/func-utils';
import { COLOR_BY_STATUS, TICKET_STATUS } from '../../../../common/enums';


class TicketActivity extends Component {
  renderActivityItem = (value) => {
    const {
      number, unit, color, title,
    } = value;
    return (
      <TicketActivityItem>
        <TicketActivityNumber color={color}>{number}</TicketActivityNumber>
        <TicketActivityUnit>{unit}</TicketActivityUnit>
        <TicketActivityPurpose>{title}</TicketActivityPurpose>
      </TicketActivityItem>
    );
  };

  renderTicketActivitySummary = () => {
    const { ticketActivity } = this.props;
    const {
      solved = 0, unsolved = 0, pending = 0, processing = 0, idle = 0,
    } = ticketActivity;
    return (
      <TicketActivityGroupItem>
        {this.renderActivityItem({
          number: solved,
          unit: 'Qty',
          color: COLOR_BY_STATUS.Solved,
          title: TICKET_STATUS.SOLVED,
        })}
        {this.renderActivityItem({
          number: unsolved,
          unit: 'Qty',
          color: COLOR_BY_STATUS.Unsolved,
          title: TICKET_STATUS.UNSOLVED,
        })}
        {this.renderActivityItem({
          number: pending,
          unit: 'Qty',
          color: COLOR_BY_STATUS.Pending,
          title: TICKET_STATUS.PENDING,
        })}
        {this.renderActivityItem({
          number: processing,
          unit: 'Qty',
          color: COLOR_BY_STATUS.Processing,
          title: TICKET_STATUS.PROCESSING,
        })}
        {this.renderActivityItem({
          number: idle,
          unit: 'Qty',
          color: COLOR_BY_STATUS.Idle,
          title: TICKET_STATUS.IDLE,
        })}
      </TicketActivityGroupItem>
    );
  }

  render() {
    const { ticketActivity } = this.props;
    return (
      <TicketActivityWrapper>
        <TicketActivityLeftItem>
          <TicketActivityTitle>
            {toI18n('ADMIN_DASHBOARD_TICKETS_ACTIVITY')}
          </TicketActivityTitle>
          {this.renderTicketActivitySummary()}
        </TicketActivityLeftItem>
        <TicketActivityRightItem>
          <TicketActivityTitle>{toI18n('ADMIN_DASHBOARD_TICKETS_DETAIL')}</TicketActivityTitle>
          <TicketDetailStatistic ticketActivity={ticketActivity} />
        </TicketActivityRightItem>
      </TicketActivityWrapper>
    );
  }
}
TicketActivity.propTypes = {
  ticketActivity: shape().isRequired,
};

export default TicketActivity;
