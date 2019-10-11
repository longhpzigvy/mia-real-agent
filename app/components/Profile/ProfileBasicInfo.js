import React, { Component } from 'react';
import { shape } from 'prop-types';
import { Col, Row } from 'antd';
import Avatar from 'containers/Avatar';
import ProfileFormContainer from '../../containers/Profile/ProfileForm';
import ChangePasswordFormContainer from '../../containers/Profile/ChangePasswordForm/ChangePasswordFormContainer';
import { InputLabelStyled, ActionBar, RowStyled } from './styles';
import { toI18n, isAgent } from '../../utils/func-utils';
import { InputStyled } from '../FormInput/styles';
import ProfileDetail from './ProfileDetail/ProfileDetail';
import { ButtonPrimary } from '../../stylesheets/Button.style';

class ProfileBasicInfo extends Component {
  state = {
    isOpenConfirmPasswordModal: false,
    isOpenChangePasswordModal: false,
  }

  static propTypes = {
    user: shape().isRequired,
  }

  handleOpenConfirmPasswordModal = () => {
    this.setState({
      isOpenConfirmPasswordModal: true,
    });
  }

  handleCloseConfirmPasswordModal = () => {
    this.setState({
      isOpenConfirmPasswordModal: false,
    });
  }

  handleOpenChangePasswordModal = () => {
    this.setState({
      isOpenChangePasswordModal: true,
    });
  }

  handleCloseChangePasswordModal = () => {
    this.setState({
      isOpenChangePasswordModal: false,
    });
  }


  renderBasicInfo = () => {
    const {
      user: {
        role, username, email, profile,
      },
    } = this.props;
    const { avatar } = profile || {};
    return (
      <div>
        <Row gutter={32}>
          <Col span={4}>
            <Avatar avatar={avatar} />
          </Col>
          <Col span={20}>
            <RowStyled gutter={32}>
              <Col span={24}>
                <InputLabelStyled>
                  {toI18n('PROFILE_USERNAME')}
                  :
                </InputLabelStyled>
                <InputStyled value={username} />
              </Col>
            </RowStyled>
            <RowStyled gutter={32}>
              <Col span={24}>
                <InputLabelStyled>
                  {toI18n('PROFILE_EMAIL')}
                  :
                </InputLabelStyled>
                <InputStyled value={email} />
              </Col>
            </RowStyled>
          </Col>
        </Row>
        {!isAgent(role) && (<ProfileDetail role={role} profile={profile} />)}
      </div>
    );
  }

  render() {
    const { isOpenConfirmPasswordModal, isOpenChangePasswordModal } = this.state;
    const {
      user: {
        role,
      },
    } = this.props;
    return (
      <div>
        {this.renderBasicInfo()}
        <ActionBar>
          {!isAgent(role) && (
            <ButtonPrimary type="primary" onClick={this.handleOpenConfirmPasswordModal}>
              {toI18n('PROFILE_EDIT')}
            </ButtonPrimary>
          )}
          <ButtonPrimary type="primary" onClick={this.handleOpenChangePasswordModal}>
            {toI18n('PROFILE_CHANGE_PASSWORD')}
          </ButtonPrimary>
        </ActionBar>
        <ProfileFormContainer
          isOpen={isOpenConfirmPasswordModal}
          handleCancel={this.handleCloseConfirmPasswordModal}
        />
        <ChangePasswordFormContainer
          isOpen={isOpenChangePasswordModal}
          handleCancel={this.handleCloseChangePasswordModal}
        />
      </div>
    );
  }
}

export default ProfileBasicInfo;
