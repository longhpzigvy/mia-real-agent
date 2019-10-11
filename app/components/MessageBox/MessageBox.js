import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Icon, Tooltip,
} from 'antd';
import _isEmpty from 'lodash/isEmpty';
import history from 'utils/history';
import { Formik } from 'formik';
import { Return } from 'components/Generals/General.styled';
import CreatTicketFormContainer from 'containers/Chatbot/CreateTicket';
import {
  MessageBoxWrapper,
  MessageBoxContent,
  MessageBoxItem,
  ConversationHeaderTitle,
  MessageInput,
  InputAction,
  ConversationTitle,
  RatingWrapper,
  RatingContent,
  CommentInputWrapper,
  TicketStatus,
  MessageBoxSystemNotification,
  FindAgentButton,
  FindAgentWrapper,
  ConversationHeaderWrapper,
  ConversationHeaderTitleBlock,
  MessageInputContent,
  ConversationActionWrapper,
} from './styles';
import LoadingSpin from '../Loading';
import ConversationDetail from '../ConversationDetail/ConversationDetail';
import {
  CLOSED_TICKET_STATUSES,
  BOT_AVATAR,
} from '../../../common/enums';
import FormInput from '../FormInput/FormInput';
import {
  isAgent, toI18n,
} from '../../utils/func-utils';

import { ButtonPrimary, ButtonDefault } from '../../stylesheets/Button.style';
import CreateFeedbackForm from '../../containers/CreateFeedbackForm';
import CloseTicketModal from './CloseTicketModal';
import { ProfileImageStyled } from '../ChatItem/styles';
import MessageInputForm from './MessageInputForm';
import MessageListContainer from '../../containers/MessageBox/MessageList';

const initialRating = {
  score: 1,
  comment: '',
};

export default class MessageBox extends Component {
  static propTypes = {
    cannedResponses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    conversationId: PropTypes.string,
    currentConversation: PropTypes.object,
    currentTicket: PropTypes.object,
    isFetchingReplies: PropTypes.bool,
    isFindingAgent: PropTypes.bool,
    fetchCannedResponseForUser: PropTypes.func.isRequired,
    findAgentRequest: PropTypes.func.isRequired,
    sendReplyMessage: PropTypes.func.isRequired,
    setCurrentTicket: PropTypes.func.isRequired,
    joinConversation: PropTypes.func.isRequired,
    leftConversation: PropTypes.func.isRequired,
    closeTicket: PropTypes.func.isRequired,
    userTyping: PropTypes.func.isRequired,

    submitRating: PropTypes.func.isRequired,
    userRole: PropTypes.string.isRequired,
  }

  static defaultProps = {
    currentConversation: {},
    currentTicket: {},
    isFetchingReplies: false,
    isFindingAgent: false,
    conversationId: '',
  }

  state = {
    feedbackFormIsOpen: false,
    closeTicketModalIsOpen: false,
    isOpenCreateModal: false,
  }

  toggleFeedbackForm = (toggle) => {
    this.setState({
      feedbackFormIsOpen: toggle,
    });
  }

  componentDidMount() {
    const { fetchCannedResponseForUser } = this.props;
    fetchCannedResponseForUser({});
  }

  componentDidUpdate = (prevProps) => {
    const {
      conversationId,
      currentConversation, setCurrentTicket, joinConversation, leftConversation,
    } = this.props;
    const { conversationId: prevConversationId } = prevProps;
    if (!_isEmpty(currentConversation)) {
      const { ticketId: prevTicketId } = prevProps.currentConversation;
      const { ticketId } = currentConversation;
      if (ticketId !== prevTicketId) {
        setCurrentTicket(ticketId);
        return;
      }
    }
    if (conversationId !== prevConversationId) {
      joinConversation(conversationId);
      if (prevConversationId) {
        leftConversation(prevConversationId);
      }
    }
  }

  renderFindAgentForSolution = () => (
    <MessageBoxItem left key="solution">
      <ProfileImageStyled
        src={BOT_AVATAR}
      />
      <FindAgentWrapper>
        <p key="solution">
          {toI18n('CONV_MESSAGE_BOX_NOT_SATISFY')}
        </p>
        <FindAgentButton
          key="button"
          type="primary"
          onClick={this.handleFindAgent}
        >
          <Icon type="search" />
          {toI18n('CONV_MESSAGE_BOX_FIND_AGENT')}
        </FindAgentButton>
      </FindAgentWrapper>
    </MessageBoxItem>
  )

  handleChatSubmit = (content) => {
    const {
      sendReplyMessage, conversationId, userTyping, userRole,
    } = this.props;
    sendReplyMessage(conversationId, content);
    if (!isAgent(userRole)) {
      userTyping(conversationId, '');
    }
  }

  handleFindAgent = () => {
    const { findAgentRequest, conversationId } = this.props;

    findAgentRequest(conversationId);
  }

  handleTyping = (content) => {
    const {
      userTyping, conversationId, userRole, currentTicket,
    } = this.props;
    const { assignee } = currentTicket;
    if (!isAgent(userRole) && assignee) {
      const textValue = content.getCurrentContent().getPlainText();
      userTyping(conversationId, textValue);
    }
  }

  handleChangeContent = (content) => {
    this.handleTyping(content);
  }

