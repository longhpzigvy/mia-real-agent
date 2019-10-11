import React from 'react';
import {
  Modal, Form, Row, Col,
} from 'antd';
import _get from 'lodash/get';
import { func, shape } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Formik } from 'formik';
import { DefaultButton } from 'components/Generals/General.styled';
import * as Yup from 'yup';
import CannedResponseTable from './CannedResponseManagement';
import { toI18n } from '../../utils/func-utils';
import FormInput from '../../components/FormInput/FormInput';
import LoadingSpin from '../../components/Loading';
import { ActionBar } from '../../components/CreateTicket/styles';
import { actions } from '../../reducers/cannedResponse';
import { reselectAddNewContext, reselectUpdateContext } from '../../selectors/cannedResponse';
import { NEW_BUTTONS_TYPE } from '../../../common/enums';
import { ButtonPrimary, ButtonDefault } from '../../stylesheets/Button.style';

const initialValues = {
  shortcut: '',
  content: '',
  _id: '',
};

const validationSchema = Yup.object().shape({
  shortcut: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
  content: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
  _id: Yup.string(),
});


class CannedResponseManagement extends React.PureComponent {
  static propTypes = {
    updateCannedResponse: func.isRequired,
    addNewCannedResponse: func.isRequired,
    addNewContext: shape().isRequired,
    updateContext: shape().isRequired,
  }

  state = {
    openModal: false,
    isUpdate: false,
  }

  componentDidUpdate(prevProps) {
    const { addNewContext, updateContext } = this.props;
    const { addNewContext: prevAddNewContext, updateContext: prevUpdateContext } = prevProps;

    if (prevAddNewContext.inProgress && !addNewContext.isProgresing && !addNewContext.message) {
      this.handleCloseModal();
    }

    if (prevUpdateContext.inProgress && !updateContext.isProgresing && !updateContext.message) {
      this.handleCloseModal();
    }
  }

  handleClickRow = (cannedResponse) => {
    this.setState({
      openModal: true,
      isUpdate: true,
    });
    this.formik.setValues({
      shortcut: cannedResponse.shortcut,
      content: cannedResponse.content,
      _id: _get(cannedResponse, '_id'),
    });
  }

  handleSubmit = (values) => {
    const { updateCannedResponse, addNewCannedResponse } = this.props;
    const { isUpdate } = this.state;
    if (isUpdate) {
      updateCannedResponse(values);
    } else {
      delete values._id;
      addNewCannedResponse(values);
    }
  }

  handleCloseModal = () => {
    this.setState({
      openModal: false,
    });
  }

  handleClickAdd = () => {
    this.setState({
      openModal: true,
      isUpdate: false,
    });
    this.formik.resetForm();
  }

  render() {
    const { openModal, isUpdate } = this.state;
    const { addNewContext, updateContext } = this.props;
    const isProgresing = addNewContext.inProgress || updateContext.inProgress;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Formik
          ref={(formik) => { this.formik = formik; }}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={this.handleSubmit}
          confirmLoading={false}
          okText={toI18n('FORM_SUBMIT')}
        >
          {({ handleSubmit }) => (
            <Modal
              title={toI18n(isUpdate ? 'CANNED_RESPONSE_FORM_UPDATE_TITLE' : 'CANNED_RESPONSE_FORM_CREATE_TITLE')}
              visible={openModal}
              footer={null}
              onCancel={this.handleCloseModal}
            >
              <LoadingSpin loading={isProgresing}>
                <Form>
                  <Row gutter={32}>
                    <Col sm={24} xs={24}>
                      <FormInput
                        name="shortcut"
                        type="text"
                        label={toI18n('CANNED_RESPONSE_FORM_SHORTCUT')}
                        login={1}
                      />
                      <FormInput
                        name="content"
                        type="text"
                        label={toI18n('CANNED_RESPONSE_FORM_CONTENT')}
                        login={1}
                      />
                    </Col>
                  </Row>

                  <Row gutter={32}>
                    <ActionBar>
                      <ButtonDefault type="button" cancel onClick={this.handleCloseModal}>
                        {toI18n('CANCEL')}
                      </ButtonDefault>

                      <ButtonPrimary type="submit" loading={isProgresing} disabled={isProgresing} onClick={handleSubmit}>
                        {toI18n(isUpdate ? 'CANNED_RESPONSE_FORM_UPDATE_BTN' : 'CANNED_RESPONSE_FORM_CREATE_BTN')}
                      </ButtonPrimary>
                    </ActionBar>
                  </Row>
                </Form>
              </LoadingSpin>
            </Modal>
          )}
        </Formik>
        <CannedResponseTable
          onClickAddButton={this.handleClickAdd}
          onClickRow={this.handleClickRow}
          newButtonType={NEW_BUTTONS_TYPE.BUTTON}
        />
      </div>

    );
  }
}

const mapState = state => ({
  addNewContext: reselectAddNewContext(state),
  updateContext: reselectUpdateContext(state),
});

const mapDispatch = {
  updateCannedResponse: actions.updateCannedResponse,
  addNewCannedResponse: actions.addNewCannedResponse,
};


export default compose(
  connect(mapState, mapDispatch)
)(CannedResponseManagement);
