import React, { Component } from 'react';
import {
  Row, Col, Form, Modal, Icon,
} from 'antd';
import { Formik, FieldArray } from 'formik';
import { func } from 'prop-types';
import FormInput from '../FormInput/FormInput';
import {
  ActionFormRegister,
  ArrayTagWrapper,
  ArrayInputWrapper,
  ArrayWrapper,
  TagAction,

} from './styles';
import { ButtonCancel, ButtonSubmit, ArrayAddButton } from '../../stylesheets/Button.style';
import { AGENT_SKILL, APPLICATION_LANGUAGE, MARKS, LANGUAGE_OPTIONS } from '../../../common/enums';
import { toI18n } from '../../utils/func-utils';
import { APPLICATION_FORM } from '../../utils/constants';

const languageInititalValues = {
  name: '',
  writing: 1,
  reading: 1,
  speaking: 1,
  overall: 1,
};

const initialValues = {
  cv: '',
  skills: [],
  languages: [],
  social: {},
};


export class AdditionalForm extends Component {
  state = {
    isLanguageFormOpen: false,
    editIndex: -1,
  }

  static propTypes = {
    onSubmit: func.isRequired,
    onCancel: func.isRequired,
  }


  handleToggleLanguageModal = (isOpen, editEducation = languageInititalValues, editIndex = -1) => {
    this.setState({
      isLanguageFormOpen: isOpen,
      editIndex,
    });
    const { educationformik } = this;
    if (isOpen && educationformik) {
      educationformik.getFormikContext().setValues(editEducation);
    }
    if (!isOpen) {
      educationformik.getFormikContext().resetForm();
    }
  };

  handleAddLanguage = (language) => {
    const { editIndex } = this.state;
    const { formik } = this;
    const context = formik.getFormikContext();
    const { values } = context;
    const { languages } = values;
    if (editIndex >= 0) {
      languages[editIndex] = language;
      context.setValues({
        ...values,
        languages,
      });
    } else {
      context.setValues({
        ...values,
        languages: [...languages, language],
      });
    }
    this.handleToggleLanguageModal(false);
  }

