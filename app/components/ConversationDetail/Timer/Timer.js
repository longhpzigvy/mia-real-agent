import React from 'react';
import moment from 'moment';
import { shape, arrayOf, string } from 'prop-types';
import Numeral from 'numeral';
import { Translation } from 'react-i18next';
import {
  TimerContainer, TimerStyled,
  TimerTitle, TimerValue,
} from './Timer.styled';
import { TICKET_STATUS } from '../../../../common/enums';
import { getHourMinutes, calculateStatusTime } from '../../../utils/func-utils';

const TIME_TO_FORCE_UPDATE = 60000;

class TimerWrapper extends React.PureComponent {
  static propTypes = {
    history: arrayOf(shape()),
    processingDate: string,
  }

  static defaultProps = {
    history: [],
  }

  state = {}

  interval = null;

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
    const { history, processingDate } = this.props;
    const firstOpen = history[0] || {};
    const timeBeforeChat = moment(firstOpen.startTime).diff(
      moment(processingDate), 'minutes'
    );
    const openingTime = getHourMinutes(calculateStatusTime(history, [TICKET_STATUS.OPEN]));
    const pendingTime = getHourMinutes(calculateStatusTime(history, [TICKET_STATUS.PENDING]));
    const processingTime = getHourMinutes(calculateStatusTime(history, [TICKET_STATUS.PROCESSING]));
    const billableTime = processingDate
      ? getHourMinutes(
        timeBeforeChat + calculateStatusTime(
          history, [TICKET_STATUS.OPEN, TICKET_STATUS.PROCESSING]
        )
      )
      : getHourMinutes(0);
    const holdTime = getHourMinutes(calculateStatusTime(history, [TICKET_STATUS.IDLE, TICKET_STATUS.OFFLINE]));
    const totalTime = {
      hours: openingTime.hours + pendingTime.hours + processingTime.hours + holdTime.hours,
      minutes: openingTime.minutes + pendingTime.minutes + processingTime.minutes + holdTime.minutes,
    };


    return (
      <Translation>
        {
          t => (
            <TimerContainer>
              <TimerStyled span={6}>
                <TimerTitle>
                  {t('CONV_MESSAGE_BOX_TIMER_TOTAL')}
                </TimerTitle>
                <TimerValue>
                  <span>
                    {Numeral(totalTime.hours).format('00')}
                    :
                    {Numeral(totalTime.minutes).format('00')}
                  </span>
                </TimerValue>
              </TimerStyled>
              <TimerStyled span={6}>
                <TimerTitle>
                  {t('CONV_MESSAGE_BOX_TIMER_BILLABLE')}
                </TimerTitle>
                <TimerValue>
                  <span>
                    {Numeral(billableTime.hours).format('00')}
                    :
                    {Numeral(billableTime.minutes).format('00')}
                  </span>
                </TimerValue>
              </TimerStyled>
              <TimerStyled span={6}>
                <TimerTitle>
                  {t('CONV_MESSAGE_BOX_TIMER_HOLD')}
                </TimerTitle>
                <TimerValue>
                  <span>
                    {Numeral(holdTime.hours).format('00')}
                    :
                    {Numeral(holdTime.minutes).format('00')}
                  </span>
                </TimerValue>
              </TimerStyled>
              <TimerStyled span={6}>
                <TimerTitle>
                  {t('CONV_MESSAGE_BOX_TIMER_PENDING')}
                </TimerTitle>
                <TimerValue>
                  <span>
                    {Numeral(pendingTime.hours).format('00')}
                    :
                    {Numeral(pendingTime.minutes).format('00')}
                  </span>
                </TimerValue>
              </TimerStyled>
            </TimerContainer>
          )}
      </Translation>
    );
  }
}

export default TimerWrapper;
