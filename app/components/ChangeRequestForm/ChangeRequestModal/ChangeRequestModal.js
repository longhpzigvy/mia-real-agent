import React, { Component } from 'react';
import {
  Modal, Form, Row, Col,
} from 'antd';
import { Formik } from 'formik';
import {
  shape, bool, func, any, number,
} from 'prop-types';
import FormInput from '../../FormInput/FormInput';
import { ButtonCancel, ButtonSubmit } from '../../../stylesheets/Button.style';
import { toI18n, generateInitValue } from '../../../utils/func-utils';
import { ActionGroup } from './styles';

class ChangeRequestModal extends Component {
  static propTypes = {
    fields: shape().isRequired,
    schema: shape().isRequired,
    title: any.isRequired,
    isOpen: bool.isRequired,
    onCancel: func.isRequired,
    onSubmit: func.isRequired,
    onEdit: func.isRequired,
    selectedIndex: number,
    initValue: shape(),
  }

  componentDidUpdate = (prevProps) => {
    const { isOpen, initValue } = this.props;
    if (!prevProps.isOpen && isOpen && !!initValue) {
      this.modalForm.getFormikContext().setValues(initValue);
    }
  }

  handleInitialValues = () => {
    const { fields } = this.props;
    let initialValues = {};
    Object.keys(fields).forEach((field) => {
      initialValues = { ...initialValues, [field]: generateInitValue(fields[field].type) };
    });
    return initialValues;
  }

  renderFormInput = (values) => {
    const { fields } = this.props;

    return Object.keys(fields).map((key) => {
      const {
        label, type, skip, ...rest
      } = fields[key];
      return (
        <div
          key={key}
        >
          {!values[skip] && (
            <FormInput
              label={label}
              name={key}
              type={type}
              login={1}
              {...rest}
            />
          )}
        </div>
      );
    });
  }

  handleSubmit = (values) => {
    const { onSubmit, onEdit, selectedIndex } = this.props;
    if (selectedIndex != null) {
      onEdit(values, selectedIndex);
      return;
    }
    onSubmit(values);
    this.modalForm.getFormikContext().resetForm();
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.modalForm.getFormikContext().resetForm();
  }

  render() {
    const {
      isOpen, title, schema, initValue,
    } = this.props;
    return (
      <Modal
        title={(
          <span>
            Add
            {' '}
            {title}
          </span>
        )}
        visible={isOpen}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Formik
          ref={((modalForm) => { this.modalForm = modalForm; })}
          validationSchema={schema}
          initialValues={this.handleInitialValues()}
          onSubmit={this.handleSubmit}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              {this.renderFormInput(values)}
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <ActionGroup>
                    <ButtonCancel
                      type="button"
                      onClick={this.handleCancel}
                    >
                      {toI18n('FORM_CANCEL')}
                    </ButtonCancel>
                    <ButtonSubmit type="button" onClick={handleSubmit}>
                      {initValue ? toI18n('FORM_SAVE') : toI18n('FORM_ADD')}
                    </ButtonSubmit>
                  </ActionGroup>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default ChangeRequestModal;
