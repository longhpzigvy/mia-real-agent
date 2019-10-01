import React, { Component } from 'react';
import { Icon } from 'antd';
import { SupportPanelWrapper, ToggleSupportPanel, SupportNotiWrapper } from './styles';
import { ButtonPrimary } from '../../stylesheets/Button.style';

class SupportPanel extends Component {
  state = {
    visiable: true,
  }

  toggleVisibility = (isOpen) => {
    this.setState({
      visiable: isOpen,
    });
  }

  render() {
    const { visiable } = this.state;
    return (
      <SupportPanelWrapper visiable={visiable}>
        <ToggleSupportPanel>
          <Icon
            type={visiable ? 'left' : 'right'}
            onClick={() => this.toggleVisibility(!visiable)}
          />
        </ToggleSupportPanel>
        <SupportNotiWrapper>
          Having trouble with ticket?
          <ButtonPrimary>
            <Icon type="search" />
            Find Support
          </ButtonPrimary>
        </SupportNotiWrapper>
      </SupportPanelWrapper>
    );
  }
}

export default SupportPanel;
