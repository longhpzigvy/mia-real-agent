import React from 'react';
import { shape } from 'prop-types';
import Numeral from 'numeral';
import { Divider } from 'antd';
import {
  ReceiptWrapper, ReceiptRow, ReceiptCol, ReceiptTableRow,
} from './styled';
import { getHourMinutes, calculateChargeTime, toI18n } from '../../utils/func-utils';
import { MIA_RATE, NUMERAL_MONEY_FORMAT } from '../../utils/constants';

class TicketReceipt extends React.Component {
  static propTypes = {
    ticket: shape().isRequired,
    user: shape().isRequired,
  }

  renderReceiptRow = (item) => {
    const {
      label, time, charge, total, rate,
    } = item;
    return (
      <ReceiptRow>
        <ReceiptCol>
          {label}
        </ReceiptCol>
        <ReceiptCol>
          {time}
        </ReceiptCol>
        <ReceiptCol>
          {charge}
        </ReceiptCol>
        <ReceiptCol>
          {total}
          {`(${rate})`}
        </ReceiptCol>
      </ReceiptRow>
    );
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
    } = calculateChargeTime(ticket, user);
    // Direct charge if has remaining ticket time
    let miaFee = 0;
    let agentFee = 0;
    let agentRate = 0;
    let miaPaidFee = 0;
    let agentPaidFee = 0;

    if (openingTime > 0) {
      miaFee = Number(MIA_RATE * openingTime / 60).toFixed(2);
    }
    if (processingTime > 0 && assignee) {
      const { application } = assignee;
      agentRate = application.billingRate;
      agentFee = Number(agentRate * processingTime / 60).toFixed(2);
    }
    if (remainingOpeningTime > 0) {
      miaPaidFee = Number(MIA_RATE * remainingOpeningTime / 60).toFixed(2);
    }
    if (remainingProcessingTime > 0 && assignee) {
      const { application } = assignee;
      agentRate = application.billingRate;
      agentPaidFee = Number(agentRate * remainingProcessingTime / 60).toFixed(2);
    }
    const opening = getHourMinutes(openingTime);
    const processing = getHourMinutes(processingTime);
    const total = getHourMinutes(openingTime + processingTime);
    const paidTime = getHourMinutes(openingTime + processingTime
      - remainingOpeningTime - remainingProcessingTime);
    return (
      <ReceiptWrapper>
        <ReceiptRow>
          <ReceiptCol span={6} offset={6}>
            {toI18n('TICKET_RECEIPT_RATE')}
          </ReceiptCol>
          <ReceiptCol span={6}>
            {toI18n('TICKET_RECEIPT_CHARGE_TIME')}
          </ReceiptCol>
          <ReceiptCol span={6} bold>
            {toI18n('TICKET_RECEIPT_TOTAL')}
          </ReceiptCol>
        </ReceiptRow>
        <div>
          <ReceiptTableRow grid>
            <ReceiptCol span={6} weight>
              {toI18n('TICKET_RECEIPT_MIA')}
            </ReceiptCol>
            <ReceiptCol span={6}>
              {`${Numeral(MIA_RATE).format(NUMERAL_MONEY_FORMAT)}/h`}
            </ReceiptCol>
            <ReceiptCol span={6}>
              {Numeral(opening.hours).format('00')}
              :
              {Numeral(opening.minutes).format('00')}
            </ReceiptCol>
            <ReceiptCol span={6} bold>
              {Numeral(miaFee).format(NUMERAL_MONEY_FORMAT)}
            </ReceiptCol>
          </ReceiptTableRow>
          <ReceiptTableRow grid>
            <ReceiptCol span={6} weight>
              {toI18n('TICKET_RECEIPT_AGENT')}
            </ReceiptCol>
            <ReceiptCol span={6}>
              {`${Numeral(agentRate).format(NUMERAL_MONEY_FORMAT)}/h`}
            </ReceiptCol>
            <ReceiptCol span={6}>
              {Numeral(processing.hours).format('00')}
              :
              {Numeral(processing.minutes).format('00')}
            </ReceiptCol>
            <ReceiptCol span={6} bold>
              {Numeral(agentFee).format(NUMERAL_MONEY_FORMAT)}
            </ReceiptCol>
          </ReceiptTableRow>
        </div>
        <ReceiptRow>
          <ReceiptCol span={6} offset={6} bold align="right">
            {toI18n('TICKET_RECEIPT_SUBTOTAL')}
          </ReceiptCol>
          <ReceiptCol span={6} bold>
            {Numeral(total.hours).format('00')}
            :
            {Numeral(total.minutes).format('00')}
          </ReceiptCol>
          <ReceiptCol span={6} mega>
            {Numeral(+agentFee + +miaFee).format(NUMERAL_MONEY_FORMAT)}
          </ReceiptCol>
        </ReceiptRow>
        <ReceiptRow>
          <ReceiptCol span={6} offset={6} bold align="right">
            {toI18n('TICKET_RECEIPT_PAID')}
          </ReceiptCol>
          <ReceiptCol span={6} bold weight highlight={paidTime.hours || paidTime.minutes}>
            {Numeral(paidTime.hours).format('00')}
            :
            {Numeral(paidTime.minutes).format('00')}
          </ReceiptCol>
          <ReceiptCol span={6} mega weight highlight={+miaPaidFee + +agentPaidFee > 0}>
            {Numeral(+miaPaidFee + +agentPaidFee).format(NUMERAL_MONEY_FORMAT)}
          </ReceiptCol>
        </ReceiptRow>
      </ReceiptWrapper>
    );
  }
}

export default TicketReceipt;