  renderMessageInput = () => {
    const { cannedResponses } = this.props;
    return (
      <MessageInputForm
        cannedResponses={cannedResponses}
        onSubmit={this.handleChatSubmit}
        onChangeContent={this.handleChangeContent}
      />
    );
  }

  goToDashboard = () => {
    history.push('/dashboard/ticket/1');
  }

  renderMessageHeader = () => {
    const { currentTicket, userRole } = this.props;
    const { title, status } = currentTicket || {};
    return (
      <ConversationHeaderTitle>
        <ConversationTitle>
          <ConversationHeaderWrapper>
            <Return onClick={this.goToDashboard}>
              <Icon type="left" />
              <span>
                {toI18n('MENU')}
              </span>
            </Return>
            {!isAgent(userRole) && (
              <Tooltip title="Create ticket" onClick={() => this.handleToggleCreateModal(true)}>
                <Icon type="copy" />
                <span className="create-ticket">
                  {toI18n('CREATE')}
                  Ticket
                </span>
              </Tooltip>
            )}
          </ConversationHeaderWrapper>
          <ConversationHeaderTitleBlock />
          <TicketStatus status={status} />
          <span>{title}</span>
          <ConversationActionWrapper>
            <ButtonDefault
              type="primary"
              onClick={() => this.toggleFeedbackForm(true)}
            >
              <Icon type="form" />
              {toI18n('CONV_HEADER_FEEDBACK')}
            </ButtonDefault>
            {!CLOSED_TICKET_STATUSES.includes(status) && (
              <ButtonPrimary
                type="primary"
                onClick={() => this.handleToggleCloseModal(true)}
              >
                {toI18n('CONV_HEADER_CLOSE_TICKET')}
              </ButtonPrimary>
            )
            }
          </ConversationActionWrapper>
        </ConversationTitle>
      </ConversationHeaderTitle>
    );
  }


  handleSubmitRating = (values) => {
    const { submitRating, currentTicket } = this.props;
    const { _id } = currentTicket;
    submitRating(_id, values);
  }

  renderRating = () => (
    <RatingWrapper>
      <RatingContent>
        <h2>
          {toI18n('CONV_MESSAGE_BOX_RATE_YOUR_EXPERIENCE')}
        </h2>
        <Formik
          ref={(formik) => { this.ratingFormik = formik; }}
          initialValues={initialRating}
          onSubmit={this.handleSubmitRating}
        >
          {({ handleSubmit }) => (
            <Form
              onSubmit={handleSubmit}
              onChange={this.handleChangeValues}
            >
              <FormInput type="rate" name="score" />
              <CommentInputWrapper>
                <MessageInput type="text" name="comment" placeholder="Type comment ..." autoComplete="off" />
                <InputAction onClick={handleSubmit} className="mia-enter" />
              </CommentInputWrapper>
            </Form>
          )}
        </Formik>
      </RatingContent>
    </RatingWrapper>
  );

  renderMessageBoxFooter = () => {
    const {
      currentTicket, userRole,
    } = this.props;
    const { status, rating, assignee } = currentTicket || {};
    if (CLOSED_TICKET_STATUSES.includes(status)) {
      if (!isAgent(userRole) && !rating && assignee) {
        return this.renderRating();
      }
      return (
        <MessageBoxSystemNotification>
          {toI18n('CONV_MESSAGE_BOX_TICKET_CLOSED')}
        </MessageBoxSystemNotification>
      );
    }
    return this.renderMessageInput();
  }

  handleCloseTicket = ({ status, unsolvedReason }) => {
    const { closeTicket, currentTicket } = this.props;
    const { _id } = currentTicket || {};
    if (_id) {
      closeTicket(_id, status, unsolvedReason);
    }
  }

  handleToggleCloseModal = (isOpen) => {
    this.setState({
      closeTicketModalIsOpen: isOpen,
    });
  }

  handleToggleCreateModal = (isOpen) => {
    this.setState({
      isOpenCreateModal: isOpen,
    });
  }

  render() {
    const { feedbackFormIsOpen, closeTicketModalIsOpen, isOpenCreateModal } = this.state;
    const {
      isFetchingReplies, isFindingAgent, currentTicket, userRole,
    } = this.props;
    const { _id } = currentTicket || {};
    return (
      <LoadingSpin loading={isFetchingReplies || isFindingAgent}>
        {this.renderMessageHeader()}
        <MessageBoxWrapper>
          <MessageBoxContent>
            <MessageListContainer />
            <MessageInputContent>
              {this.renderMessageBoxFooter()}
            </MessageInputContent>
          </MessageBoxContent>
          <ConversationDetail ticket={currentTicket} userRole={userRole} />
          <CreateFeedbackForm
            ticketId={_id}
            isOpen={feedbackFormIsOpen}
            handleCancel={() => this.toggleFeedbackForm(false)}
          />
        </MessageBoxWrapper>
        <CloseTicketModal
          handleSubmitCloseTicket={this.handleCloseTicket}
          handleCloseModal={() => this.handleToggleCloseModal(false)}
          isOpen={closeTicketModalIsOpen}
          isAgent={isAgent(userRole)}
        />
        <CreatTicketFormContainer
          isOpen={isOpenCreateModal}
          handleCancel={() => this.handleToggleCreateModal(false)}
        />
      </LoadingSpin>
    );
  }
}
