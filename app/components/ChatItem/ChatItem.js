/* eslint-disable react/no-array-index-key */
import React from 'react';
import moment from 'moment';
import { Tooltip, Icon } from 'antd';
import {
  MessageBoxItem, MessageText,
  UserMessage, ProfileImageStyled,
  MessageBoxSystemNotification, LineDivider,
  MessageBoxItemIsTyping, IsTypingWrapper,
  TicketActionStatus, UserAction, TicketActionStatusTitle,
  TicketRatingScore, CommentWrapper, UserLabelWarning,
} from './styles';
import { ROLES, BOT_AVATAR, DEFAULT_USER_AVATAR } from '../../../common/enums';
import { toI18n, isAgent } from '../../utils/func-utils';

const renderTime = (time) => {
  if (moment().diff(time, 'days') === 0) {
    return moment(time).format('hh:mm');
  }
  if (moment().diff(time, 'weeks') === 0) {
    return moment(time).format('dddd hh:mm');
  }
  if (moment().diff(time, 'months') === 0) {
    return moment(time).format('MMMM D hh:mm');
  }
  return moment(time).format('MMMM D hh:mm YYYY');
};


export const userChat = (msgId, contents, isPending = false) => (
  <MessageBoxItem right key={msgId}>
    <MessageText>
      {contents.map(({ _id, messages, sentAt }, index) => (
        <Tooltip key={`${_id}[${index}]`} placement="right" title={renderTime(sentAt)}>
          <UserMessage pending={isPending}>
            {messages}
          </UserMessage>
        </Tooltip>
      ))}
    </MessageText>
  </MessageBoxItem>
);

export const otherChat = (msgId, contents, profile) => (
  <MessageBoxItem left key={msgId}>
    <ProfileImageStyled
      src={profile.avatar || DEFAULT_USER_AVATAR}
    />
    <MessageText>
      {contents.map(({ _id, messages, sentAt }, index) => (
        <Tooltip key={`${_id}[${index}]`} placement="left" title={renderTime(sentAt)}>
          <p>
            {messages}
          </p>
        </Tooltip>
      ))}
    </MessageText>
  </MessageBoxItem>
);

export const botChat = (msgId, contents) => (
  <MessageBoxItem left key={msgId}>
    <ProfileImageStyled
      src={BOT_AVATAR}
    />
    <MessageText>
      {contents.map(({ _id, messages, sentAt }, index) => (
        <Tooltip key={`${_id}[${index}]`} placement="left" title={renderTime(sentAt)}>
          <p>
            {messages}
          </p>
        </Tooltip>
      ))}
    </MessageText>
  </MessageBoxItem>
);

export const otherTyping = (messages, profile = {}) => (
  <MessageBoxItemIsTyping left key="UserTyping">
    <ProfileImageStyled
      src={profile.avatar || DEFAULT_USER_AVATAR}
    />
    <MessageText>
      <p>{messages.trim()}</p>
      <IsTypingWrapper />
    </MessageText>
  </MessageBoxItemIsTyping>
);

export const ticketStatus = (msgId, params, sentAt) => {
  const { status } = params;
  return (
    <MessageBoxSystemNotification key={`status${msgId}`}>
      <LineDivider />
      <Tooltip key={msgId} placement="top" title={renderTime(sentAt)}>
        {toI18n('CONV_MESSAGE_BOX_TICKET_CHANGED_TO')}
        <TicketActionStatus status={status} />
        <TicketActionStatusTitle status={status}>{status}</TicketActionStatusTitle>
      </Tooltip>
      <LineDivider />
    </MessageBoxSystemNotification>
  );
};

export const userAction = (msgId, from, params, sentAt) => {
  const { action } = params;
  let messageOwner = '';
  // eslint-disable-next-line no-underscore-dangle
  const { role, username, application } = from;
  const { nickname } = application || {};
  messageOwner = isAgent(role) ? nickname : username;
  return (
    <MessageBoxSystemNotification key={`status${msgId}`}>
      <LineDivider />
      <Tooltip key={`status${msgId}`} placement="top" title={renderTime(sentAt)}>
        {
          `${messageOwner} `
        }
        {toI18n('CONV_MESSAGE_BOX_USER_IS')}
        {' '}
        <UserAction action={action}>{action}</UserAction>
      </Tooltip>
      <LineDivider />
    </MessageBoxSystemNotification>
  );
};

export const warningAction = (msgId, from, contents, sentAt) => {
  // eslint-disable-next-line no-underscore-dangle
  const { username } = from;
  if (isAgent(from.role)) {
    return (
      <MessageBoxItem left key={msgId}>
        <MessageText>
          {
            contents.map(({ _id, messages }) => (
              <Tooltip key={msgId} placement="left" title={renderTime(sentAt)}>
                <UserLabelWarning>
                  {username}
                </UserLabelWarning>
                <p key={_id}>
                  {messages}
                </p>
              </Tooltip>
            ))
          }
        </MessageText>
      </MessageBoxItem>
    );
  }
  return (
    <MessageBoxItem right key={msgId}>
      <MessageText>
        {contents.map(({ _id, messages }) => (
          <Tooltip key={msgId} placement="right" title={renderTime(sentAt)}>
            <UserLabelWarning user>
              {username}
            </UserLabelWarning>
            <UserMessage key={_id}>
              {messages}
            </UserMessage>
          </Tooltip>
        ))
        }
      </MessageText>
    </MessageBoxItem>
  );
};

export const ticketRating = (msgId, from, params, sentAt) => {
  const { score, comment } = params;
  const { role, profile = {} } = from;
  const { firstName, lastName, company = 'N/A' } = profile;
  let messageOwner = '';
  switch (role) {
    case ROLES.INDIVIDUAL:
      messageOwner = `${firstName} ${lastName}`;
      break;
    default:
      messageOwner = company;
      break;
  }
  return (
    <MessageBoxSystemNotification key={`status${msgId}`}>
      <LineDivider />
      <Tooltip key={`status${msgId}`} placement="top" title={renderTime(sentAt)}>
        {
          `${messageOwner} `
        }
        {toI18n('CONV_MESSAGE_BOX_TICKET_RATING')}
        <TicketRatingScore>
          {Array(...Array(Math.floor(score))).map(() => (
            <Icon type="star" theme="filled" />
          ))}
        </TicketRatingScore>
        {toI18n('CONV_MESSAGE_BOX_TICKET_RATING_COMMENT')}
        {' '}
        <CommentWrapper>
          {comment}
        </CommentWrapper>
      </Tooltip>
      <LineDivider />
    </MessageBoxSystemNotification>
  );
};
