import React, { Component } from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
  Form, Row, Col, Button, Icon, notification,
} from 'antd';
import {
  func, shape, bool, string,
} from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormInput from '../FormInput/FormInput';
import { toI18n } from '../../utils/func-utils';
import { ModalStyled, ErrorMessage, ParameterValue, ParameterTitle, ParameterWrapper, ParameterFormActionGroup, ParameterListWrapper } from './styles';
import { ButtonPrimary, ButtonDefault } from '../../stylesheets/Button.style';

const initialResponseValues = {
  response: {
    en: '',
    vn: '',
  },
  parameters: [],
};
const initialParameterValues = {
  parameterId: '',
  value: '',
};

const parameterSchema = Yup.object().shape({
  parameterId: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
  value: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
});

const responseSchema = Yup.object().shape({
  response: Yup.object().shape({
    en: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    vn: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
  }).required(toI18n('FORM_REQUIRED')),
  parameters: Yup.array().of(parameterSchema).required(toI18n('FORM_REQUIRED')),
});

const initialState = {
  isAdding: false,
  choosedParameterId: null,
  selectedParameters: [],
};

class ResponseFormModal extends Component {
  state = initialState;

  static propTypes = {
    submitAction: func.isRequired,
    handleClose: func.isRequired,
    isOpen: bool.isRequired,
    isSubmitting: bool.isRequired,
    submitError: string,
    title: shape(),
    initialValues: shape(),
    currentIntent: shape(),
  }

  componentDidUpdate = ({ isSubmitting: prevIsCreating, initialValues: prevInitialValues }) => {
    const { isSubmitting, submitError, initialValues: response } = this.props;
    if (_isEmpty(prevInitialValues) && !_isEmpty(response)) {
      this.responseFormik.getFormikContext().setValues(response);
      const { parameters = [] } = response || {};
      this.setState({
        selectedParameters: parameters,
      });
      return;
    }
    if (prevIsCreating && !isSubmitting) {
      if (!submitError) {
        this.handleCancel();
      } else {
        notification.error({ message: submitError });
      }
    }
  }

  handleCancel = () => {
    const { handleClose } = this.props;
    handleClose();
    this.responseFormik.getFormikContext().resetForm();
    this.setState(initialState);
  }

  toggleAddParameter = (isAdding) => {
    this.setState({
      isAdding,
    });
  }

  handleParameterOption = () => {
    const { selectedParameters } = this.state;
    const { currentIntent } = this.props;
    const { parameters = [] } = currentIntent || {};
    const filtered = parameters.filter(
      ({ parameterId }) => !selectedParameters.find(
        param => parameterId === param.parameterId
      )
    );
    return filtered.map(({ displayName, parameterId }) => ({
      label: displayName,
      value: parameterId,
    }));
  }

  handleParameterValue = () => {
    const { currentIntent } = this.props;
    const { choosedParameterId } = this.state;
    const { parameters = [] } = currentIntent || {};
    const parameter = parameters.find(({ parameterId: itemId }) => itemId === choosedParameterId);
    if (!parameter) {
      return [];
    }
    return parameter.values.map(value => ({
      label: value,
      value,
    }));
  }

  chooseParameter = (parameterId) => {
    const context = this.parameterformik.getFormikContext();
    context.setValues({ parameterId });
    this.setState({
      choosedParameterId: parameterId,
    });
  }

  addParameter = (values) => {
    const { selectedParameters } = this.state;
    const context = this.responseFormik.getFormikContext();
    const formData = context.values;
    const { parameters } = formData;
    context.setValues({
      ...formData,
      parameters: parameters.concat(values),
    });
    this.setState({
      isAdding: false,
      choosedParameterId: null,
      selectedParameters: selectedParameters.concat(values),
    });
  }

