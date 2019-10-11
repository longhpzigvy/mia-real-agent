import React, { Component } from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
  shape, arrayOf, bool, func,
} from 'prop-types';
import SpinnerLoading from 'components/PageLoading';
import ShadowScrollbars from 'components/Scrollbar';
import MediaQuery from 'react-responsive';
import ResponseItem from './ResponseItem';
import { toI18n } from '../../utils/func-utils';
import EditResponseModal from '../../containers/EditResponseModal';
import { NoResposne, SpinningWrapper, ResponseListHeader } from './styles';
import { Row, Col } from 'antd';

const widthBreakpoint = 768;
const scrollStyle = {
  height: 'calc(100vh - 105px)',
  width: '100%',
};

const scrollStyleMobile = {
  height: 'calc(100vh - 60px)',
  width: '100%',
};

// eslint-disable-next-line react/prefer-stateless-function
export class ResponseList extends Component {
  state = {
    editResponseModalVisible: false,
    selectedId: null,
  }

  toggleEditResponseModal = (isOpen, selectedId) => {
    this.setState({
      editResponseModalVisible: isOpen,
      selectedId,
    });
  }

  renderResponseItem = (response) => {
    const { currentIntent, removeAction } = this.props;
    const { parameters } = currentIntent;
    const { _id } = response;
    return (
      <ResponseItem
        key={_id}
        response={response}
        parameters={parameters}
        onEdit={() => this.toggleEditResponseModal(true, _id)}
        onRemove={() => removeAction(_id)}
      />
    );
  }

  renderResponseList = () => {
    const { responseList } = this.props;
    if (_isEmpty(responseList)) {
      return (<NoResposne>{toI18n('ADMIN_INTENT_DETAIL_NO_RESPONSES')}</NoResposne>);
    }
    return (
      <MediaQuery maxWidth={widthBreakpoint}>
        {matches => (
          <ShadowScrollbars autoHide style={matches ? scrollStyleMobile : scrollStyle}>
            {responseList.map(this.renderResponseItem)}
          </ShadowScrollbars>
        )}
      </MediaQuery>
    );
  }

  render() {
    const { editResponseModalVisible, selectedId } = this.state;
    const { isFetchingList = {} } = this.props;
    if (isFetchingList) {
      return (
        <SpinningWrapper>
          <SpinnerLoading />
        </SpinningWrapper>
      );
    }
    return (
      <div>
        <ResponseListHeader gutter={32}>
          <Col span={16}>Response</Col>
          <Col span={6}>Param</Col>
          <Col span={2}>Action</Col>
        </ResponseListHeader>
        {this.renderResponseList()}
        <EditResponseModal
          responseId={selectedId}
          isOpen={editResponseModalVisible}
          handleClose={() => this.toggleEditResponseModal(false)}
        />
      </div>
    );
  }
}

ResponseList.propTypes = {
  isFetchingList: bool,
  currentIntent: shape(),
  responseList: arrayOf(shape()).isRequired,
  removeAction: func.isRequired,
};

export default ResponseList;
