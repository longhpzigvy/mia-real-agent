import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { bool, func, string } from 'prop-types';
import {
  Modal, Form, Row, Col,
} from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toI18n } from '../../utils/func-utils';
import FormInput from '../FormInput/FormInput';
import { TICKET_STATUS } from '../../../common/enums';
import { ActionBar } from '../CreateTicket/styles';
import { getTicketIsClosing, getTicketCloseError } from '../../selectors/ticket';
import LoadingSpin from '../Loading';
import { ButtonCancel, ButtonSubmit } from '../../stylesheets/Button.style';
import TicketReceipt from '../../containers/TicketReceipt/TicketReceipt';


const initialValues = {
  status: TICKET_STATUS.SOLVED,
  unsolvedReason: '',
};

const validationSchema = Yup.object().shape({
  status: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
  unsolvedReason: Yup.string().trim(),
});

const additionalValidate = (values) => {
  const errors = {};
  if (values.status === TICKET_STATUS.UNSOLVED && !values.unsolvedReason) {
    errors.unsolvedReason = toI18n('FORM_REQUIRED');
  }
  return errors;
};


class CloseTicketModal extends React.PureComponent {
  static propTypes = {
    isOpen: bool.isRequired,
    isClosing: bool.isRequired,
    handleCloseModal: func.isRequired,
    closeError: string.isRequired,
    handleSubmitCloseTicket: func.isRequired,
  }


  componentDidUpdate(prevProps) {
    const {
      isOpen, isClosing, closeError, handleCloseModal,
    } = this.props;
    if (!isOpen && prevProps.isOpen) {
      this.formik.resetForm();
    }

    if (prevProps.isClosing && !isClosing && !closeError) {
      handleCloseModal();
    }
  }


  state = {}

  render() {
    const {
      isOpen, handleCloseModal, handleSubmitCloseTicket, isClosing,
    } = this.props;
    return (
      <Formik
        ref={(formik) => { this.formik = formik; }}
        initialValues={initialValues}
        validate={additionalValidate}
        validationSchema={validationSchema}
        onSubmit={handleSubmitCloseTicket}
        confirmLoading={false}
        okText={toI18n('FORM_SUBMIT')}
      >
        {({ handleSubmit, values }) => (
          <Modal
            title={toI18n('TICKET_RECEIPT_TITLE')}
            visible={isOpen}
            onOk={handleSubmit}
            onCancel={handleCloseModal}
            footer={null}
          >
            <LoadingSpin loading={isClosing}>
              {
                values.status === TICKET_STATUS.SOLVED && (<TicketReceipt />)
              }
              <Form>
                <Row gutter={32}>
                  <Col sm={24} xs={24}>
                    <FormInput
                      name="status"
                      type="select"
                      label={toI18n('CLOSE_TICKET_MODAL_CLOSED_STATUS')}
                      options={[TICKET_STATUS.SOLVED, TICKET_STATUS.UNSOLVED].map(value => ({
                        value,
                        label: value,
                      }))}
                    />
                    {
                      values.status === TICKET_STATUS.UNSOLVED && (
                        <FormInput
                          name="unsolvedReason"
                          type="text"
                          label={toI18n('CLOSE_TICKET_MODAL_UNSOLVED_REASON')}
                          login={1}
                        />
                      )
                    }
                  </Col>
                </Row>

                <Row gutter={32}>
                  <ActionBar>
                    <ButtonSubmit loading={isClosing} disabled={isClosing} onClick={handleSubmit}>
                      {toI18n('CLOSE_TICKET_MODAL_CLOSE_TICKET')}
                    </ButtonSubmit>
                    <ButtonCancel type="button" cancel onClick={handleCloseModal}>
                      {toI18n('CANCEL')}
                    </ButtonCancel>
                  </ActionBar>
                </Row>
              </Form>
            </LoadingSpin>
          </Modal>
        )}
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  isClosing: getTicketIsClosing(state),
  closeError: getTicketCloseError(state),
});


export default compose(
  connect(mapStateToProps, null),
)(CloseTicketModal);
