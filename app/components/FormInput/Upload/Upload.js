/* eslint-disable react/prop-types */
import React from 'react';
import { getIn } from 'formik';
import {
  Upload, Button, Icon, message, Modal,
} from 'antd';
import _ from 'lodash';
import { Translation } from 'react-i18next';
import { InputWrapperStyled } from '../styles';
import { UploadError } from './styles';
import { toI18n } from '../../../utils/func-utils';
import { MAX_UPLOAD_SIZE } from '../../../../common/enums';

const beforeUpload = () => false;

const uploadProps = {
  listType: 'picture',
  accept: 'image/*,.pdf',
  beforeUpload,
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class UploadInput extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  handleCancel = () => this.setState({ previewVisible: false });


  render() {
    const {
      field, // { name, value, onChange, onBlur }
      form,
      label,
      formLayout,
      onChange,
      disabled,
      ...rest
    } = this.props;
    const { errors, values = {} } = form || {};
    const { name } = field || {};

    let errorMessage = '';
    let validateStatus = 'success';

    errorMessage = getIn(errors, name);
    if (errorMessage) {
      validateStatus = 'error';
    }
    const handleChange = (e) => {
      if (_.isFunction(onChange)) {
        onChange(e);
      }
      const { file, fileList } = e;
      const { size, type } = file;
      if (size > MAX_UPLOAD_SIZE) {
        message.error(toI18n('FORM_INPUT_UPLOAD_MAX_SIZE'));
        return;
      }
      if (type.includes('pdf') || type.includes('image')) {
        form.setFieldValue(name, fileList);
        return;
      }
      message.error(toI18n('FORM_INPUT_UPLOAD_FILE_TYPE'));
    };
    const fileList = values[name];
    const { previewVisible, previewImage } = this.state;

    return (
      <InputWrapperStyled
        label={label}
        validateStatus={validateStatus}
        {...formLayout}
      >
        <Translation>
          {
            t => (
              <div>
                <Upload
                  {...uploadProps}
                  {...rest}
                  onChange={handleChange}
                  fileList={fileList}
                  onPreview={this.handlePreview}
                >
                  {!disabled && (
                    <Button>
                      <Icon type="upload" />
                      {t('FORM_INPUT_UPLOAD_PLACEHOLDER')}
                    </Button>
                  )}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <UploadError>{errorMessage}</UploadError>
              </div>
            )
          }
        </Translation>
      </InputWrapperStyled>
    );
  }
}

export default UploadInput;
