import React, { Component } from 'react';
import moment from 'moment';
import {
  Row, Col, Form, Icon, Modal,
} from 'antd';
import { Formik, FieldArray } from 'formik';
import { func } from 'prop-types';
import FormInput from '../FormInput/FormInput';
import {
  ActionFormRegister,
  ArrayTagWrapper,
  ArrayInputWrapper, ArrayWrapper, TagAction,
} from './styles';
import { CATEGORY_OPTIONS } from '../../../common/enums';
import { DATE_TIME_FORMAT, APPLICATION_FORM } from '../../utils/constants';
import { toI18n } from '../../utils/func-utils';
import { ButtonCancel, ButtonSubmit, ArrayAddButton } from '../../stylesheets/Button.style';

const experienceInititalValues = {
  title: '',
  company: '',
  location: '',
  from: '',
  to: '',
  isWorking: false,
  roleDescription: '',
};

const initialValues = {
  categories: [],
  workExperiences: [],
};

export class ExperienceForm extends Component {
  state = {
    isExperienceFormOpen: false,
    editIndex: -1,
  }

  static propTypes = {
    onSubmit: func.isRequired,
    onCancel: func.isRequired,
  }

  handleToggleExperienceModal = (isOpen, editExperience = experienceInititalValues, editIndex = -1) => {
    this.setState({
      isExperienceFormOpen: isOpen,
      editIndex,
    });
    const { experienceformik } = this;
    if (isOpen && experienceformik) {
      experienceformik.getFormikContext().setValues(editExperience);
    }
    if (!isOpen) {
      experienceformik.getFormikContext().resetForm();
    }
  };

  handleAddExperience = (experience) => {
    const { editIndex } = this.state;
    const { formik } = this;
    const context = formik.getFormikContext();
    const { values } = context;
    const { workExperiences } = values;
    if (editIndex >= 0) {
      workExperiences[editIndex] = experience;
      context.setValues({
        ...values,
        workExperiences,
      });
    } else {
      context.setValues({
        ...values,
        workExperiences: [...workExperiences, experience],
      });
    }
    this.handleToggleExperienceModal(false);
  }

  renderWorkExperienceModal = () => {
    const { isExperienceFormOpen, editIndex } = this.state;
    return (
      <Modal
        title="Add Experience"
        wrapClassName="modal-customize"
        centeredExperiences
        visible={isExperienceFormOpen}
        onClick={() => this.handleToggleExperienceModal(false)}
        footer={[]}
        forceRender
      >
        <Formik
          ref={(formik) => { this.experienceformik = formik; }}
          initialValues={experienceInititalValues}
          validationSchema={APPLICATION_FORM.EXPERIENCE_WORK_ITEM_VALIDATION_SCHEMA}
          onSubmit={this.handleAddExperience}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <Row gutter={32}>
                <Col sm={12} xs={24}>
                  <FormInput
                    name="title"
                    type="text"
                    label={toI18n('APPLICATION_EXPERIENCE_FORM_TITLE')}
                    login={1}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <FormInput
                    name="company"
                    type="text"
                    label={toI18n('APPLICATION_EXPERIENCE_FORM_COMPANY')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="location"
                    type="text"
                    label={toI18n('APPLICATION_EXPERIENCE_FORM_LOCATION')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="isWorking"
                    type="checkbox"
                    label={toI18n('APPLICATION_EXPERIENCE_FORM_CURRENT_WORKING')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={values.isWorking ? 24 : 12} xs={24}>
                  <FormInput
                    name="from"
                    type="date"
                    label={toI18n('APPLICATION_EXPERIENCE_FORM_FROM')}
                    login={1}
                  />
                </Col>
                {!values.isWorking && (
                  <Col sm={12} xs={24}>
                    <FormInput
                      name="to"
                      type="date"
                      label={toI18n('APPLICATION_EXPERIENCE_FORM_TO')}
                      login={1}
                    />
                  </Col>
                )}
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="roleDescription"
                    type="textarea"
                    label={toI18n('APPLICATION_EXPERIENCE_FORM_ROLE_DESCRIPTION')}
                    login={1}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <ActionFormRegister>
                    <ButtonCancel
                      onClick={() => this.handleToggleExperienceModal(false)}
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

  renderWorkExperience = (experience, arrayHelpers, index) => {
    const {
      title, company, from, to, isWorking, roleDescription, location,
    } = experience;
    return (
      <ArrayTagWrapper key={index}>
        <div className="WorkExperience">
          <div className="WorkExperienceText">
            <h2>
              {title}
              <span>{toI18n('APPLICATION_EXPERIENCE_RENDER_AT')}</span>
              {company}
            </h2>
            <div className="time">
              <span className="location">
                {location}
              </span>
              <span className="from">
                <label htmlFor="vienpn">{toI18n('APPLICATION_EXPERIENCE_RENDER_FROM')}</label>
                {moment(from).format('DD-MM-YYYY')}
              </span>
              <span className="to">
                {
                  isWorking
                    ? <label htmlFor="vienpn">{toI18n('APPLICATION_EXPERIENCE_RENDER_TO_PRESENT')}</label>
                    : (
                      <span>
                        <label htmlFor="vienpn">
                          {toI18n('APPLICATION_EXPERIENCE_RENDER_TO')}
                          {' '}
                        </label>
                        {moment(to).format('DD-MM-YYYY')}
                      </span>
                    )
                }
              </span>
            </div>
            <div className="desc">
              {roleDescription}
            </div>
          </div>
          <div>
            <TagAction>
              <Icon
                onClick={() => this.handleToggleExperienceModal(true, experience, index)}
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
          validationSchema={APPLICATION_FORM.EXPERIENCE_VALIDATION_SCHEMA}
          onSubmit={this.handleSubmit}
        >
          {({ handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  <FormInput
                    name="categories"
                    type="select"
                    mode="multiple"
                    options={CATEGORY_OPTIONS}
                    label={toI18n('APPLICATION_EXPERIENCE_FORM_CATEGORY')}
                    login={1}
                  />
                </Col>
              </Row>
              <FieldArray
                name="workExperiences"
                render={arrayHelpers => (
                  <ArrayInputWrapper>
                    <p>
                      {toI18n('APPLICATION_EXPERIENCE_FORM_EXPERIENCES')}
                      :
                    </p>
                    <ArrayAddButton type="button" onClick={() => this.handleToggleExperienceModal(true)}>
                      <i className="mia-add" />
                      {toI18n('APPLICATION_EXPERIENCE_FORM_ADD_EXPERIENCE')}
                    </ArrayAddButton>
                    <ArrayWrapper>
                      {
                        values.workExperiences.map((
                          experience, index
                        ) => this.renderWorkExperience(experience, arrayHelpers, index))
                      }
                    </ArrayWrapper>
                  </ArrayInputWrapper>
                )}
              />
              <Row gutter={32}>
                <Col sm={24} xs={24}>
                  {this.renderRegisterBtn()}
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        {this.renderWorkExperienceModal()}
      </div>
    );
  }
}

export default ExperienceForm;
