import React from 'react';
import { shape } from 'prop-types';
import Numeral from 'numeral';
import { Divider } from 'antd';
import moment from 'moment';
import {
  ReceiptWrapper, ReceiptRow, ReceiptCol,
} from './styled';
import { getHourMinutes, toI18n, calculateStatusTime } from '../../utils/func-utils';
import { NUMERAL_MONEY_FORMAT } from '../../utils/constants';
import { TICKET_STATUS } from '../../../common/enums';

const TIME_TO_FORCE_UPDATE = 60000;

class TicketReceipt extends React.PureComponent {
  static propTypes = {
    ticket: shape().isRequired,
    user: shape().isRequired,
  }

  componentDidMount() {
    const initTimeOut = TIME_TO_FORCE_UPDATE - moment().diff(moment().startOf('minute'));
    setTimeout(() => {
      this.interval = setInterval(() => {
        this.forceUpdate();
      }, TIME_TO_FORCE_UPDATE);
    }, initTimeOut);
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { user, ticket } = this.props;
    const {
      processingDate, history, assignee,
    } = ticket;
    if (!processingDate) {
      return true;
    }
    const { credit } = user;
    const { billingRate } = assignee.application;
    const processingTime = calculateStatusTime(history, [TICKET_STATUS.PROCESSING]);
    const processing = getHourMinutes(processingTime);
    const agentFee = Number(billingRate * processingTime / 60).toFixed(2);
    return (
      <ReceiptWrapper>
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
            {toI18n('TICKET_RECEIPT_AGENT_FEE')}
            {
              `: ${Numeral(processing.hours).format('00')}:${Numeral(processing.minutes).format('00')}
                 * ${Numeral(billingRate).format(NUMERAL_MONEY_FORMAT)}`
            }
          </ReceiptCol>
          <ReceiptCol span={8} hightlight mega>
            {Numeral(agentFee).format(NUMERAL_MONEY_FORMAT)}
          </ReceiptCol>
        </ReceiptRow>
        <ReceiptRow>
          <ReceiptCol span={16} bold>
            {toI18n('TICKET_RECEIPT_AGENT_CREDIT')}
          </ReceiptCol>
          <ReceiptCol span={8} mega>
            {Numeral(credit + +agentFee).format(NUMERAL_MONEY_FORMAT)}
          </ReceiptCol>
        </ReceiptRow>
        <Divider />
      </ReceiptWrapper>
    );
  }
}

export default TicketReceipt;
