import React, { Component } from 'react';
import moment from 'moment';
import {
  Upload, Icon, Tooltip, Row,
} from 'antd';
import {
  any, string, func, shape,
} from 'prop-types';
import {
  ReviewInputValue, ReviewInputWrapper,
  ReviewInputTitle, ReviewInputAction, ReviewInputValueWrapper,
  CommentWrapper, CommentInput, CommentAction,
  CommentDisplayWrapper, ListFieldValue, ListFieldLabel,
  ListItemWrapper,
} from './styles';
import { ButtonPrimary } from '../../../stylesheets/Button.style';
import { DATE_TIME_FORMAT } from '../../../utils/constants';
import { toI18n } from '../../../utils/func-utils';

const CommentIcon = () => (
  <svg width="2em" height="2em" fill="currentColor" viewBox="0 0 1024 1024">
    <g>
      <g id="chat">
        <g>
          <path
            d="M554.625,0H57.375C25.685,0,0,25.685,0,57.375v344.25C0,433.315,25.685,459,57.375,459h76.5v153L382.5,459h172.125
          c31.69,0,57.375-25.685,57.375-57.375V57.375C612,25.685,586.315,0,554.625,0z M535.5,382.5H363.375l-153,95.625L191.25,382.5
          H76.5v-306h459V382.5z"
          />
        </g>
      </g>
    </g>
  </svg>
);

class ReviewInput extends Component {
  state = {
    isRequest: false,
    inputComment: '',
    comment: '',
  }

  handleToggleRequest = (isRequest) => {
    this.setState({ isRequest });
  }

  static propTypes = {
    label: shape().isRequired,
    name: string.isRequired,
    type: string.isRequired,
    value: any,
    displayFields: shape(),
    onAdd: func,
    onRemove: func,
  }

  renderUpload = () => {
    const { value } = this.props;
    const { isRequest, comment } = this.state;
    const fileList = value.map((link, index) => {
      const path = link.split('/');
      const fileName = path[path.length - 1];
      return {
        uid: index,
        name: fileName,
        status: 'done',
        url: link,
        thumbUrl: link,
      };
    });
    return (
      <ReviewInputValue isRequest={isRequest || comment} isUpload>
        <div>
          <Upload
            disabled
            listType="picture-card"
            defaultFileList={fileList}
          />
        </div>
      </ReviewInputValue>
    );
  }

  renderItemValue = (type, value) => {
    switch (type) {
      case 'upload': {
        const fileList = value.map((link, index) => {
          const path = link.split('/');
          const fileName = path[path.length - 1];
          return {
            uid: index,
            name: fileName,
            status: 'done',
            url: link,
            thumbUrl: link,
          };
        });
        return (
          <Upload
            disabled
            listType="picture-card"
            defaultFileList={fileList}
          />
        );
      }
      case 'date':
        return moment(value).format(DATE_TIME_FORMAT.DATE);
      case 'text': {
        const result = value instanceof Array ? value.join(', ') : value;
        return result;
      }
      default: return value;
    }
  }

  renderListItem = (value) => {
    const { displayFields } = this.props;
    const keys = Object.keys(value).filter(key => displayFields[key]);
    return (
      <ListItemWrapper>
        {keys.map((key) => {
          const {
            label, tooltip, skip, replace, type,
          } = displayFields[key];
          const result = this.renderItemValue(type, value[key]);
          return (
            <Row mutter={32}>
              <Tooltip title={value[tooltip]}>
                <ListFieldLabel>
                  {label}
                </ListFieldLabel>
                <ListFieldValue>
                  {value[skip] ? replace : result}
                </ListFieldValue>
              </Tooltip>
            </Row>
          );
        })}
      </ListItemWrapper>
    );
  }

  renderListObject = () => {
    const { value } = this.props;
    const { isRequest, comment } = this.state;

    return (
      <ReviewInputValue isRequest={isRequest || comment} isList>
        {value.map(this.renderListItem)}
      </ReviewInputValue>
    );
  }

  renderText = () => {
    const { value } = this.props;
    const { isRequest, comment } = this.state;
    const result = value instanceof Array ? value.join(', ') : value;
    return (
      <ReviewInputValue isRequest={isRequest || comment}>
        <div>
          {result}
        </div>
      </ReviewInputValue>
    );
  }

  handleSubmitComment = () => {
    const { inputComment = '' } = this.state;
    this.setState({
      comment: inputComment.trim(),
      inputComment: '',
      isRequest: false,
    });
    const { onAdd, name } = this.props;
    if (onAdd) {
      onAdd({
        key: name,
        value: inputComment.trim(),
      });
    }
  }

  handelRemoveComment = () => {
    this.setState({
      comment: '',
      isRequest: false,
    });
    const { onRemove, name } = this.props;
    if (onRemove) {
      onRemove(name);
    }
  }

  renderFieldHasComment = () => {
    const { comment, isRequest } = this.state;
    const { label } = this.props;
    return (
      <ReviewInputWrapper isRequest={isRequest || comment}>
        <ReviewInputTitle>{label}</ReviewInputTitle>
        <ReviewInputValueWrapper>
          <div>
            {this.selectInputType()}
            <ReviewInputAction>
              <Icon className="review-input-action" type="delete" theme="filled" onClick={this.handelRemoveComment} />
            </ReviewInputAction>
          </div>
          <div>
            <CommentDisplayWrapper>
              <Icon component={CommentIcon} />
              {comment}
            </CommentDisplayWrapper>
          </div>
        </ReviewInputValueWrapper>
      </ReviewInputWrapper>
    );
  }

  selectInputType = () => {
    const { type } = this.props;
    switch (type) {
      case 'upload': return this.renderUpload();
      case 'list': return this.renderListObject();
      case 'text':
      default:
        return this.renderText();
    }
  }

  handleEnterComment = (e) => {
    this.setState({
      inputComment: e.target.value,
    });
  }

  render() {
    const { isRequest, comment, inputComment } = this.state;
    const { label } = this.props;
    if (comment) {
      return this.renderFieldHasComment();
    }
    if (isRequest) {
      return (
        <ReviewInputWrapper isRequest={isRequest || comment} isCommenting>
          <ReviewInputTitle>{label}</ReviewInputTitle>
          <ReviewInputValueWrapper>
            <div>
              {this.selectInputType()}
              <CommentAction>
                <ButtonPrimary onClick={this.handleSubmitComment}>
                  {toI18n('FORM_SAVE')}
                </ButtonPrimary>
                <Icon className="review-input-action" type="close" onClick={() => this.handleToggleRequest(false)} />
              </CommentAction>
            </div>
            <CommentWrapper>
              <CommentInput
                autosize={{ minRow: 1, maxRows: 3 }}
                onPressEnter={this.handleSubmitComment}
                value={inputComment}
                onChange={this.handleEnterComment}
                placeholder="Comment..."
                autoFocus
              />
            </CommentWrapper>
          </ReviewInputValueWrapper>
        </ReviewInputWrapper>
      );
    }
    return (
      <ReviewInputWrapper isRequest={isRequest || comment}>
        <ReviewInputTitle>{label}</ReviewInputTitle>
        <ReviewInputValueWrapper>
          <div>
            {this.selectInputType()}
            <ReviewInputAction>
              <Icon className="comment-icon" component={CommentIcon} onClick={() => this.handleToggleRequest(true)} />
            </ReviewInputAction>
          </div>
        </ReviewInputValueWrapper>
      </ReviewInputWrapper>
    );
  }
}

export default ReviewInput;
