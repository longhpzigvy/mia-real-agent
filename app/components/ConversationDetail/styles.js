import styled, { css } from 'styled-components';
import { COLOR_BY_STATUS } from '../../../common/enums';

export const ChatbotWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

export const ChatbotConversationListWrapper = styled.div`
  flex: 0 0 400px;
  color: ${props => props.theme.colorStyled.ColorBlack};
  background-color: ${props => props.theme.colorStyled.ColorWhite};
  border-right: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  transition: all 200ms ease;
  .ant-input-search {
    .ant-input {
      background-color: #f5f6f7;
      border: none;
      &::placeholder {
        font-style: normal;
        color: #ccc;
      }
    }
  }
  .ant-menu {
    height: 100%;
    border-right: none;
    li {
      display: flex;
      align-items: center;
      height: 85px;
    }
  }
  .ant-menu-item {
    line-height: normal;
    color: ${props => props.theme.colorStyled.ColorBlack};
    &:hover {
      color: ${props => props.theme.colorStyled.ColorBlack};
      background-color: #f5f6f7 !important;
      border-bottom: 1px solid ${props => props.theme.colorStyled.ColorBorder};
      .anticon-setting {
        visibility: visible;
      }
    }
    .anticon {
      margin-right: 0px;
      margin-top: 5px;
    }
  }
  .ant-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    margin-right: 10px;
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    color: ${props => props.theme.colorStyled.ColorBlack};
    background-color: #f5f6f7;
    border-bottom: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  }
  .ant-tabs-bar {
    margin: 0px 25px;
    border-bottom: none;
  }
  .ant-tabs-nav {
    width: 100%;
    > div {
      display: flex;
    }
    .ant-tabs-tab {
      flex: 1;
      text-align: center;
      margin: 0px;
      color: ${props => props.theme.colorStyled.ColorBlack};
      opacity: 0.6;
      &:hover {
        color: ${props => props.theme.colorStyled.ColorBlack};
        opacity: 1;
      }
    }
    .ant-tabs-tab-active {
      color: ${props => props.theme.colorStyled.ColorBlack};
      font-weight: bold;
      opacity: 1;
    }
    .ant-tabs-ink-bar {
      background-color: ${props => props.theme.colorStyled.ColorBlack};
    }
  }
  @media (max-width: 1500px) {
    flex: 0 0 25%;
  }
  @media (max-width: 1024px) {
    flex: 0 0 250px;
  }
  @media (max-width: 840px) {
    flex: 0 0 60px;
    .ant-avatar {
      margin-right: 0px;
    }
    .ant-menu {
      li {
        justify-content: center;
        height: 54px;
      }
    }
    .ant-menu-vertical {
      .ant-menu-item {
        padding: 0 8px;
      }
    }
  }
`;

export const ChatbotConversationDetailWrapper = styled(ChatbotConversationListWrapper)`
  border-left: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  @media (max-width: 1500px) {
    flex: 0 0 30%;
  }
  @media (max-width: 1024px) {
    flex: 0 0 250px;
  }
`;

export const ChatbotContentWrapper = styled.div`
  flex: 1;
  .ant-breadcrumb {
    background-color: ${props => props.theme.colorStyled.ColorWhite};
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border-bottom: 1px solid #ddd;
  }
`;

export const ConversationHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 24px;
  height: 60px;
  border-bottom: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  span {
    font-weight: 700;
  }
  ${({ search }) => search && css`
    border-bottom: none;
    @media (max-width: 840px) {
      display: none;
    }
  `};
`;

export const ConversationGroup = styled.div`
  flex: 1;
  line-height: normal;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ConversationName = styled.div`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 5px;
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ConversationTime = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: normal;
  i {
    &:hover {
      color: #f9ba59;
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ConversationStatus = styled.div`
  span {
    font-size: 13px;
    &:first-child {
      padding-right: 10px;
    }
    &:last-child {
      padding: 10px;
      ${({ status }) => status
    && css`
        font-style: italic;
        color: ${[COLOR_BY_STATUS[status]]};
        opacity: 0.8;
      `};
    } 
  }

`;

export const ConversationGroupAction = styled.div``;

export const ConversationButton = styled.div`
  padding: 6px 15px;
  cursor: pointer;
  &:hover {
    background-color: #279cd4;
    color: ${props => props.theme.colorStyled.ColorWhite};
  }
`;

export const ConversationEmpty = styled.div`
  padding: 15px;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
`;

export const ConversationDetailWrapper = styled.div``;

export const ConversationDetailAvatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px 15px;
  img {
    object-fit: cover;
    object-position: center;
  }
`;

export const ConversationInfoWrapper = styled.div`
  .assignee{
    span{
      display: inline-block;
      width: 100%;
      font-weight: 600;
      &.company{
        font-weight: 400;
      }
    }
    
  }
  .ant-descriptions-row {
    display: flex;
    flex-direction: column;
    padding: 0px 20px 25px;
    border-bottom: 1px solid ${props => props.theme.colorStyled.ColorBorder} !important;
    > td {
      padding-bottom: 16px;
      padding-top: 16px;
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid ${props => props.theme.colorStyled.ColorBorder};
      &:last-child {
        border-bottom: none;
      }
        .ant-descriptions-item-label {
        font-size: .8em;
        margin-bottom: .5em;
        color: #808080;
        &:after {
          content: none;
        }
      }
      .ant-descriptions-item-content {
        font-size: 1em;
        color: ${props => props.theme.colorStyled.ColorBlack};
      }
    }
    @media (max-width: 1024px) {
      padding: 15px;
    }
  }
`;

export const ConversationTimelineWrapper = styled.div`
  padding: 20px 25px;
  .ant-timeline-item-content {
    margin: 0px 0x 0px 25px;
  }
  .ant-timeline-item {
    padding: 0 0 30px;
  }
  @media (max-width: 1024px) {
    padding: 15px;
    .ant-timeline-item {
      padding: 0 0 15px;
    }
  }
`;

export const TicketStatus = styled.div`
  width: 10px;
  height: 10px;
  margin-top: 2px;
  border-radius: 50%;
  margin-right: 10px; 
  display: inline-block;
  background: ${({ status }) => [COLOR_BY_STATUS[status]]};
`;

export const NoInformationText = styled.span`
  color: red;
`;
