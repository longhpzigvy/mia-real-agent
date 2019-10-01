/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  ProfileUserInfoWrapper,
  ProfileUserAction,
  ProfileUserHead,
  AdditionalInformationWrapper,
  AdditionalInformationTitle,
  AdditionalInformationValue,
} from './ProfileUser.styled';
import { toI18n, isUser } from '../../../utils/func-utils';

class ProfileUser extends React.PureComponent {
  renderAdditionalInformation = () => {
    const { profile } = this.props;
    const { creditTime } = profile;
    return (
      <AdditionalInformationWrapper>
        <AdditionalInformationTitle>
          {toI18n('NAVBAR_PROFILE_CREDIT_TIME')}
        </AdditionalInformationTitle>
        <AdditionalInformationValue>
          {numeral(creditTime * 60).format('00:00:00')}
        </AdditionalInformationValue>
      </AdditionalInformationWrapper>
    );
  }

  render() {
    const {
      onLogout,
      profile,
    } = this.props;
    const { role } = profile;
    return (
      <ProfileUserInfoWrapper>
        <ProfileUserHead>
          <ProfileUserAction>
            {isUser(role) && this.renderAdditionalInformation()}
            <Link to="/profile" className="my-account">{toI18n('DB_PROFILE_MY_ACCOUNT')}</Link>
            <button className="sign-out" onClick={onLogout}>
              {toI18n('DB_PROFILE_SIGN_OUT')}
            </button>
          </ProfileUserAction>
        </ProfileUserHead>
      </ProfileUserInfoWrapper>
    );
  }
}

ProfileUser.propTypes = {
  onLogout: PropTypes.func,
  changeLanguage: PropTypes.func,
  profile: PropTypes.shape(),
  lngCode: PropTypes.string,
};

export default ProfileUser;
