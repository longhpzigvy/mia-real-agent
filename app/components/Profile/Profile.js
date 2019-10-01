import React, { Component } from 'react';
import { func, bool, shape } from 'prop-types';
import {
  Row, Col, Divider, Tabs,
} from 'antd';
import AddCreditCard from 'containers/AddCreditCard';
import {
  ProfileWrapper, ProfileCard, ProfileTitle,
  InputStyled,
  InputLabelStyled,
  ProfileContentWrapper,
} from './styles';
import LoadingSpin from '../Loading';
import ProfileDetail from './ProfileDetail/ProfileDetail';

import { toI18n, isAgent } from '../../utils/func-utils';
import ProfileBasicInfo from './ProfileBasicInfo';
import BillingManagement from '../../containers/BillingManagement';
const { TabPane } = Tabs;

export default class Profile extends Component {
  static propTypes = {
    fetchProfile: func.isRequired,
    isFetching: bool.isRequired,
    user: shape().isRequired,
  }

  componentDidMount = () => {
    this.handleFetchDetail();
  }

  handleFetchDetail = () => {
    const { fetchProfile } = this.props;
    fetchProfile();
  }

  renderProfile = () => {
    const {
      user: {
        role, username, email, profile,
      },
    } = this.props;
    return (
      <div>
        <Row gutter={32}>
          <Col span={12}>
            <InputLabelStyled>
              {toI18n('PROFILE_USERNAME')}
              :
            </InputLabelStyled>
            <InputStyled>{username}</InputStyled>
          </Col>
          <Col span={12}>
            <InputLabelStyled>
              {toI18n('PROFILE_EMAIL')}
              :
            </InputLabelStyled>
            <InputStyled>{email}</InputStyled>
          </Col>
        </Row>
        <Divider />
        <ProfileDetail role={role} profile={profile} />
      </div>
    );
  }

  render() {
    const { isFetching, user } = this.props;
    const { role } = user;
    return (
      <ProfileWrapper>
        <ProfileCard>
          <LoadingSpin loading={isFetching}>
            <ProfileTitle>{toI18n('PROFILE_PROFILE')}</ProfileTitle>
            <Tabs>
              <TabPane tab={toI18n('PROFILE_CHANGE_BASIC_INFO')} key="1">
                <ProfileContentWrapper>
                  <ProfileBasicInfo user={user} />
                </ProfileContentWrapper>
              </TabPane>
              {!isAgent(role) && [(<TabPane tab={toI18n('PROFILE_PAYMENT_INFO_BILLING_INFO')} key="2">
                <ProfileContentWrapper>
                  <BillingManagement noHeader />
                </ProfileContentWrapper>
              </TabPane>),
              (<TabPane tab={toI18n('PROFILE_PAYMENT_INFO_PAYMENT_INFO')} key="3">
                <ProfileContentWrapper>
                  <AddCreditCard user={user} />
                </ProfileContentWrapper>
              </TabPane>)]}
            </Tabs>
          </LoadingSpin>
        </ProfileCard>
      </ProfileWrapper>
    );
  }
}
