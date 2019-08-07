import React from 'react';
import {
  List, Avatar, Icon,
} from 'antd';
import {
  DashboardInfoUser,
  DashboardLink,
  DashboardTime,
  DashboardDesc,
  DashboardContent,
  DashboardLeftBlock,
  DashboardRightBlock,
  DashboardSubTitle,
  DashboardLinkTitle,
  DashboardSubDesc,
} from './ActivityTab.styled';

const ActivityTab = ({ activityList }) => (
  <List itemLayout="vertical" size="large">
    {!activityList.length && 'No activity available'}
    {activityList.map(activity => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" shape="square" size={48} />}
          title={(
            <DashboardInfoUser>
              <DashboardLink href="https://ant.design">Long Hoang</DashboardLink>
              <DashboardDesc>merged a pull request in</DashboardDesc>
              <DashboardLink href="https://ant.design">ZigvyCorp/Lead-manager</DashboardLink>
              <DashboardTime>8 hours ago</DashboardTime>
            </DashboardInfoUser>
          )}
          description={(
            <DashboardContent>
              <DashboardLeftBlock>
                <Icon twoToneColor="#28a745" type="exclamation-circle" theme="twoTone" />
              </DashboardLeftBlock>
              <DashboardRightBlock>
                <DashboardSubTitle>
                  <DashboardLinkTitle>Calculating billable hours </DashboardLinkTitle>
                  <DashboardDesc>#267 </DashboardDesc>
                </DashboardSubTitle>
                <DashboardSubDesc>
                  {activity}
                </DashboardSubDesc>
              </DashboardRightBlock>
            </DashboardContent>
          )}
        />
      </List.Item>
    ))}
    {/* <List.Item>
      <List.Item.Meta
        avatar={<Avatar shape="square" icon="user" size={48} />}
        title={(
          <DashboardInfoUser>
            <DashboardLink href="https://ant.design">Long Hoang</DashboardLink>
            <DashboardDesc>pushed to</DashboardDesc>
            <DashboardLink href="https://ant.design">ZigvyCorp/Lead-manager</DashboardLink>
            <DashboardTime>8 hours ago</DashboardTime>
          </DashboardInfoUser>
        )}
        description={(
          <DashboardContent>
            <DashboardLeftBlock>
              <Icon twoToneColor="#28a745" type="exclamation-circle" theme="twoTone" />
            </DashboardLeftBlock>
            <DashboardRightBlock>
              <DashboardSubTitle>
                <DashboardLinkTitle>Calculating billable hours </DashboardLinkTitle>
                <DashboardDesc>#267 </DashboardDesc>
              </DashboardSubTitle>
              <DashboardSubDesc>
                                The report doesn't have total billable hours Implement
                                a dropdown with 2 options on 2 Weekly timesheet report screen Billable Working hour When
              </DashboardSubDesc>
            </DashboardRightBlock>
          </DashboardContent>
        )}
      />
    </List.Item>
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" shape="square" size={48} />}

        title={(
          <DashboardInfoUser>
            <DashboardLink href="https://ant.design">Long Hoang</DashboardLink>
            <DashboardDesc>opened a pull request in</DashboardDesc>
            <DashboardLink href="https://ant.design">ZigvyCorp/Lead-manager</DashboardLink>
            <DashboardTime>8 hours ago</DashboardTime>
          </DashboardInfoUser>
        )}
        description={(
          <DashboardContent>
            <DashboardLeftBlock>
              <Icon twoToneColor="#28a745" type="exclamation-circle" theme="twoTone" />
            </DashboardLeftBlock>
            <DashboardRightBlock>
              <DashboardSubTitle>
                <DashboardLinkTitle>Enhance `User-Project Timesheet Details`</DashboardLinkTitle>
                <DashboardDesc>#266 </DashboardDesc>
              </DashboardSubTitle>
              <DashboardSubDesc>
                                The report doesn't have total billable hours Implement
                                a dropdown with 2 options on 2 Weekly timesheet report screen Billable Working hour When
              </DashboardSubDesc>
            </DashboardRightBlock>
          </DashboardContent>
        )}
      />
    </List.Item> */}
  </List>
);

export default ActivityTab;