  renderLanguageModal = () => {
    const { isLanguageFormOpen, editIndex } = this.state;
    return (
      <Modal
        visible={isLanguageFormOpen}
        centered
        onCancel={() => this.handleToggleLanguageModal(false)}
        footer={[]}
        title="Languages"
        wrapClassName="modal-customize"
        width="640px"
        forceRender
      >
        <Formik
          ref={(formik) => { this.educationformik = formik; }}
          initialValues={languageInititalValues}
          validationSchema={APPLICATION_FORM.LANGUAGE_VALIDATION_SCHEMA}
          onSubmit={this.handleAddLanguage}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="name"
                    type="select"
                    className="vienpn"
                    options={LANGUAGE_OPTIONS}
                    label={toI18n('APPLICATION_ADDTIONAL_FORM_NAME')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={12} xs={24}>
                  <FormInput
                    name="writing"
                    type="slider"
                    marks={MARKS}
                    min={1}
                    max={5}
                    label={toI18n('APPLICATION_ADDTIONAL_FORM_WRITING')}
                    login={1}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <FormInput
                    name="reading"
                    type="slider"
                    marks={MARKS}
                    min={1}
                    max={5}
                    label={toI18n('APPLICATION_ADDTIONAL_FORM_READING')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={12} xs={24}>
                  <FormInput
                    name="speaking"
                    type="slider"
                    marks={MARKS}
                    min={1}
                    max={5}
                    label={toI18n('APPLICATION_ADDTIONAL_FORM_SPEAKING')}
                    login={1}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <FormInput
                    name="overall"
                    type="slider"
                    marks={MARKS}
                    min={1}
                    max={5}
                    label={toI18n('APPLICATION_ADDTIONAL_FORM_OVERALL')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <ActionFormRegister>
                    <ButtonCancel
                      type="button"
                      onClick={() => this.handleToggleLanguageModal(false)}
                    >
                      {toI18n('FORM_CANCEL')}
                    </ButtonCancel>
                    <ButtonSubmit type="submit">
                      {editIndex >= 0 ? toI18n('FORM_SAVE') : toI18n('FORM_ADD')}
                    </ButtonSubmit>
                  </ActionFormRegister>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }

  renderLanguage = (education, arrayHelpers, index) => {
    const {
      name, writing,
      reading, speaking, overall,
    } = education;
    return (
      <ArrayTagWrapper key={index}>
        <div className="WorkEducation">
          <div className="WorkEducationText">
            <h2>
              {name}
            </h2>
            <div className="language">
              <span className="label">
                {toI18n('APPLICATION_ADDTIONAL_RENDER_WRITING')}
                :
              </span>
              <strong>
                {writing}
                {' '}
                /5
              </strong>
              <span className="label">
                {toI18n('APPLICATION_ADDTIONAL_RENDER_READING')}
                :
              </span>
              <strong>
                {reading}
                {' '}
                /5
              </strong>
              <span className="label">
                {toI18n('APPLICATION_ADDTIONAL_RENDER_SPEAKING')}
                :
              </span>
              <strong>
                {speaking}
                {' '}
                /5
              </strong>
              <span className="label">
                {toI18n('APPLICATION_ADDTIONAL_RENDER_OVERALL')}
                :
              </span>
              <strong>
                {overall}
                {' '}
                /5
              </strong>
            </div>
          </div>
          <div>
            <TagAction>
              <Icon
                onClick={() => this.handleToggleLanguageModal(true, education, index)}
                type="edit"
              />
              <Icon
                onClick={() => arrayHelpers.remove(index)}
                type="close"
              />
            </TagAction>
          </div>
        </div>
      </ArrayTagWrapper>
    );
  };


  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  renderRegisterBtn = () => (
    <ActionFormRegister>
      <ButtonCancel
        type="button"
        onClick={this.handleCancel}
      >
        <i className="mia-chevron-left" />
        <span>{toI18n('FORM_BACK')}</span>
      </ButtonCancel>
      <ButtonSubmit type="submit">
        <span>{toI18n('FORM_NEXT')}</span>
        <i className="mia-chevron-right" />
      </ButtonSubmit>
    </ActionFormRegister>
  )

  handleSubmit = (values) => {
    const { onSubmit } = this.props;
    onSubmit(values);
  }

  render() {
    return (
      <div>
        <Formik
          ref={(formik) => { this.formik = formik; }}
          initialValues={initialValues}
          validationSchema={APPLICATION_FORM.ADDITIONAL_VALIDATION_SCHEMA}
          onSubmit={this.handleSubmit}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <Row gutter={32}>
                <Col sm={12} xs={24}>
                  <Row gutter={32}>
                    <Col sm={24} xs={24}>
                      <FormInput
                        name="skills"
                        type="select"
                        mode="multiple"
                        options={AGENT_SKILL}
                        label={toI18n('APPLICATION_ADDTIONAL_FORM_SKILLS')}
                        login={1}
                      />
                    </Col>
                  </Row>
                  <Row gutter={32}>
                    <Col sm={24} xs={24}>
                      <FormInput
                        name="address"
                        type="text"
                        label={toI18n('APPLICATION_ADDTIONAL_ADDRESS')}
                        login={1}
                      />
                    </Col>
                    {/* <Col sm={12} xs={24}>
                  <FormInput
                    name="social"
                    type="text"
                    label="Social"
                    login={1}
                  />
                </Col> */}
                  </Row>
                </Col>
                <Col sm={12} xs={24}>
                  <FormInput
                    name="cv"
                    type="upload"
                    className="upload-list-inline"
                    label={toI18n('APPLICATION_ADDTIONAL_FORM_CV')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FieldArray
                    name="languages"
                    render={arrayHelpers => (
                      <ArrayInputWrapper>
                        <p>
                          {toI18n('APPLICATION_ADDTIONAL_LANGUAGES')}
                          :
                        </p>
                        <ArrayAddButton type="button" onClick={() => this.handleToggleLanguageModal(true)}>
                          <i className="mia-add" />
                          {toI18n('APPLICATION_ADDTIONAL_ADD_LANGUAGE')}
                        </ArrayAddButton>
                        <ArrayWrapper>
                          {
                            values.languages.map((
                              language, index
                            ) => this.renderLanguage(language, arrayHelpers, index))
                          }
                        </ArrayWrapper>
                      </ArrayInputWrapper>
                    )}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  {this.renderRegisterBtn()}
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        {this.renderLanguageModal()}
      </div>
    );
  }
}

export default AdditionalForm;
