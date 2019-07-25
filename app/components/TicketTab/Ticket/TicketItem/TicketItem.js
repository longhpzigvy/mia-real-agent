/* eslint-disable default-case */
import React, { Component } from 'react';
import moment from 'moment';
import { object, number, bool } from 'prop-types';
import { Icon } from 'antd';
import {
  DashboardTitle,
  DashboardStatus,
  DashboardRightBlock,
  DashboardSubTitle,
  DashboardLinkTitle,
  DashboardSubActivity,
} from 'components/ActivityTab/ActivityTab.styled';
import {
  TableContentItem,
} from '../../../TableComponent/TableComponent.styled';
import { TableContent } from '../../../TableComponent/TableComponent';
import { columnSizeContent } from '../ColumnSize';

class TicketItem extends Component {
  static propTypes = {
    ticket: object.isRequired,
    index: number,
    isRealAgent: bool.isRequired,
  }

  renderSubtitle = () => {
    const { ticket } = this.props;
    const {
      ticketId,
      createdAt,
    } = ticket;
    const timeFromNow = moment(createdAt).fromNow();

    return (
      <DashboardSubActivity>
        {`#${ticketId} opened ${timeFromNow}`}
      </DashboardSubActivity>
    );
  }

  renderTicketContent = () => {
    const { ticket, isRealAgent } = this.props;
    const { ticketId, owner } = ticket;
    const url = isRealAgent ? `/conversation/${ticketId}/${owner}` : `/conversation/${ticketId}`;
    return (
      <DashboardTitle>
        <DashboardRightBlock>
          <DashboardSubTitle>
            <DashboardLinkTitle to={url}>
              {ticket.title}
            </DashboardLinkTitle>
          </DashboardSubTitle>
          {this.renderSubtitle()}
        </DashboardRightBlock>
      </DashboardTitle>
    );
  }

  renderTicketStatus = () => (
    <DashboardStatus>
      <Icon twoToneColor="#28a745" type="exclamation-circle" theme="twoTone" />
    </DashboardStatus>
  )


  render() {
    const { index } = this.props;
    return (
      <TableContentItem key={index} ticket>
        <TableContent {...columnSizeContent[0]}>
          {this.renderTicketStatus()}
        </TableContent>
        <TableContent {...columnSizeContent[1]}>
          {this.renderTicketContent()}
        </TableContent>
      </TableContentItem>
    );
  }
}

export default TicketItem;
