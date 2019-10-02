import React from 'react';
import { shape } from 'prop-types';
import Numeral from 'numeral';
import { Divider } from 'antd';
import {
  ReceiptWrapper, ReceiptRow, ReceiptCol, ReceiptTitle,
} from './styled';
import { getHourMinutes, calculateChargeTime, toI18n } from '../../utils/func-utils';
import { MIA_RATE, NUMERAL_MONEY_FORMAT } from '../../utils/constants';

class TicketReceipt extends React.PureComponent {
  static propTypes = {
    ticket: shape().isRequired,
    user: shape().isRequired,
  }

  render() {
    const { user, ticket } = this.props;
    const {
      processingDate, assignee,
    } = ticket;
    if (!processingDate) {
      return true;
    }
    const {
      openingTime,
      processingTime,
      remainingOpeningTime,
      remainingProcessingTime,
      remainingCreditTime,
    } = calculateChargeTime(ticket, user);
    // Direct charge if has remaining ticket time
    let miaFee = 0;
    let agentFee = 0;
    let agentRate = 0;
    if ((remainingOpeningTime > 0 || remainingProcessingTime > 0)) {
      // Convert usedTime to $
      if (remainingOpeningTime > 0) {
        miaFee = Number(MIA_RATE * remainingOpeningTime / 60).toFixed(2);
      }
      if (remainingProcessingTime > 0 && assignee) {
        const { application } = assignee;
        agentRate = application.billingRate;
        agentFee = Number(agentRate * remainingProcessingTime / 60).toFixed(2);
      }
    }
    const opening = getHourMinutes(openingTime);
    const processing = getHourMinutes(processingTime);
    const total = getHourMinutes(openingTime + processingTime);
    const remainingTime = getHourMinutes(remainingCreditTime);

    return (
      <ReceiptWrapper>
        <ReceiptRow>
          <ReceiptCol span={16}>
            {toI18n('TICKET_RECEIPT_BOT_TIME')}
          </ReceiptCol>
          <ReceiptCol span={8}>
            {Numeral(opening.hours).format('00')}
            :
            {Numeral(opening.minutes).format('00')}
          </ReceiptCol>
        </ReceiptRow>
        <ReceiptRow>
          <ReceiptCol span={16}>
            {toI18n('TICKET_RECEIPT_AGENT_TIME')}
          </ReceiptCol>
          <ReceiptCol span={8}>
            {Numeral(processing.hours).format('00')}
            :
            {Numeral(processing.minutes).format('00')}
          </ReceiptCol>
        </ReceiptRow>
        <Divider />
        <ReceiptRow>
          <ReceiptCol span={16} bold>
            {toI18n('TICKET_RECEIPT_TOTAL')}
          </ReceiptCol>
          <ReceiptCol span={8} hightlight mega>
            {Numeral(total.hours).format('00')}
            :
            {Numeral(total.minutes).format('00')}
          </ReceiptCol>
        </ReceiptRow>
        <ReceiptRow>
          <ReceiptCol span={16} bold>
            {toI18n('TICKET_RECEIPT_REMAIN')}
          </ReceiptCol>
          <ReceiptCol span={8} mega>
            {Numeral(remainingTime.hours).format('00')}
            :
            {Numeral(remainingTime.minutes).format('00')}
          </ReceiptCol>
        </ReceiptRow>
        {!!miaFee && (
          <ReceiptRow>
            <ReceiptCol span={16}>
              {toI18n('TICKET_RECEIPT_BOT_FEE')}
              {
                `: ${remainingOpeningTime} * ${MIA_RATE}`
              }
            </ReceiptCol>
            <ReceiptCol span={8}>
              {Numeral(miaFee).format(NUMERAL_MONEY_FORMAT)}
            </ReceiptCol>
          </ReceiptRow>
        )}
        {!!agentFee && (
          <ReceiptRow>
            <ReceiptCol span={16}>
              {toI18n('TICKET_RECEIPT_AGENT_FEE')}
              {
                `: ${remainingProcessingTime} * ${agentRate}`
              }
            </ReceiptCol>
            <ReceiptCol span={8}>
              {Numeral(agentFee).format(NUMERAL_MONEY_FORMAT)}
            </ReceiptCol>
          </ReceiptRow>
        )
        }
        <Divider />
      </ReceiptWrapper>
    );
  }
}

export default TicketReceipt;
