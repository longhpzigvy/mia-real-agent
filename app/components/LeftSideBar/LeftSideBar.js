import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import _reduce from 'lodash/reduce';
import _startsWith from 'lodash/startsWith';
import SidebarItem from './SideBarItem';
import AdminTopNavBar from '../../components/AdminTopNavBar';
import {
  LeftSideBarAdmin,
  SidebarToggleButton,
  SidebarBlockAdmin,
  LogoWrapper,
  Logo,
  DescLogo,
  IconToggle,
} from './LeftSidebar.styled';
import { toI18n } from '../../utils/func-utils';

const TABS_MENU = [
  {
    key: 'dashboard',
    type: 'container',
    label: toI18n('ADMIN_LEFT_NAV_DASHBOARD'),
    icon: 'mia-dashboard',
    link: '/admin/dashboard',
  },
  {
    key: 'tickets',
    type: 'container',
    label: toI18n('ADMIN_LEFT_NAV_TICKETS'),
    icon: 'mia-tickets',
    link: '/admin/tickets',
  },
  {
    key: 'tickets-warning',
    type: 'container',
    label: toI18n('ADMIN_LEFT_NAV_TICKETS_WARNING'),
    icon: 'mia-ticket',
    link: '/admin/tickets-warning',
  },
  {
    key: 'feedbacks',
    type: 'container',
    label: toI18n('ADMIN_LEFT_NAV_FEEDBACK'),
    icon: 'mia-edit',
    link: '/admin/feedbacks',
  },
  {
    key: 'applications',
    type: 'container',
    label: toI18n('ADMIN_LEFT_NAV_APPLICATIONS'),
    icon: 'mia-dashboard1',
    link: '/admin/applications',
  },
  {
    key: 'users',
    type: 'container',
    label: toI18n('ADMIN_LEFT_NAV_USERS'),
    icon: 'mia-user',
    link: '/admin/user',
  },
  {
    key: 'intents',
    type: 'container',
    label: toI18n('ADMIN_LEFT_NAV_INTENTS'),
    icon: 'mia-idea',
    link: '/admin/intents',
  },
  {
    key: 'canned-responses',
    type: 'container',
    label: toI18n('ADMIN_LEFT_NAV_CANNED_RESPONDE'),
    icon: 'mia-menu',
    link: '/admin/canned-responses',
  },
  {
    key: 'system',
    type: 'container',
    label: toI18n('ADMIN_LEFT_NAV_System'),
    icon: 'mia-hr-settings',
    link: '/admin/system',
  },
];

const paths = _reduce(
  TABS_MENU,
  (prevValue, item) => {
    const { key, link, items } = item;

    if (items && items.length > 0) {
      const itemsPath = items.map(({ link: itemLink }) => ({
        key,
        link: itemLink,
      }));

      return [...prevValue, ...itemsPath];
    }

    return [...prevValue, { key, link }];
  },
  [],
);

class LeftSideBar extends PureComponent {
  state = {
    activeItem: '',
  };

  componentDidMount() {
    this.selectTab();
  }

  componentDidUpdate(prevProps) {
    const { pathname: prevPathname } = prevProps;
    const { pathname } = this.props;


    // set active tab item
    if (prevPathname !== pathname) {
      this.selectTab();
    }
  }

  selectTab = () => {
    const { pathname } = this.props;
    const pathItem = _find(paths, path => _startsWith(pathname, path.link));

    if (pathItem) {
      const { key } = pathItem;
      this.setState({
        activeItem: key,
      });
    }
  };

  toggleContainer = (key) => {
    this.setState((prevState) => {
      const isSelected = prevState.activeItem === key;
      return {
        activeItem: isSelected ? '' : key,
      };
    });
  };

  renderLogo = () => (
    <LogoWrapper onClick={this.onLogoClick}>
      <Logo src="/assets/images/logo-small-white.png" />
      <DescLogo>
        <span>Admin</span>
        <span>Control Panel</span>
      </DescLogo>
    </LogoWrapper>
  );

  renderTabItem = (tabItem) => {
    const { pathname, toggleLeftSideBar } = this.props;
    const {
      key, label, icon, link,
    } = tabItem;
    const { activeItem } = this.state;
    return (
      <SidebarItem
        icon={icon}
        text={label}
        link={link}
        currentUrl={pathname}
        isToggle={toggleLeftSideBar}
        isActive={activeItem === key}
        key={key}
      />
    );
  };

  render() {
    const { toggleLeftSideBar, handleToggle } = this.props;
    return (
      <LeftSideBarAdmin
        isToggle={toggleLeftSideBar}
      >
        <SidebarBlockAdmin>
          <SidebarToggleButton isToggle={toggleLeftSideBar}>
            {this.renderLogo()}
            <IconToggle onClick={handleToggle} className="mia-chevron-right" />
          </SidebarToggleButton>
          <AdminTopNavBar />
          {TABS_MENU.map(this.renderTabItem)}
        </SidebarBlockAdmin>
      </LeftSideBarAdmin>
    );
  }
}

LeftSideBar.propTypes = {
  pathname: PropTypes.string,
  toggleLeftSideBar: PropTypes.bool,
  handleToggle: PropTypes.func,
};

export default LeftSideBar;
