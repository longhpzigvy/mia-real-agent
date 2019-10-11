import React, { Component } from 'react';
import { Formik } from 'formik';
import { EditorState } from 'draft-js';
import { func, shape, arrayOf } from 'prop-types';
import { Form } from 'antd';
import { MessageInputWrapper, InputAction, MessageActionWrapper } from './styles';
import RichEditor from '../FormInput/RichEditor/RichEditor';
import { clearEditorContent } from '../../api/utils';

const initialValues = {
  content: EditorState.createEmpty(),
};

export class MessageInputForm extends Component {
  static propTypes = {
    onSubmit: func.isRequired,
    onChangeContent: func.isRequired,
    cannedResponses: arrayOf(shape()),
  }

  state = {
    content: EditorState.createEmpty(),
  }

  renderGroupAction = () => (
    <MessageActionWrapper>
      <InputAction className="mia-gallery" htmlFor="file-upload" />
      <InputAction className="mia-folder" htmlFor="file-upload" />
      <InputAction className="mia-camera" />
      <InputAction className="mia-happiness" />
      {/* <InputUpload type="file" id="file-upload" /> */}
    </MessageActionWrapper>
  );

  handleChatSubmit = () => {
    const {
      onSubmit,
    } = this.props;
    const { content } = this.state;
    const trimmedContent = content.getCurrentContent().getPlainText().trim();
    if (trimmedContent) {
      onSubmit(trimmedContent);
      this.formik.getFormikContext().resetForm();
      this.setState({
        content: clearEditorContent(content),
      });
    }
  }

  handleChangeContent = (content) => {
    const { onChangeContent } = this.props;
    this.setState({
      content,
    });
    onChangeContent(content);
  }


  render() {
    const { cannedResponses } = this.props;
    const { content } = this.state;
    return (
      <Formik
        ref={(formik) => { this.formik = formik; }}
        initialValues={initialValues}
        onSubmit={this.handleChatSubmit}
      >
        {({ handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
          >
            <MessageInputWrapper>
              <RichEditor
                mentions={cannedResponses.map(({ shortcut: title, content: name }) => ({
                  title,
                  name,
                }))}
                onChange={this.handleChangeContent}
                editorState={content}
                handleReturn={handleSubmit}
              />
              {this.renderGroupAction()}
              <InputAction onClick={handleSubmit} className="mia-enter" />
            </MessageInputWrapper>
          </Form>
        )}
      </Formik>
    );
  }
}

export default MessageInputForm;
