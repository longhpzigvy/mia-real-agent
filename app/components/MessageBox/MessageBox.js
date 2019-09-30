import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import {
  Form, Icon, Tooltip,
} from 'antd';
import _isEmpty from 'lodash/isEmpty';
import { Translation } from 'react-i18next';
import history from 'utils/history';
import { Formik } from 'formik';
import { Return } from 'components/Generals/General.styled';
import CreatTicketFormContainer from 'containers/Chatbot/CreateTicket';
import ShadowScrollbars from 'components/Scrollbar';
import {
  MessageBoxWrapper,
  MessageBoxContent,
  MessageBoxItem,
  ConversationHeaderTitle,
  MessageInputWrapper,
  MessageActionWrapper,
  MessageInput,
  MessageEmpty,
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
  MessageBoxBlock,
} from './styles';
import LoadingSpin from '../Loading';
import ConversationDetail from '../ConversationDetail/ConversationDetail';
import { REPLY_TYPE, CLOSED_TICKET_STATUSES, TICKET_STATUS } from '../../../common/enums';
import FormInput from '../FormInput/FormInput';
import {
  shouldShowSystemMessage, isAgent, toI18n, combineChat,
} from '../../utils/func-utils';
import { ProfileImageStyled } from '../TopNavBar/TopNavBar.styled';
import {
  userChat, otherChat, otherTyping, botChat, ticketStatus, userAction, ticketRating,
} from '../ChatItem';
import RichEditor from '../FormInput/RichEditor/RichEditor';
import { clearEditorContent } from '../../api/utils';
import { ButtonPrimary, ButtonDefault } from '../../stylesheets/Button.style';
import CreateFeedbackForm from '../../containers/CreateFeedbackForm';
import CloseTicketModal from './CloseTicketModal';

const scrollStyle = {
  flex: 'auto',
  width: '100%',
};

const initialValues = {
  content: EditorState.createEmpty(),
};

const rating = {
  score: 1,
  comment: '',
};

export default class MessageBox extends Component {
  messagesEndRef = React.createRef();

  static propTypes = {
    cannedResponses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    userId: PropTypes.string.isRequired,
    conversationId: PropTypes.string,
    systemMessage: PropTypes.object,
    currentConversation: PropTypes.object,
    currentTicket: PropTypes.object,
    isFetchingReplies: PropTypes.bool,
    solutionFound: PropTypes.bool,
    isFindingAgent: PropTypes.bool,
    replyMessages: PropTypes.arrayOf(PropTypes.shape()),
    sendingMessages: PropTypes.arrayOf(PropTypes.shape()),
    sendingMessageErrors: PropTypes.objectOf(PropTypes.any),
    otherUserTyping: PropTypes.object,
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
    replyMessages: [],
    conversationId: '',
    sendingMessages: [],
    // sendingMessageErrors: {},
  }

  state = {
    content: EditorState.createEmpty(),
    feedbackFormIsOpen: false,
    closeTicketModalIsOpen: false,
    isOpenCreateModal: false,
    otherProfile: null,
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
    this.scrollChatToBottom();
    const {
      conversationId,
      currentConversation, setCurrentTicket, joinConversation, leftConversation,
    } = this.props;
    const { conversationId: prevConversationId } = prevProps;
    if (conversationId !== prevConversationId) {
      joinConversation(conversationId);
      if (prevConversationId) {
        leftConversation(prevConversationId);
      }
    }
    if (!_isEmpty(currentConversation)) {
      const { ticketId: prevTicketId } = prevProps.currentConversation;
      const { ticketId } = currentConversation;
      if (ticketId !== prevTicketId) {
        setCurrentTicket(ticketId);
      }
    }
  }

  renderFindAgentForSolution = () => (
    <Translation>
      {
        t => (
          <MessageBoxItem left key="solution">
            <ProfileImageStyled
              src="/assets/images/mia-avatar.jpg"
              onClick={this.onToggleUserInfo}
            />
            <FindAgentWrapper>
              <p key="solution">
                {t('CONV_MESSAGE_BOX_NOT_SATISFY')}
              </p>
              <FindAgentButton
                key="button"
                type="primary"
                onClick={this.handleFindAgent}
              >
                <Icon type="search" />
                {t('CONV_MESSAGE_BOX_FIND_AGENT')}
              </FindAgentButton>
            </FindAgentWrapper>
          </MessageBoxItem>
        )
      }
    </Translation>
  )

  renderOtherUserMessageContent = (msgId, contents, from) => otherChat(msgId, contents, from.profile);

  renderOtherUserTypingContent = () => {
    const { otherProfile } = this.state;
    const { otherUserTyping, conversationId } = this.props;
    const { conversationId: _id, messages = '' } = otherUserTyping || {};
    if (!_isEmpty(otherUserTyping)
      && _id === conversationId
      && !_isEmpty(messages.trim())
    ) {
      return otherTyping(messages, otherProfile);
    }
    return false;
  }

