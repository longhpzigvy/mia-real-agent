import React, { Component } from 'react';
import { shape, arrayOf, func } from 'prop-types';
import { Col } from 'antd';
import {
  ResponseItemWrapper, ResponseParameterWrapper,
  ResponseValueWrapper, ResponseActionWrapper, ParameterValue,
} from './styles';

export class ResponseItem extends Component {
  static propTypes = {
    response: shape().isRequired,
    onEdit: func.isRequired,
    onRemove: func.isRequired,
    parameters: arrayOf(shape()),
  }

  renderResponse = () => {
    const { response: item } = this.props;
    const { response } = item;
    return (
      <ResponseValueWrapper>
        <div>
          <span>EN:</span>
          <b>{response.en}</b>
        </div>
        <div>
          <span>VN:</span>
          <b>{response.vn}</b>
        </div>
      </ResponseValueWrapper>
    );
  }

  renderParameters = () => {
    const { response: item } = this.props;
    return (
      <ParameterValue>
        {item.parameters.length}
      </ParameterValue>
    );
  }

  render() {
    const { onEdit, onRemove } = this.props;
    return (
      <ResponseItemWrapper>
        <Col span={16}>
          {this.renderResponse()}
        </Col>
        <Col span={6}>
          {this.renderParameters()}
        </Col>
        <Col span={2}>
          <ResponseActionWrapper>
            <i role="presentation" className="mia-edit" onClick={onEdit} />
            <i role="presentation" className="mia-close" onClick={onRemove} />
          </ResponseActionWrapper>
        </Col>
      </ResponseItemWrapper>
    );
  }
}

export default ResponseItem;
