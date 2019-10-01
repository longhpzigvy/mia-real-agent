import styled, { css, keyframes } from 'styled-components';
import { COLOR_BY_STATUS, COLOR_BY_ACTION } from '../../../common/enums';

export const MessageBoxItem = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
  p {
    margin-bottom: 0;
    margin-top: 3px;
    width: fit-content;
    border-radius: 20px;
    padding: 5px 12px;
    word-break: break-all;
    clear: left;
  }
  ${({ left }) => left && css`
    justify-content: flex-start;
    padding-left: 10px;
    .ant-avatar {
      margin-right: 10px;
    }
    p {
      float: left;
      background-color:  ${props => props.theme.colorStyled.ColorMidGrey};
      color: ${props => props.theme.colorStyled.ColorWhite};
    }
  `}
  ${({ right }) => right && css`
    justify-content: flex-end;
    padding-right: 10px;
    .ant-avatar {
      margin-left: 10px;
    }
    p {
      float: right;
      color: ${props => props.theme.colorStyled.ColorWhite};
      background-color: ${props => props.theme.colorStyled.ColorBgDefault};
    }
    > div{
     align-items: flex-end;
    }
  `}
  &:first-child {
    padding-top: 15px;
  }
`;

export const MessageText = styled.div`
  width: fit-content;
  max-width: 60%;
  display: flex;
  flex-direction: column;
  p{
    margin-left: 10px;  
  }
`;

export const UserMessage = styled.p`
  /* margin-right: 10px; */
  background-color: ${({ pending, theme }) => pending && `${theme.colorStyled.ColorIcon} !important`};
`;

export const TicketStatus = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
      margin-top: 2px;
  margin-right: 10px;
  background: ${({ status }) => [COLOR_BY_STATUS[status]]};
`;

export const TicketActionStatus = styled(TicketStatus)`
  margin: 0 5px;
`;

export const TicketActionStatusTitle = styled.span`
  font-weight: 600;
  font-style: italic;
  color: ${({ status }) => [COLOR_BY_STATUS[status]]};
`;

export const TicketRatingScore = styled.span`
  font-weight: 600;
  font-style: italic;
  color: ${props => props.theme.colorStyled.ColorRatingStar};
  font-size: 1.5em;
  margin: 0 5px;
`;

export const UserAction = styled.span`
  font-weight: 600;
  font-style: italic;
  color: ${({ action }) => [COLOR_BY_ACTION[action]]};
`;

export const MessageBoxSystemNotification = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 1em;
  font-size: 0.85em;
  color: #828282;
  opacity: .7;
  font-style: italic;
  :first-of-type{
    margin-top: 1em;
  }
`;
export const LineDivider = styled.span`
    display: flex;
    align-items: center;
    flex: 0 0 20%;
    background-color: ${props => props.theme.colorStyled.ColorBorder};
    justify-content: center;
    font-size: 0.75em;
    color: ${props => props.theme.colorStyled.ColorBorder};
    margin: 0 2em;
    height: 1px;
    opacity: .7;
`;

const loading = keyframes`
  0% {
    color: ${props => props.theme.colorStyled.ColorMidGrey};
  }

  50% {
    color: ${props => props.theme.colorStyled.ColorGrey};
  }
`;

export const MessageBoxItemIsTyping = styled(MessageBoxItem)`
  img{
    margin-bottom: 20px;
  }
`;

export const IsTypingWrapper = styled.div`
  animation: ${loading} 2s linear infinite;
  margin-left: 5px;
  ::before{
    content: 'Typing...'
  }
`;

export const ProfileImageStyled = styled.img`
<<<<<<< HEAD
  height: 2.78em;
  width: 2.78em;
=======
  height: 2.2em;
>>>>>>> Update Billing model
  cursor: pointer;
  border-radius: 100%;
`;

export const CommentWrapper = styled.div`
  text-align: center;
  color: ${props => props.theme.colorStyled.ColorComment};
  font-weight: 600;
`;

export const UserLabelWarning = styled.div`
  font-weight: 600;
  font-style: italic;
  color: ${props => props.theme.colorStyled.ColorUserLabel};
  width: 100%;
  text-align: ${({ user }) => user ? 'end' : 'start'};
`;
