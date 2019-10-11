import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import { shape, func, arrayOf } from 'prop-types';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';


import './editorStyles.css';
import 'draft-js-mention-plugin/lib/plugin.css';

const Entry = (props) => {
  const {
    mention,
    ...parentProps
  } = props;


  delete parentProps.searchValue;
  delete parentProps.isFocused;

  return (
    <div {...parentProps}>
      <div className="mentionSuggestionsEntryContainer">
        <div className="mentionSuggestionsEntryContainerRight">
          <div className="mentionSuggestionsEntryText">
            {mention.name}
          </div>
          <div className="mentionSuggestionsEntryTitle">
            {mention.title}
          </div>
        </div>
      </div>
    </div>
  );
};

Entry.propTypes = {
  mention: shape().isRequired,
};


class RichEditor extends Component {
  static propTypes = {
    onChange: func.isRequired,
    editorState: shape().isRequired,
    mentions: arrayOf(shape({})).isRequired,
    t: func.isRequired,
    handleReturn: func.isRequired,
  }

  constructor(props) {
    super(props);

    this.mentionPlugin = createMentionPlugin({
      positionSuggestions: settings => ({
        left: `0`,
        top: `0`,
        display: 'absolute',
        transform: 'scale(1) translateY(-100%)',
        transformOrigin: '1em 0% 0px',
        transition: 'all 0.25s cubic-bezier(0.3, 1.2, 0.2, 1)',
      }),
    });
  }

  state = {
    suggestions: [],
  };

  mentionIsOpen = false;


  onChange = (editorState) => {
    const { onChange } = this.props;
    onChange(editorState);
  };

  onSearchChange = ({ value }) => {
    const { mentions } = this.props;
    let suggestions = [...mentions];
    if (value) {
      const regex = new RegExp(value, 'i');
      suggestions = mentions.filter(({ name, title }) => regex.test(name) || regex.test(title));
    }
    this.setState({
      suggestions,
    });
  };

  onAddMention = () => {
    // get the mention object selected
  }

  focus = () => {
    this.editor.focus();
  };

  handleOpenMention = () => {
    this.mentionIsOpen = true;
  }

  handleCloseMention = () => {
    this.mentionIsOpen = false;
  }

  handleReturn = (e) => {
    e.preventDefault();
    const { handleReturn } = this.props;
    if (!this.mentionIsOpen) {
      handleReturn();
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    const { editorState, t } = this.props;
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.mentionPlugin];

    return (
      <div style={{ width: '100%' }} role="presentation" className="editor" onClick={this.focus}>
        <Editor
          placeholder={t('CONV_MESSAGE_BOX_TYPE_MESSAGE')}
          editorState={editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element; }}
          handleReturn={this.handleReturn}
        />
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          onAddMention={this.onAddMention}
          entryComponent={Entry}
          onOpen={this.handleOpenMention}
          onClose={this.handleCloseMention}
        />
      </div>
    );
  }
}

export default withTranslation()(RichEditor);
