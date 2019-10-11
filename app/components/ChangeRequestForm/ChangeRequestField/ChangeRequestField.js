import React, { Component } from 'react';
import {
  string, shape, any, func,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {
  Icon, Row, Tooltip, Col,
} from 'antd';
import FormInput from '../../FormInput/FormInput';
import {
  ReviewInputWrapper, ReviewInputTitle,
  ReviewInputValueWrapper,
  ReviewInputValue, ListItemWrapper, ListFieldLabel,
  ListFieldValue, ChangeInputWrapper, ListItemActionGroup, CommentWrapper,
} from './styles';
import { DATE_TIME_FORMAT } from '../../../utils/constants';
import { ButtonDefault } from '../../../stylesheets/Button.style';
import ChangeRequestModal from '../ChangeRequestModal/ChangeRequestModal';
import UploadInput from '../../FormInput/Upload';
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

// eslint-disable-next-line react/prefer-stateless-function
class ChangeRequestField extends Component {
  state = {
    isAddListItemModalOpen: false,
    selectedIndex: null,
    list: [],
  }

  static propTypes = {
    name: string.isRequired,
    type: string.isRequired,
    comment: string.isRequired,
    value: any.isRequired,
    label: shape(),
    additional: shape(),
    displayFields: shape(),
    schema: shape(),
    setFieldValue: func.isRequired,
  }

  renderUpload = () => {
    const { value, comment } = this.props;
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
      <Tooltip
        title={(
          <span>
            <Icon component={CommentIcon} />
            {comment}
          </span>
        )}
      >
        <ReviewInputValue isUpload>
          <div>
            <UploadInput
              disabled
              listType="picture-card"
              previewFile={null}
              field={{ name: 'upload' }}
              form={{ values: { upload: fileList } }}
            />
            <Icon component={CommentIcon} />
          </div>
        </ReviewInputValue>
      </Tooltip>
    );
  }

  renderItemValue = (type, value) => {
    switch (type) {
      case 'upload': {
        const fileList = value.map((link, index) => {
          if (link instanceof Object) {
            return {
              ...link,
              url: link.thumbUrl,
            };
          }
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
          <UploadInput
            disabled
            listType="picture-card"
            previewFile={null}
            field={{ name: 'upload' }}
            form={{ values: { upload: fileList } }}
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

  renderListItem = (value, index) => {
    const { additional } = this.props;
    const { displayFields } = additional;
    const keys = Object.keys(value).filter(key => displayFields[key]);
    return (
      <ListItemWrapper key={index}>
        <Row mutter={32}>
          <Col span={21}>
            {keys.map((key) => {
              const {
                label, tooltip, skip, replace, type,
              } = displayFields[key];
              const result = this.renderItemValue(type, value[key]);
              return (
                // eslint-disable-next-line react/no-array-index-key
                <Row mutter={32} key={key}>
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
          </Col>
        </Row>
      </ListItemWrapper>
    );
  }

  handleEditItem = (values, index) => {
    const { list } = this.state;
    const newList = list;
    newList.splice(index, 1, values);
    this.setState({
      list: newList,
    });
    const { setFieldValue, name } = this.props;
    setFieldValue(name, newList);
    this.toggleAddItemModal(false);
  }


  handleAddItem = (values) => {
    const { list } = this.state;
    const newList = list.concat(values);
    this.setState({
      list: newList,
    });
    const { setFieldValue, name } = this.props;
    setFieldValue(name, newList);
    this.toggleAddItemModal(false);
  }

  handleRemoveItem = (index) => {
    const { list } = this.state;
    const newList = list;
    newList.splice(index, 1);
    this.setState({
      list: newList,
    });
    const { setFieldValue, name } = this.props;
    setFieldValue(name, newList);
  }

  renderListItemValue = (value, index) => {
    const { additional } = this.props;
    const { displayFields } = additional;
    const keys = Object.keys(value).filter(key => displayFields[key]);
    return (
      <ListItemWrapper key={index}>
        <Row mutter={32}>
          <Col span={21}>
            {keys.map((key) => {
              const {
                label, tooltip, skip, replace, type,
              } = displayFields[key];
              const result = this.renderItemValue(type, value[key]);
              return (
                // eslint-disable-next-line react/no-array-index-key
                <Row mutter={32} key={key}>
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
          </Col>
          <Col span={3}>
            <ListItemActionGroup>
              <Icon type="close" onClick={() => this.handleRemoveItem(index)} />
              <Icon
                type="edit"
                onClick={() => this.toggleAddItemModal(true, index)}
              />
            </ListItemActionGroup>
          </Col>
        </Row>
      </ListItemWrapper>
    );
  }

  renderListObject = () => {
    const {
      value, comment,
    } = this.props;
    return (
      <ReviewInputValue isList>
        {!_isEmpty(value)
          ? (
            <Tooltip
              title={(
                <span>
                  <Icon component={CommentIcon} />
                  {comment}
                </span>
              )}
            >
              <Row mutter={32}>
                <Col span={22}>
                  {value.map(this.renderListItem)}
                </Col>
                <Icon component={CommentIcon} />
              </Row>
            </Tooltip>
          )
          : (
            <CommentWrapper>
              <Icon component={CommentIcon} />
              {comment}
            </CommentWrapper>
          )
        }
      </ReviewInputValue>
    );
  }

  renderListValue = () => {
    const { list } = this.state;
    return (
      <ReviewInputValue isList>
        <Row mutter={32}>
          <Col span={22}>
            {list.map(this.renderListItemValue)}
          </Col>
        </Row>
      </ReviewInputValue>
    );
  }

  renderText = () => {
    const { value, comment } = this.props;
    const result = value instanceof Array ? value.join(', ') : value;
    if (!result) {
      return (
        <ReviewInputValue>
          <CommentWrapper>
            <Icon component={CommentIcon} />
            {comment}
          </CommentWrapper>
        </ReviewInputValue>
      );
    }
    return (
      <Tooltip
        title={(
          <span>
            <Icon component={CommentIcon} />
            {comment}
          </span>
        )}
      >
        <ReviewInputValue>
          <div>
            {result}
            <Icon component={CommentIcon} />
          </div>
        </ReviewInputValue>
      </Tooltip>
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

  toggleAddItemModal = (isOpen, index) => {
    this.setState({
      isAddListItemModalOpen: isOpen,
      selectedIndex: index,
    });
  }

  render() {
    const { isAddListItemModalOpen, list, selectedIndex } = this.state;
    const {
      name, type, label, additional, schema,
    } = this.props;
    const { fields = {} } = additional || {};
    return (
      <ReviewInputWrapper>
        <ReviewInputTitle>{label}</ReviewInputTitle>
        <ReviewInputValueWrapper>
          <div>
            {this.selectInputType()}
          </div>
          <div>
            <ChangeInputWrapper>
              {type === 'list'
                ? (
                  <div>
                    <ButtonDefault
                      type="button"
                      onClick={() => this.toggleAddItemModal(true)}
                    >
                      <Icon type="plus" />
                      {toI18n('ADD')}
                      {label}
                    </ButtonDefault>
                    {this.renderListValue()}
                  </div>
                )
                : (
                  <FormInput
                    name={name}
                    type={type}
                    {...additional}
                  />
                )}
            </ChangeInputWrapper>
          </div>
          <ChangeRequestModal
            fields={fields}
            schema={schema}
            initValue={list[selectedIndex]}
            selectedIndex={selectedIndex}
            title={label}
            onSubmit={this.handleAddItem}
            onEdit={this.handleEditItem}
            onCancel={() => this.toggleAddItemModal(false)}
            isOpen={isAddListItemModalOpen}
          />
        </ReviewInputValueWrapper>
      </ReviewInputWrapper>
    );
  }
}

export default ChangeRequestField;