  removeParameter = (parameterId) => {
    const { selectedParameters } = this.state;
    const context = this.responseFormik.getFormikContext();
    const formData = context.values;
    const { parameters } = formData;
    context.setValues({
      ...formData,
      parameters: parameters.filter(({ parameterId: itemId }) => itemId !== parameterId),
    });
    this.setState({
      selectedParameters: selectedParameters.filter(({ parameterId: itemId }) => itemId !== parameterId),
    });
  }

  handleRenderAddedParameter = ({ parameters: choosedParams = [] }) => {
    const { currentIntent } = this.props;
    const { parameters = [] } = currentIntent || {};
    return choosedParams.map(
      ({ parameterId, value }) => {
        const { displayName } = parameters.find(({ parameterId: itemId }) => parameterId === itemId);
        return (
          <Col span={12}>
            <ParameterWrapper>
              <ParameterTitle>
                {`[${displayName}]`}
              </ParameterTitle>
              <ParameterValue>
                {value}
              </ParameterValue>
              <Icon onClick={() => this.removeParameter(parameterId)} type="close" />
            </ParameterWrapper>
          </Col>
        );
      }
    );
  }

  renderAddParameters = () => (
    <Formik
      ref={(formik) => { this.parameterformik = formik; }}
      initialValues={initialParameterValues}
      validationSchema={parameterSchema}
      onSubmit={this.addParameter}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Row gutter={32}>
            <Col sm={10} xs={10}>
              <FormInput
                name="parameterId"
                type="select"
                options={this.handleParameterOption()}
                onChange={this.chooseParameter}
                label={toI18n('ADMIN_INTENT_ADD_PARAMETER_ID')}
                login={1}
              />
            </Col>
            <Col sm={10} xs={10}>
              <FormInput
                name="value"
                type="select"
                options={this.handleParameterValue()}
                label={toI18n('ADMIN_INTENT_ADD_PARAMETER_VALUE')}
                login={1}
              />
            </Col>
            <Col sm={4} xs={4}>
              <ParameterFormActionGroup>
                <Icon onClick={() => this.toggleAddParameter(false)} type="close" />
                <Icon onClick={handleSubmit} type="check" />
              </ParameterFormActionGroup>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  )

  handleOnSubmit = (values) => {
    const { submitAction, currentIntent } = this.props;
    const { _id: intentId } = currentIntent;
    submitAction({
      ...values,
      intentId,
    });
  }

  render() {
    const { isAdding } = this.state;
    const {
      isOpen, currentIntent, isSubmitting, title,
      initialValues: reponse,
    } = this.props;
    const { displayName } = currentIntent || {};
    return (
      <Formik
        ref={(formik) => { this.responseFormik = formik; }}
        initialValues={reponse || initialResponseValues}
        validationSchema={responseSchema}
        onSubmit={this.handleOnSubmit}
        confirmLoading={isSubmitting}
      >
        {({ handleSubmit, values, errors: { parameters: paramError } }) => (
          <ModalStyled
            title={(
              <div>
                {title}
                {' '}
                {displayName}
              </div>
            )}
            visible={isOpen}
            onOk={handleSubmit}
            onCancel={this.handleCancel}
            okText={toI18n('FORM_SUBMIT')}
          >
            {isAdding ? this.renderAddParameters() : (
              <Button onClick={() => this.toggleAddParameter(true)}>
                + Add Parameter
              </Button>
            )}
            <ErrorMessage>{paramError}</ErrorMessage>
            <Form>
              <ParameterListWrapper gutter={32}>
                {this.handleRenderAddedParameter(values)}
              </ParameterListWrapper>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="response.en"
                    type="text"
                    label={toI18n('ADMIN_INTENT_ADD_RESPONSE_EN')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="response.vn"
                    type="text"
                    label={toI18n('ADMIN_INTENT_ADD_RESPONSE_VN')}
                    login={1}
                  />
                </Col>
              </Row>
            </Form>
          </ModalStyled>
        )}
      </Formik>
    );
  }
}

export default ResponseFormModal;