  renderMessageContent = () => {
    const { otherProfile } = this.state;
    const {
      replyMessages, userId, userRole,
    } = this.props;
    const refinedMessages = combineChat(replyMessages);
    return [refinedMessages.map(({
      from, _id: msgId, contents, type, params, sentAt,
    }) => {
      switch (type) {
        case REPLY_TYPE.TICKET_STATUS:
          return ticketStatus(msgId, params, sentAt);
        case REPLY_TYPE.USER_ACTION:
          return userAction(msgId, from, params, sentAt);
        case REPLY_TYPE.BOT_RESPONSE:
          return botChat(msgId, contents);
        case REPLY_TYPE.RATING_ACTION:
          return ticketRating(msgId, from, params, sentAt);
        case REPLY_TYPE.USER_NORMAL:
          if (from._id === userId) {
            return userChat(msgId, contents, false, isAgent(userRole));
          }
          if (!otherProfile) {
            this.setState({
              otherProfile: from.profile,
            });
          }
          return this.renderOtherUserMessageContent(msgId, contents, from);
        default: return null;
      }
    }),
    this.renderOtherUserTypingContent(),
    ];
  }

  renderPendingMessageContent = () => {
    const { sendingMessages } = this.props;
    if (!sendingMessages || !sendingMessages.length) return null;

    return combineChat(sendingMessages).map(({ id: msgId, contents }) => userChat(msgId, contents, true));
  }

  renderGroupAction = () => (
    <MessageActionWrapper>
      <InputAction className="mia-gallery" htmlFor="file-upload" />
      <InputAction className="mia-folder" htmlFor="file-upload" />
      <InputAction className="mia-camera" />
      <InputAction className="mia-happiness" />
      {/* <InputUpload type="file" id="file-upload" /> */}
    </MessageActionWrapper>
  );

  handleChatSubmit = () => {
    const {
      sendReplyMessage, conversationId, userTyping, userRole,
    } = this.props;
    const { content } = this.state;
    const trimmedContent = content.getCurrentContent().getPlainText().trim();
    if (trimmedContent) {
      sendReplyMessage(conversationId, trimmedContent);
      if (!isAgent(userRole)) {
        userTyping(conversationId, '');
      }
      this.formik.getFormikContext().resetForm();
      this.setState({
        content: clearEditorContent(content),
      });
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
    this.setState({
      content,
    });
    this.handleTyping(content);
  }

  renderMessageInput = () => {
    const { cannedResponses } = this.props;
    const { content } = this.state;
    return (
      <Formik
        ref={(formik) => { this.formik = formik; }}
        initialValues={initialValues}
        onSubmit={this.handleChatSubmit}
      >
        {({ handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
          >
            <MessageInputWrapper>
              <RichEditor
                mentions={cannedResponses.map(({ shortcut: title, content: name }) => ({
                  title,
                  name,
                }))}
                onChange={this.handleChangeContent}
                editorState={content}
                handleReturn={handleSubmit}
              />
              {this.renderGroupAction()}
              <InputAction onClick={handleSubmit} className="mia-enter" />
            </MessageInputWrapper>
          </Form>
        )}
      </Formik>
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

  scrollChatToBottom() {
    const { current } = this.messagesEndRef;
    if (current) {
      current.scrollIntoView({ behavior: 'smooth' });
    }
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
          initialValues={rating}
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

  renderMessageBoxContent = () => {
    const {
      otherUserTyping,
      replyMessages, currentTicket, systemMessage,
      conversationId, solutionFound, userRole,
    } = this.props;
    const hasChatData = !_isEmpty(replyMessages)
      || shouldShowSystemMessage(systemMessage, conversationId)
      || !_isEmpty(otherUserTyping);
    const { assignee, status, rating } = currentTicket || {};
    return (
      <>
        <ShadowScrollbars
          autoHide
          style={scrollStyle}
        >
          {!hasChatData
            ? <MessageEmpty>{toI18n('CONV_MESSAGE_BOX_NO_CHAT_DATA')}</MessageEmpty>
            : this.renderMessageContent()
          }
          {solutionFound
            && status === TICKET_STATUS.OPEN
            && !isAgent(userRole)
            && _isEmpty(assignee)
            && this.renderFindAgentForSolution()}
          {this.renderPendingMessageContent()}
          <MessageBoxBlock />
          {CLOSED_TICKET_STATUSES.includes(status) && !rating &&
            [
              (<MessageBoxBlock />),
              (<MessageBoxBlock />),
              (<MessageBoxBlock />),
            ]
          }
          <div ref={this.messagesEndRef} />
        </ShadowScrollbars>
        <MessageInputContent>
          {this.renderMessageBoxFooter()}
        </MessageInputContent>
      </>
    );
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
            {this.renderMessageBoxContent()}
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
        />
        <CreatTicketFormContainer
          isOpen={isOpenCreateModal}
          handleCancel={() => this.handleToggleCreateModal(false)}
        />
      </LoadingSpin>
    );
  }
}
