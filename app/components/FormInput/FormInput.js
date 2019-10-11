import React from 'react';
import { Field, getIn } from 'formik';
import { func, bool, shape } from 'prop-types';
import { Translation } from 'react-i18next';
import _ from 'lodash';
import {
  Input, Checkbox, Select,
  DatePicker, Radio, InputNumber, Switch, Slider, Rate,
} from 'antd'; // eslint-disable-line import/named
import { InputStyled, InputWrapperStyled, RateWrapper, UploadWrapper, UploadHolder } from './styles';
import Upload from './Upload';

export const INPUT_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SLIDER: 'slider',
  CHECKBOX: 'checkbox',
  CHECKBOXGROUP: 'checkboxgroup',
  RADIOGROUP: 'radiogroup',
  SELECT: 'select',
  DATE_PICKER: 'datepicker',
  TEXT_AREA: 'textarea',
  SWITCH: 'switch',
  RATE: 'rate',
  RICH_EDITOR: 'rich_editor',
  UPLOAD: 'upload',
};

const FORM_LAYOUT = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24 },
};


class FormInput extends React.Component {
  static propTypes = {
    refInput: func,
    shouldRenderFeedback: bool,
    formLayout: shape(),
  }

  static defaultProps = {
    formLayout: FORM_LAYOUT,
    refInput: () => { },
    shouldRenderFeedback: true,
  }


  refFormInput = (input) => {
    const { refInput } = this.props;
    this.input = input;
    refInput(input);
  }

  renderUploadInput = props => (<Upload {...props} />);


