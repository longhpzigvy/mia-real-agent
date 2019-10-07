import moment from 'moment';
import React from 'react';
import _isEmpty from 'lodash/isEmpty';
import _eq from 'lodash/eq';
import _keyBy from 'lodash/keyBy';
import { Trans } from 'react-i18next';
import {
  ROLES, REPLY_TYPE, TICKET_STATUS, REPLY_TYPE_SORT,
} from '../../common/enums';

const compareMessage = (msgA, msgB) => {
  const { sentAt: sentAtA, type: typeA } = msgA;
  const { sentAt: sentAtB, type: typeB } = msgB;
  const diff = compareDate(sentAtA, sentAtB);
  if (diff !== 0) {
    return diff;
  }
  return REPLY_TYPE_SORT[typeB] - REPLY_TYPE_SORT[typeA];
};

export const combineChat = (replyMessages = []) => {
  const combined = [];
  replyMessages
    .sort(compareMessage);
  replyMessages.forEach((message) => {
    const {
      _id, from, type, params,
      messages = '', sentAt,
    } = message;
    if (type === REPLY_TYPE.TICKET_STATUS
      || type === REPLY_TYPE.USER_ACTION
      || type === REPLY_TYPE.RATING_ACTION
      || type === REPLY_TYPE.WARNING_ACTION
    ) {
      combined.push({
        _id: combined.length, type, contents: [{ _id, messages, sentAt }], from, params, sentAt,
      });
      return;
    }
    if (combined.length > 0) {
      const lastCombined = combined[combined.length - 1];
      const { from: last, contents = [], type: lastType } = lastCombined;
      if (lastType === REPLY_TYPE.TICKET_STATUS || lastType === REPLY_TYPE.USER_ACTION) {
        combined.push({
          _id: combined.length, type, from, contents: [{ _id, messages, sentAt }],
        });
        return;
      }
      if (_eq(last, from)) {
        combined[combined.length - 1] = {
          ...lastCombined,
          contents: contents.concat({ _id, messages, sentAt }),
        };
      } else {
        combined.push({
          _id: combined.length, type, from, contents: [{ _id, messages, sentAt }],
        });
      }
    } else {
      combined.push({
        _id: combined.length, type, from, contents: [{ _id, messages, sentAt }],
      });
    }
  });
  return combined;
};

export function getSkipLimit(pageIndex, sizePerPage) {
  const skip = (pageIndex - 1) * sizePerPage;
  const limit = sizePerPage;
  return { skip, limit };
}

export function compareDate(a, b) {
  return moment(a).diff(moment(b));
}

export function isAgent(role) {
  return role === ROLES.FREELANCER || role === ROLES.DEDICATED;
}

export function isUser(role) {
  return role === ROLES.BUSINESS || role === ROLES.INDIVIDUAL;
}

export function shouldShowSystemMessage(systemMessage, currentConversationId) {
  if (_isEmpty(systemMessage)) {
    return false;
  }
  const { message, conversationId } = systemMessage;
  if (_isEmpty(message) || currentConversationId !== conversationId) {
    return false;
  }
  return true;
}

export const toI18n = key => (
  <Trans i18nKey={key} defaults={`[${key}]`} />
);

const sortTicketHistory = history => (history || [])
  .sort((h1, h2) => new Date(h1.startTime) - new Date(h2.startTime));


export const calculateStatusTime = (history, status) => {
  if (!Array.isArray(history)) return 0;
  const sortedHistory = sortTicketHistory(history) || [];
  const logs = sortedHistory.filter(his => status.includes(his.currentStatus));
  if (logs.length <= 0) return 0;
  const totalTime = logs.reduce(
    (acc, log) => Math.ceil(acc + moment(log.endTime || new Date()).diff(log.startTime)), 0
  );
  return Math.ceil(moment.duration(totalTime, 'millisecond').asMinutes());
};

export const getHourMinutes = (durationInSecondInMinutes) => {
  const hours = Number.parseInt(durationInSecondInMinutes / 60, 10);
  const minutes = durationInSecondInMinutes % 60;

  return {
    hours, minutes,
  };
};

export const getSeconds = durationInMinutes => Number
  .parseInt(durationInMinutes, 10) * 60;

export const flatApplicationForm = (application, mapping) => _keyBy(
  Object.keys(mapping).map((key) => {
    const map = mapping[key];
    const value = application[key];
    return {
      ...map,
      key,
      value,
    };
  }), 'key'
);

export const generateInitValue = (type) => {
  switch (type) {
    case 'slider':
    case 'number':
      return 0;
    case 'select':
    case 'upload':
    case 'list':
      return [];
    case 'checkbox':
      return false;
    case 'text':
      return '';
    default:
      return null;
  }
};

export const calculateChargeTime = (ticket, user) => {
  const {
    processingDate, history,
  } = ticket;
  // Calculate Ticket Time
  const firstOpen = history[0];
  const timeBeforeChat = moment(firstOpen.startTime).diff(
    moment(processingDate), 'minutes'
  );
  const openingTime = timeBeforeChat + calculateStatusTime(history, [TICKET_STATUS.OPEN]);
  const processingTime = calculateStatusTime(history, [TICKET_STATUS.PROCESSING]);
  const { creditTime: userCreditTime } = user;
  // Calculate Used Credit Time
  const remainingOpeningTime = openingTime - userCreditTime;
  let remainingCreditTime = (userCreditTime - openingTime >= 0)
    ? userCreditTime - openingTime : 0;
  const remainingProcessingTime = processingTime - remainingCreditTime;
  if (remainingCreditTime > 0) {
    remainingCreditTime = (remainingCreditTime - processingTime > 0)
      ? remainingCreditTime - processingTime : 0;
  }
  return {
    timeBeforeChat,
    openingTime,
    processingTime,
    remainingOpeningTime,
    remainingProcessingTime,
    userCreditTime,
    remainingCreditTime,
  };
};
