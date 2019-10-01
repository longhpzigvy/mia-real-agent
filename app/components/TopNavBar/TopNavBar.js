/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import { shape } from 'prop-types';
import { Link } from 'react-router-dom';
import { Translation } from 'react-i18next';
import {
  TopNavBarWrapper,
  Logo,
  MenuTopNavBar,
  MenuItem,
  TopbarRight,
  ProfileStyled,
  ProfileImageStyled,
  UserName,
  MenuStyled,
} from './TopNavBar.styled';
import ProfileUser from '../../containers/ProfileUser';
import { PopupOverlayStyled } from '../Generals/General.styled';
import { isAgent } from '../../utils/func-utils';
import ChangeLanguage from '../../containers/ChangeLanguage/ChangeLanguage';

export default class TopNavBar extends Component {
  static propTypes = {
    user: shape().isRequired,
  };

  state = {
    isUserInfoOpen: false,
  };

  onToggleUserInfo = () => {
    this.setState(prevState => ({
      isUserInfoOpen: !prevState.isUserInfoOpen,
    }));
  };

  renderLogo = () => {
    const { user } = this.props;
    const { role } = user;
    return (
      <Logo>
        <Link to="/dashboard">
          <img
            alt="logo mia"
            src={
              isAgent(role)
                ? '/assets/images/logo-small-white.png'
                : '/assets/images/user-mia-logo.svg'
            }
          />
        </Link>
      </Logo>
    );
  };


  render() {
    const { isUserInfoOpen } = this.state;
    const { user } = this.props;
    const { email, role, profile } = user;
    const { avatar } = profile || {};
    return (
      <TopNavBarWrapper
        className={!isAgent(role) ? 'user-account' : 'agent-account'}
      >
        {this.renderLogo()}
        <MenuTopNavBar mode="horizontal">
          <MenuItem>
            <Link to="/dashboard/ticket">
              <Translation>{t => t('DB_DASHBOARD')}</Translation>
            </Link>
          </MenuItem>
        </MenuTopNavBar>
        <TopbarRight>
          <ChangeLanguage />
          <ProfileStyled>
            <ProfileImageStyled
              src={avatar || '/assets/images/user.svg'}
              onClick={this.onToggleUserInfo}
            />
            {isUserInfoOpen && (
              <React.Fragment>
                <PopupOverlayStyled onClick={this.onToggleUserInfo} />
                <ProfileUser onToggleUserInfo={this.onToggleUserInfo} />
              </React.Fragment>
            )}
            <UserName onClick={this.onToggleUserInfo}>
              <span>{email}</span>
              <Translation>
                {t => (
                  <span className="type-user">{!isAgent(role) ? t('USER') : t('AGENT')}</span>
                )}
              </Translation>
            </UserName>
            <MenuStyled type="down" onClick={this.onToggleUserInfo} />
          </ProfileStyled>
        </TopbarRight>
      </TopNavBarWrapper>
    );
  }
}