  renderTextInput = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors },
    form,
    ...props
  }) => {
    const {
      inputSize,
      label,
      formLayout,
      onChange,
      refInput,
      shouldRenderFeedback,
      placeholderI18nKey,
      ...rest
    } = props;


    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    const handleChange = (e) => {
      if (_.isFunction(onChange)) {
        onChange(e);
      }

      field.onChange(e);
    };
    return (
      <InputWrapperStyled
        label={label}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}
        {...formLayout}
      >
        <Translation>
          {
            t => (
              <InputStyled
                ref={this.refFormInput}
                placeholder={placeholderI18nKey ? t(placeholderI18nKey) : rest.placeholder}
                {...field}
                {...rest}
                onChange={handleChange}
                size={inputSize}
              />
            )
          }
        </Translation>
      </InputWrapperStyled>
    );
  };


  renderTextArea = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors },
    ...props
  }) => {
    const {
      inputSize,
      label,
      formLayout,
      onChange,
      refInput,
      shouldRenderFeedback,
      ...rest
    } = props;

    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    const handleChange = (e) => {
      if (_.isFunction(onChange)) {
        onChange(e);
      }

      field.onChange(e);
    };

    return (
      <InputWrapperStyled
        label={label}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}

        {...formLayout}
      >
        <Input.TextArea
          {...field}
          {...rest}
          ref={this.refFormInput}
          onChange={handleChange}
          size={inputSize}
        />
      </InputWrapperStyled>
    );
  };

  renderNumberInput = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors, setFieldValue },
    ...props
  }) => {
    const {
      inputSize,
      label,
      formLayout,
      shouldRenderFeedback,
      formatter,
      parser,
      ...rest
    } = props;

    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    const handleChange = value => setFieldValue(field.name, value);


    return (
      <InputWrapperStyled
        label={label}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}

        {...formLayout}
      >
        <InputNumber
          {...field}
          formatter={formatter}
          parser={parser}
          style={{ width: '100%' }}
          onChange={handleChange}
          size={inputSize}
        />
      </InputWrapperStyled>
    );
  };

  renderRateInput = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors, setFieldValue },
    ...props
  }) => {
    const {
      inputSize,
      label,
      formLayout,
      shouldRenderFeedback,
    } = props;

    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    const handleChange = value => setFieldValue(field.name, value);
    const { value } = field;
    return (
      <InputWrapperStyled
        label={label}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}
        {...formLayout}
      >
        <RateWrapper>
          <Rate
            value={value}
            onChange={handleChange}
            size={inputSize}
          />
        </RateWrapper>
      </InputWrapperStyled>
    );
  };

  renderSliderInput = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors, setFieldValue },
    ...props
  }) => {
    const {
      inputSize,
      label,
      formLayout,
      shouldRenderFeedback,
      marks,
      defaultValue,
      min,
      max,
      ...rest
    } = props;

    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    const handleChange = value => setFieldValue(field.name, value);


    return (
      <InputWrapperStyled
        label={label}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}
        {...formLayout}
      >
        <Slider
          {...field}
          {...rest}
          min={min}
          max={max}
          style={{ width: '100%' }}
          onChange={handleChange}
          marks={marks}
          onBlur={() => { }}
          defaultValue={defaultValue}
        />
      </InputWrapperStyled>
    );
  };

  renderCheckbox = ({
    field, // { name, value, onChange, onBlur }
    form,
    ...props
  }) => {
    const {
      label,
      inputSize,
      handleChange,
      formLayout,
      labelForm,
      shouldRenderFeedback,
    } = props;
    const { touched, errors } = form;

    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    const onChange = (e) => {
      if (typeof handleChange === 'function') {
        handleChange();
      }
      field.onChange(e);
    };
    return (
      <InputWrapperStyled
        label={labelForm}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}
        {...formLayout}

      >
        <Checkbox
          {...field}
          size={inputSize}
          onChange={onChange}
          checked={_.get(form, `values.${field.name}`)}
        >
          {label}
        </Checkbox>
      </InputWrapperStyled>
    );
  };


  renderSwitch = ({
    field, // { name, value, onChange, onBlur }
    form,
    ...props
  }) => {
    const {
      label,
      inputSize,
      handleChange,
      formLayout,
      shouldRenderFeedback,
    } = props;
    const { touched, errors } = form;

    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    const onChange = (checked) => {
      if (typeof handleChange === 'function') {
        handleChange(checked);
      }
      form.setFieldValue(field.name, checked);
    };
    return (
      <InputWrapperStyled
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}
        label={label}
        {...formLayout}

      >
        <Switch
          {...field}
          size={inputSize}
          onChange={onChange}
          checked={_.get(form, `values.${field.name}`)}
        />
      </InputWrapperStyled>
    );
  };

  randerCheckBoxGroup = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors, setFieldValue },
    options,
    formLayout,
    shouldRenderFeedback,
    ...props
  }) => {
    const {
      label: fieldLabel,
      inputSize,
      handleChange,
    } = props;


    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    const onChange = (e) => {
      if (typeof handleChange === 'function') {
        handleChange();
      }
      setFieldValue(field.name, e);
    };

    return (
      <InputWrapperStyled
        label={fieldLabel}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}

        {...formLayout}
      >
        <Checkbox.Group
          {...field}
          onChange={onChange}
          size={inputSize}
        >
          {_.map(options, ({ label, value }) => (
            <Checkbox key={value} value={value}>{label}</Checkbox>
          ))}
        </Checkbox.Group>
      </InputWrapperStyled>
    );
  };

  renderRadioGroup = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors },
    options,
    formLayout,
    shouldRenderFeedback,
    ...props
  }) => {
    const {
      label: fieldLabel,
      inputSize,
      disabled,
      handleChange,
    } = props;

    const onChange = (e) => {
      if (typeof handleChange === 'function') {
        handleChange(e);
      }
      field.onChange(e);
    };

    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    return (
      <InputWrapperStyled
        label={fieldLabel}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}

        {...formLayout}
      >
        <Radio.Group
          {...field}
          size={inputSize}
          onChange={onChange}
          disabled={disabled}
        >
          {_.map(options, ({ label, value }) => (
            <Radio key={value} value={value}>{label}</Radio>
          ))}
        </Radio.Group>
      </InputWrapperStyled>
    );
  };


  renderSelect = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors },
    form,
    formLayout,
    shouldRenderFeedback,
    ...props
  }) => {
    const {
      disabled, options, handleChange, inputSize, label: fieldLabel,
    } = props; // required

    const onChange = (value) => {
      form.setFieldValue(field.name, value);
      if (typeof handleChange === 'function') {
        handleChange(value, form);
      }
    };

    let errorMessage = '';
    let validateStatus = 'success';

    errorMessage = getIn(errors, field.name);
    if (errorMessage) {
      validateStatus = 'error';
    }
    return (
      <InputWrapperStyled
        label={fieldLabel}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}
        {...formLayout}
        {...props}
      >
        <Select
          value={field.value}
          options={options}
          onChange={onChange}
          disabled={disabled}
          size={inputSize}
          {...props}
        >
          {_.map(options, ({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </InputWrapperStyled>
    );
  };

  renderDatePicker = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors, setFieldValue },
    formLayout,
    inputSize,
    label,
    shouldRenderFeedback,
    ...rest
  }) => {
    const onChange = (date) => {
      setFieldValue(field.name, date === null ? '' : date);
    };

    const isTouched = getIn(touched, field.name);
    let errorMessage = '';
    let validateStatus = 'success';

    if (isTouched) {
      errorMessage = getIn(errors, field.name);
      if (errorMessage) {
        validateStatus = 'error';
      }
    }

    return (
      <InputWrapperStyled
        label={label}
        hasFeedback={shouldRenderFeedback && validateStatus === 'error'}
        validateStatus={validateStatus}
        help={errorMessage}

        {...formLayout}
      >
        <DatePicker
          value={field.value}
          size={inputSize}
          selected={field.value}
          onChange={onChange}
          format="MM/DD/YYYY"
          {...rest}
        />
      </InputWrapperStyled>
    );
  };

  renderFormInput = (props) => {
    const { type } = props;
    switch (type) {
      case INPUT_TYPES.TEXT:
        return this.renderTextInput(props);
      case INPUT_TYPES.NUMBER:
        return this.renderNumberInput(props);

      case INPUT_TYPES.CHECKBOX:
        return this.renderCheckbox(props);

      case INPUT_TYPES.CHECKBOXGROUP:
        return this.randerCheckBoxGroup(props);

      case INPUT_TYPES.RADIOGROUP:
        return this.renderRadioGroup(props);

      case INPUT_TYPES.SELECT:
        return this.renderSelect(props);

      case INPUT_TYPES.DATE_PICKER:
        return this.renderDatePicker(props);
      case INPUT_TYPES.TEXT_AREA:
        return this.renderTextArea(props);
      case INPUT_TYPES.SWITCH:
        return this.renderSwitch(props);
      case INPUT_TYPES.SLIDER:
        return this.renderSliderInput(props);
      case INPUT_TYPES.RATE:
        return this.renderRateInput(props);

      case INPUT_TYPES.RICH_EDITOR:
        return (
          <DraftEditor {...props} />
        );
      case INPUT_TYPES.UPLOAD:
        return this.renderUploadInput(props);
      default:
        return this.renderTextInput(props);
    }
  };

  render() {
    const { regular } = this.props;
    if (regular) {
      return this.renderFormInput(this.props);
    }
    return (
      <Field
        {...this.props}
        component={this.renderFormInput}
      />
    );
  }
}

export default FormInput;
