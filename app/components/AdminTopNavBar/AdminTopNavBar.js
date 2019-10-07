import React, { PureComponent } from 'react';
import { PopupOverlayStyled } from 'components/Generals/General.styled';

import {
  HeaderAdminStyled,
  TopbarRightAdmin,
  ProfileStyled,
  ProfileImageStyled,
  UserNameAdmin,
  SettingIcon,
} from './AdminTopNavBar.styled';
import ProfileUser from '../../containers/ProfileUser';
import { DEFAULT_USER_AVATAR } from '../../../common/enums';

class AdminTopNavBar extends PureComponent {
  state = {
    isUserInfoOpen: false,
  };

  onToggleUserInfo = () => {
    this.setState(prevState => ({
      isUserInfoOpen: !prevState.isUserInfoOpen,
    }));
  };

  renderSettingIcon = () => <SettingIcon className="icon-settings" />;

  render() {
    const { isUserInfoOpen } = this.state;
    return (
      <HeaderAdminStyled>
        <TopbarRightAdmin>
          <ProfileStyled>
            <ProfileImageStyled
              src={DEFAULT_USER_AVATAR}
              onClick={this.onToggleUserInfo}
            />
            <UserNameAdmin>admin@gmail.com</UserNameAdmin>
            {isUserInfoOpen && (
              <React.Fragment>
                <PopupOverlayStyled onClick={this.onToggleUserInfo} />
                <ProfileUser onToggleUserInfo={this.onToggleUserInfo} />
              </React.Fragment>
            )}
          </ProfileStyled>
        </TopbarRightAdmin>
      </HeaderAdminStyled>
    );
  }
}

AdminTopNavBar.propTypes = {};

export default AdminTopNavBar;
