import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { Menu, Dropdown } from 'antd';
import { toI18n } from '../../utils/func-utils';
import { LNG_CODE } from '../../utils/constants';
import { LanguageValue, LanguageWrapper, LanguageDropdownValue } from './styles';

// eslint-disable-next-line react/prefer-stateless-function
class ChangeLanguage extends Component {
  static propTypes = {
    lngCode: string.isRequired,
    changeLanguage: func.isRequired,
  }

  render() {
    const { lngCode, changeLanguage } = this.props;
    const menu = (
      <Menu>
        <Menu.Item
          key="0"
          disabled={lngCode === LNG_CODE.EN}
          onClick={() => changeLanguage(LNG_CODE.EN)}
        >
          <LanguageDropdownValue>
            {toI18n('NAVBAR_PROFILE_EN')}
          </LanguageDropdownValue>
        </Menu.Item>
        <Menu.Item
          key="1"
          disabled={lngCode === LNG_CODE.VN}
          onClick={() => changeLanguage(LNG_CODE.VN)}
        >
          <LanguageDropdownValue>
            {toI18n('NAVBAR_PROFILE_VN')}
          </LanguageDropdownValue>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <LanguageWrapper className="ant-dropdown-link">
          {toI18n('NAVBAR_PROFILE_LANGUAGE')}
          <LanguageValue>{lngCode}</LanguageValue>
        </LanguageWrapper>
      </Dropdown>
    );
  }
}

export default ChangeLanguage;
