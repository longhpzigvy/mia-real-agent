/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import PropTypes, { number, shape, string } from 'prop-types';
import {
  Menu, Dropdown, Icon,
  Pagination,
} from 'antd';
import _isNumber from 'lodash/isNumber';
import { DefaultButton } from 'components/Generals/General.styled';
import Ticket from '../../containers/TicketTab/Ticket';
import {
  TicketTabWrapper,
  TicketFilterWrapper,
  FilterItem,
  Filter,
  CreateItem,
  TicketPaginationWrapper,
  TicketStatus,
} from './TicketTab.styles';
import CreateTicketFormContainer from '../../containers/Chatbot/CreateTicket';
import { PAGE_SIZE, TICKET_STATUS, CATEGORY_OPTIONS } from '../../../common/enums';
import { isAgent, toI18n } from '../../utils/func-utils';
import SearchInput from '../SearchInput';

class TicketTab extends PureComponent {
  state = {
    isOpenCreateModal: false,
    statusFilter: null,
    categoryFilter: null,
  }

  componentDidMount() {
    const { fetchList, match, history } = this.props;
    const { params } = match;
    const { tab, page } = params;
    if (page) {
      fetchList({ skip: (parseInt(page, 10) - 1) * PAGE_SIZE, limit: PAGE_SIZE });
    } else {
      history.push(`/dashboard/${tab}/1`);
    }
  }

  componentDidUpdate = (prevProps, prevStates) => {
    const { fetchList, match } = this.props;
    const { statusFilter, categoryFilter } = this.state;
    const { params } = match;
    const { page } = params;
    if (prevProps.match.params.page !== page
      || prevStates.statusFilter !== statusFilter
      || prevStates.categoryFilter !== categoryFilter
    ) {
      const query = {
        status: statusFilter || { $exists: true },
        category: categoryFilter ? { $in: [categoryFilter] } : { $exists: true },
      };
      fetchList({ skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE, query });
    }
  }

  handleChangePage = (current) => {
    const { history, match } = this.props;
    const { params } = match;
    const { tab } = params;
    history.push(`/dashboard/${tab}/${current}`);
  }

  handleFilter = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  handleOpenCreateModal = () => {
    this.setState({
      isOpenCreateModal: true,
    });
  }

  handleCloseCreateModal = () => {
    this.setState({
      isOpenCreateModal: false,
    });
  }

  filterStatus = () => {
    const { statusFilter } = this.state;
    return (
      <Menu
        selectedKeys={[statusFilter || 'All']}
      >
        <Menu.Item key="All" onClick={() => this.handleFilter('statusFilter', null)}>
          <TicketStatus status={null} />
          <span>All</span>
        </Menu.Item>
        {Object.values(TICKET_STATUS).map(status => (
          <Menu.Item
            key={status}
            onClick={() => this.handleFilter('statusFilter', status)}
          >
            <TicketStatus status={status} />
            <span>{status}</span>
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  filterCategory = () => {
    const { categoryFilter } = this.state;
    return (
      <Menu
        selectedKeys={[categoryFilter || 'All']}
      >
        <Menu.Item key="All" onClick={() => this.handleFilter('categoryFilter', null)}>
          <span>All</span>
        </Menu.Item>
        {CATEGORY_OPTIONS.map(category => (
          <Menu.Item key={category.value} onClick={() => this.handleFilter('categoryFilter', category.value)}>
            <span>{category.label}</span>
          </Menu.Item>
        ))}
      </Menu>
    );
  }

  renderSelectStatus = () => (
    <Dropdown overlay={this.filterStatus} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {toI18n('DB_TICKET_STATUS')}
        <Icon type="caret-down" />
      </a>
    </Dropdown>
  )


  renderSelectCategory = () => (
    <Dropdown overlay={this.filterCategory} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {toI18n('DB_TICKET_CATEGORIES')}
        <Icon type="caret-down" />
      </a>
    </Dropdown>
  )

  renderFilterTicket = () => {
    const { userRole } = this.props;
    return (
      <TicketFilterWrapper>
        <FilterItem>
          <Filter>
            {this.renderSelectStatus()}
            {this.renderSelectCategory()}
          </Filter>
          <SearchInput />
        </FilterItem>
        {!isAgent(userRole) && (
          <CreateItem>
            <DefaultButton onClick={this.handleOpenCreateModal}>
              {toI18n('CREATE')}
              {' Ticket'}
            </DefaultButton>
          </CreateItem>
        )}
      </TicketFilterWrapper>
    );
  }

  render() {
    const { isOpenCreateModal } = this.state;
    const { totalRecord, match } = this.props;
    const { params } = match;
    const { page } = params;
    const current = parseInt(page, 0);
    return (
      <TicketTabWrapper>
        {this.renderFilterTicket()}
        <Ticket />
        <TicketPaginationWrapper>
          <Pagination
            onChange={this.handleChangePage}
            current={_isNumber(current) ? current : 0}
            showLessItems
            size="small"
            pageSize={PAGE_SIZE}
            total={totalRecord}
          />
        </TicketPaginationWrapper>
        <CreateTicketFormContainer
          isOpen={isOpenCreateModal}
          handleCancel={this.handleCloseCreateModal}
        />
      </TicketTabWrapper>
    );
  }
}

TicketTab.propTypes = {
  fetchList: PropTypes.func,
  totalRecord: number.isRequired,
  userRole: string.isRequired,
  history: shape(),
  match: shape(),
};

export default TicketTab;
