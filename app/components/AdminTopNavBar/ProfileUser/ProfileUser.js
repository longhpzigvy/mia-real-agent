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
import { toI18n, isUser, isAgent } from '../../../utils/func-utils';
import { NUMERAL_MONEY_FORMAT } from '../../../utils/constants';

class ProfileUser extends React.PureComponent {
  renderUserAdditionalInformation = () => {
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

  renderAgentAdditionalInformation = () => {
    const { profile } = this.props;
    const { credit } = profile;
    return (
      <AdditionalInformationWrapper>
        <AdditionalInformationTitle>
          {toI18n('NAVBAR_PROFILE_CREDIT')}
        </AdditionalInformationTitle>
        <AdditionalInformationValue>
          {numeral(credit).format(NUMERAL_MONEY_FORMAT)}
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
            {isUser(role) && this.renderUserAdditionalInformation()}
            {isAgent(role) && this.renderAgentAdditionalInformation()}
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
  profile: PropTypes.shape(),
};

export default ProfileUser;
