import React, { Component } from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
  Row, Col, Form, Icon, Modal,
} from 'antd';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { func } from 'prop-types';
import FormInput from '../FormInput/FormInput';
import {
  ArrayTagWrapper,
  ArrayInputWrapper, TagAction, ArrayWrapper, DescriptionNumber, ActionFormRegister,
} from './styles';
import { FIELD_OF_STUDY } from '../../../common/enums';
import { toI18n } from '../../utils/func-utils';
import { ButtonCancel, ButtonSubmit, ArrayAddButton } from '../../stylesheets/Button.style';
import { APPLICATION_FORM } from '../../utils/constants';

const educationInititalValues = {
  school: '',
  degree: '',
  fieldOfStudy: [],
  gpa: 0,
};

const initialValues = {
  educations: [],
};

export class EducationForm extends Component {
  state = {
    isEducationFormOpen: false,
    editIndex: -1,
  }

  static propTypes = {
    onSubmit: func.isRequired,
    onCancel: func.isRequired,
  }


  handleToggleEducationModal = (isOpen, editEducation = educationInititalValues, editIndex = -1) => {
    this.setState({
      isEducationFormOpen: isOpen,
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

  handleAddExperience = (experience) => {
    const { editIndex } = this.state;
    const { formik } = this;
    const context = formik.getFormikContext();
    const { educations } = context.values;
    if (editIndex >= 0) {
      educations[editIndex] = experience;
      context.setValues({
        educations,
      });
    } else {
      context.setValues({
        educations: [...educations, experience],
      });
    }
    this.handleToggleEducationModal(false);
  }

  renderEducationModal = () => {
    const { isEducationFormOpen, editIndex } = this.state;
    return (
      <Modal
        visible={isEducationFormOpen}
        onClick={() => this.handleToggleEducationModal(false)}
        footer={[]}
        title="Add Education"
        wrapClassName="modal-customize"
        centeredExperiences
      >
        <Formik
          ref={(formik) => { this.educationformik = formik; }}
          initialValues={educationInititalValues}
          validationSchema={APPLICATION_FORM.EDUCATION_ITEM_VALIDATION_SCHEMA}
          onSubmit={this.handleAddExperience}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="school"
                    type="text"
                    label={toI18n('APPLICATION_EDUCATION_FORM_SCHOOL')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="degree"
                    type="text"
                    label={toI18n('APPLICATION_EDUCATION_FORM_DEGREE')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="fieldOfStudy"
                    type="select"
                    mode="multiple"
                    options={FIELD_OF_STUDY}
                    label={toI18n('APPLICATION_EDUCATION_FORM_FOS')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="gpa"
                    type="number"
                    label={toI18n('APPLICATION_EDUCATION_FORM_GPA')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="certificate"
                    type="upload"
                    label={toI18n('APPLICATION_EDUCATION_FORM_CERTIFICATE')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <ActionFormRegister>
                    <ButtonCancel
                      type="button"
                      onClick={() => this.handleToggleEducationModal(false)}
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

  renderEducation = (education, arrayHelpers, index) => {
    const {
      school, degree, gpa, certificate, fieldOfStudy,
    } = education;
    return (
      <ArrayTagWrapper key={index}>
        <div className="WorkEducation">
          <div className="WorkEducationText">
            <h2>
              {school}
              <span>{degree}</span>
            </h2>
            <div className="GPA">
              {fieldOfStudy.join(', ')}
              <DescriptionNumber>
                <span>{toI18n('APPLICATION_EDUCATION_RENDER_GPA')}</span>
                {' : '}
                {gpa}
              </DescriptionNumber>
            </div>
            {/* <div>
              {!_isEmpty(certificate) && (
                <a href={certificate}>{certificate}</a>
              )}
            </div> */}
          </div>
          <div>
            <TagAction>
              <Icon
                onClick={() => this.handleToggleEducationModal(true, education, index)}
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
        {toI18n('FORM_BACK')}
      </ButtonCancel>
      <ButtonSubmit type="submit">
        {toI18n('FORM_NEXT')}
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
          validationSchema={APPLICATION_FORM.EDUCATION_VALIDATION_SCHEMA}
          onSubmit={this.handleSubmit}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FieldArray
                    name="educations"
                    render={arrayHelpers => (
                      <ArrayInputWrapper>
                        <p>
                          {toI18n('APPLICATION_EDUCATION_FORM_EDUCATIONS')}
                          :
                        </p>
                        <ArrayAddButton type="button" onClick={() => this.handleToggleEducationModal(true)}>
                          <i className="mia-add" />
                          {toI18n('APPLICATION_EDUCATION_FORM_ADD_EDUCATION')}
                        </ArrayAddButton>
                        <ArrayWrapper>
                          {
                            values.educations.map((
                              education, index
                            ) => this.renderEducation(education, arrayHelpers, index))
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
        {this.renderEducationModal()}
      </div>
    );
  }
}

export default EducationForm;
