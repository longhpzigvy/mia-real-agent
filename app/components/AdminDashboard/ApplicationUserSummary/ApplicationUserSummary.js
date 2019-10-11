/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React from 'react';
import { shape } from 'prop-types';
import {
  TicketActivityWrapper,
  TicketActivityLeftItem,
  TicketActivityRightItem,
  TicketActivityTitle,
} from './ApplicationUserSummary.styled';
import ApplicationSummary from '../ApplicationSummary';
import UserSummary from '../UserSummary';
import { toI18n } from '../../../utils/func-utils';

const ApplicationUserSummary = ({ applicationSummary, userSummary }) => (
  <TicketActivityWrapper>
    <TicketActivityLeftItem>
      <TicketActivityTitle>
        {toI18n('ADMIN_DASHBOARD_APPLICATIONS_SUMMARY')}
      </TicketActivityTitle>
      <ApplicationSummary applicationSummary={applicationSummary} />
    </TicketActivityLeftItem>
    <TicketActivityRightItem>
      <TicketActivityTitle>{toI18n('ADMIN_DASHBOARD_USERS_SUMMARY')}</TicketActivityTitle>
      <UserSummary userSummary={userSummary} />
    </TicketActivityRightItem>
  </TicketActivityWrapper>
);

ApplicationUserSummary.propTypes = {
  applicationSummary: shape().isRequired,
};

export default ApplicationUserSummary;
