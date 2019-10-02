/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _get from 'lodash/get';
import {
  OverviewLeftSectionWrapper,
  OverviewTitle,
  OverviewProduct,
  AdminInfoContentBlock,
  OverviewLabel,
  OverviewValue,
  AdminUserDetailsGroup,
  AdminUserDetailsLeft,
  AdminUserDetailsRight,
} from 'components/Generals/ItemDetail.styled';
import { DATE_TIME_FORMAT, COLUMN_TYPE } from 'utils/constants';
import TableDetail from 'components/Generals/TableDetail';
import { ROLES } from '../../../common/enums';
import { isAgent, toI18n } from '../../utils/func-utils';

const defaultColumns = [
  {
    headerPropertise: {
      value: toI18n('ADMIN_USERS_DETAIL_TICKET_TABLE_TICKET_ID'),
      percent: 3,
    },
    contentPropertise: {
      percent: 3,
    },
    dataKey: 'ticketId',
    type: COLUMN_TYPE.TEXT,
  },
  {
    headerPropertise: {
      value: toI18n('ADMIN_USERS_DETAIL_TICKET_TABLE_CREATED_AT'),
      percent: 10,
    },
    contentPropertise: {
      percent: 10,
    },
    dataKey: 'createdAt',
    type: COLUMN_TYPE.DATE,
    format: DATE_TIME_FORMAT.DATE_TIME,
  },
  {
    headerPropertise: {
      value: toI18n('ADMIN_USERS_DETAIL_TICKET_TABLE_CATEGORY'),
      percent: 10,
    },
    contentPropertise: {
      percent: 10,
    },
    dataKey: 'category',
    type: COLUMN_TYPE.TEXT,
  },
  {
    headerPropertise: {
      value: toI18n('ADMIN_USERS_DETAIL_TICKET_TABLE_TITLE'),
      percent: 10,
    },
    contentPropertise: {
      percent: 10,
    },
    dataKey: 'title',
    type: COLUMN_TYPE.TEXT,
  },
];

class UserDetailInfoContent extends PureComponent {
  renderOverviewInfo = (label, value, isLink = false) => (
    <OverviewProduct link={isLink}>
      <OverviewLabel>{label}</OverviewLabel>
      <OverviewValue>{value || '-'}</OverviewValue>
    </OverviewProduct>
  );

  renderItemProfile = () => {
    const {
      userDetail = {},
    } = this.props;
    const { role = ROLES.INDIVIDUAL } = userDetail;

    switch (role) {
      case ROLES.BUSINESS:
        return this.renderBusinessProfile();
      case ROLES.AGENT:
        return this.renderAgentProfile();
      case ROLES.INDIVIDUAL:
      default:
        return this.renderIndividualProfile();
    }
  };

  renderIndividualProfile = () => {
    const { userDetail = {} } = this.props;
    const { profile = {} } = userDetail;
    const {
      firstName, lastName, position, dateOfBirth, company, phone, address,
    } = profile;

    const dateOfBirthFormat = dateOfBirth
      ? moment(dateOfBirth).format(DATE_TIME_FORMAT.DATE)
      : '-';

    return (
      <OverviewLeftSectionWrapper>
        <OverviewTitle>{toI18n('ADMIN_USERS_DETAIL_COMPANY')}</OverviewTitle>
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_FIRST_NAME'), firstName)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_LAST_NAME'), lastName)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_PHONE'), phone)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_BIRTH'), dateOfBirthFormat)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_ADDRESS'), address)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_COMPANY'), company)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_POSITION'), position)}
      </OverviewLeftSectionWrapper>
    );
  }

  renderBusinessProfile = () => {
    const { userDetail = {} } = this.props;
    const { profile = {} } = userDetail;
    const {
      company, phone, address, companySize, companyFields,
    } = profile;
    const companyFieldsFormat = companyFields.join(', ');

    return (
      <OverviewLeftSectionWrapper>
        <OverviewTitle>{toI18n('ADMIN_USERS_DETAIL_PROFILE')}</OverviewTitle>
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_COMPANY'), company)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_PHONE'), phone)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_SIZE'), companySize)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_FIELDS'), companyFieldsFormat)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_ADDRESS'), address)}
      </OverviewLeftSectionWrapper>
    );
  }

  renderAgentProfile = () => {
    const { userDetail = {} } = this.props;
    const { applicationInfo } = userDetail;
    const {
      firstName = '', lastName = '', address = '', country = '', phone = '',
      skills = [],
    } = applicationInfo || {};

    const skillsFormat = skills.join(', ');

    return (
      <OverviewLeftSectionWrapper>
        <OverviewTitle>{toI18n('ADMIN_USERS_DETAIL_PROFILE')}</OverviewTitle>
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_FIRST_NAME'), firstName)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_LAST_NAME'), lastName)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_SKILLS'), skillsFormat)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_PHONE'), phone)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_ADDRESS'), address)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_COUNTRY'), country)}
      </OverviewLeftSectionWrapper>
    );
  }

  renderItemOverview = () => {
    const {
      userDetail: { username, email },
    } = this.props;
    return (
      <OverviewLeftSectionWrapper>
        <OverviewTitle>{toI18n('ADMIN_USERS_DETAIL_PRIMARY_DETAILS')}</OverviewTitle>
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_USERNAME'), username, true)}
        {this.renderOverviewInfo(toI18n('ADMIN_USERS_DETAIL_EMAIL'), email)}
      </OverviewLeftSectionWrapper>
    );
  };

  renderTicketsTable = () => {
    const { userDetail = {} } = this.props;
    const { role = ROLES.INDIVIDUAL } = userDetail;
    const tickets = _get(userDetail, 'tickets', []);
    let columns = [];

    if (role === ROLES.INDIVIDUAL || role === ROLES.BUSINESS) {
      columns = [
        ...defaultColumns,
        {
          headerPropertise: {
            value: toI18n('ADMIN_USERS_DETAIL_TICKET_TABLE_ASSIGNEE'),
            percent: 10,
          },
          contentPropertise: {
            percent: 10,
          },
          dataKey: 'assignee.username',
          type: COLUMN_TYPE.TEXT,
        },
        {
          headerPropertise: {
            value: 'Status',
          },
          contentPropertise: {
          },
          dataKey: 'status',
          type: COLUMN_TYPE.STATUS,
        },
      ];
    } else if (isAgent(role)) {
      columns = [
        ...defaultColumns,
        {
          headerPropertise: {
            value: toI18n('ADMIN_USERS_DETAIL_TICKET_TABLE_OWNER'),
            percent: 10,
          },
          contentPropertise: {
            percent: 10,
          },
          dataKey: 'owner.username',
          type: COLUMN_TYPE.TEXT,
        },
        {
          headerPropertise: {
            value: 'Status',
          },
          contentPropertise: {
            percent: 10,
            size: '100',
          },
          dataKey: 'status',
          type: COLUMN_TYPE.STATUS,
        },
      ];
    }

    return <TableDetail columns={columns} items={tickets} emptyMsg="No tickets available" />;
  }

  render() {
    return (
      <AdminInfoContentBlock>
        <AdminUserDetailsGroup>
          <AdminUserDetailsLeft>
            {this.renderItemProfile()}
          </AdminUserDetailsLeft>
          <AdminUserDetailsRight>
            {this.renderItemOverview()}
          </AdminUserDetailsRight>
        </AdminUserDetailsGroup>
        {this.renderTicketsTable()}
      </AdminInfoContentBlock>
    );
  }
}

UserDetailInfoContent.propTypes = {
  userDetail: PropTypes.object.isRequired,
};

export default UserDetailInfoContent;
