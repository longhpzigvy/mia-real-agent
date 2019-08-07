import React, { Component } from 'react';
import {
  Row, Col, Tabs,
} from 'antd';
import { shape } from 'prop-types';
import ShadowScrollbars from 'components/Scrollbar';
import Activity from 'containers/ActivityTab';
import TicketTab from 'containers/TicketTab';
import {
  DashboardContainer,
  DashboardItem,
} from './Dashboard.styled';

const { TabPane } = Tabs;

const scrollStyle = {
  height: 'calc(100vh - 65px)',
  width: '100%',
};

const TAB = {
  Activity: 'activity',
  Ticket: 'ticket',
};

export default class Dashboard extends Component {
  state = {
    activeTab: '',
  }

  static propTypes = {
    match: shape().isRequired,
    history: shape().isRequired,
  }

  componentDidMount = () => {
    const { match, history } = this.props;
    const { params } = match;
    const { tab } = params;
    if (!tab) {
      history.push(`/dashboard/${TAB.Ticket}/1`);
    } else {
      this.setState({
        activeTab: tab,
      });
    }
  }

  componentDidUpdate = (prevProps) => {
    const { match } = this.props;
    const { params } = match;
    const { tab } = params;
    if (prevProps.match.params.tab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  renderActivityItem = () => (
    <TabPane tab="Activity" key={TAB.Activity}>
      <Activity />
    </TabPane>
  )

  renderTicketItem = () => (
    <TabPane tab="Ticket" key={TAB.Ticket}>
      <TicketTab />
    </TabPane>
  )

  handleChangeTab = (activeTab) => {
    const { history } = this.props;
    history.push(`/dashboard/${activeTab}`);
  }

  render() {
    const { activeTab } = this.state;
    return (
      <ShadowScrollbars
        autoHide
        style={scrollStyle}
      >
        <DashboardContainer>
          <DashboardItem>
            <Row type="flex" justify="center" style={{ height: '100%' }}>
              <Col span={20}>
                <Tabs
                  activeKey={activeTab}
                  style={{ height: '100%' }}
                  onChange={this.handleChangeTab}
                >
                  {this.renderTicketItem()}
                  {this.renderActivityItem()}
                </Tabs>
              </Col>
            </Row>
          </DashboardItem>
        </DashboardContainer>
      </ShadowScrollbars>
    );
  }
}
