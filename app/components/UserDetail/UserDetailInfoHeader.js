/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import history from 'utils/history';
import {
  TitleDetailsHead,
  AdminHeadActionGroup,
  HeaderTextDetails,
} from 'components/Generals/ItemDetail.styled';
import { Popconfirm } from 'antd';
import { toI18n } from '../../utils/func-utils';
import { ButtonDefault } from '../../stylesheets/Button.style';

class UserDetailInfoHeader extends PureComponent {
  goToEditPage = () => {
    const { userId } = this.props;
    history.push(`/admin/users/${userId}/edit`);
  };

  handleRemove = () => {
    const { removeUser, userId } = this.props;
    removeUser(userId);
  }

  render() {
    const { username } = this.props;
    return (
      <TitleDetailsHead>
        <HeaderTextDetails>
          {username}
          {/* <i className="mia-edit" onClick={this.goToEditPage} /> */}
        </HeaderTextDetails>
        <AdminHeadActionGroup>
          <Popconfirm
            title={toI18n('ADMIN_USERS_DETAIL_CONFIRM')}
            onConfirm={this.handleRemove}
            okText={toI18n('FORM_YES')}
            cancelText={toI18n('FORM_NO')}
          >
            <ButtonDefault>
              <i className="mia-close" />
              <span>{toI18n('ADMIN_USERS_DETAIL_REMOVE')}</span>
            </ButtonDefault>
          </Popconfirm>
        </AdminHeadActionGroup>
      </TitleDetailsHead>
    );
  }
}

UserDetailInfoHeader.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  removeUser: PropTypes.func.isRequired,
};

export default UserDetailInfoHeader;
