import { DefaultButton } from 'components/Generals/General.styled';
import styled, { css } from 'styled-components';
import FormInput from '../FormInput/FormInput';
import { COLOR_BY_STATUS } from '../../../common/enums';

export const MessageBoxWrapper = styled.div`
  display: flex;
  height: calc(100vh - 8.3em);
  background: ${props => props.theme.colorStyled.ColorWhite};
  position: relative;
`;

export const MessageBoxContent = styled.div`
  flex: 1;
  height: 100%;
  color: #000;
  background-color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
`;

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
      background-color: #f5f5f5;
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

export const ConversationHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  .ant-breadcrumb-link {
    color: ${props => props.theme.colorStyled.ColorBlack};
  }

`;

export const ConversationTitle = styled.div`
  padding: 1.2em 1em;
  max-height: 60px;
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  align-items: center;
  justify-content: flex-start;
  .conv-action-bar {
    position: absolute;
    right: 1em;
  }
  span {
    font-weight: 600;
  }
  @media (max-width: 1024px) {
    max-height: 3.5em;
  }
`;

export const MessageInputWrapper = styled.div`
  /* position: absolute; */
  bottom: 0px;
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colorStyled.ColorWhite};
  border-top: 1px solid #ddd;
  height: 60px;
  width: 100%;
  padding: 0px 1em;

  .ant-form-item{
    width: 100%;
    margin: 0;
    input{
      outline: none !important;
      border: 1px solid transparent !important;
    }
  }
  button{
    margin-left: 10px;
  }
`;

export const MessageActionWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 12px 0px;
`;

export const MessageInput = styled(FormInput)`
  flex: 1;
  border: none;
  height: 100%;
  font-weight: 300;
  &::placeholder {
    font-style: normal;
    color: #ccc;
  }
`;

export const MessageEmpty = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InputAction = styled.label`
  margin-left: 15px;
  font-size: 22px !important;
  color: #b5b5b5;
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colorStyled.ColorBlack};
  }
`;

export const InputUpload = styled.input`
  display: none;
`;

export const RatingWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex: 0 0 180px;
`;

export const RatingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  ul{
    padding-left: 4px; 
  }
  form {
    width: 100%;
  }
`;

export const CommentInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colorStyled.ColorWhite};
  border-top: 1px solid #ddd;
  height: 100px;
  width: 100%;
  padding: 0px 10px;
  margin-top: 10px;
  .ant-form-item{
    width: 100%;
    margin: 0;
    input{
      outline: none !important;
      border: 1px solid transparent !important;
    }
  }
  button{
    margin-left: 10px;
  }
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

export const MessageBoxSystemNotification = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 1em;
  font-size: 0.85em;
  color: ${props => props.theme.colorStyled.ColorBlackGrey};
  opacity: .7;
  font-style: italic;
  background: ${props => props.theme.colorStyled.ColorWhite};
`;

export const FindAgentWrapper = styled.div`
  width: fit-content;
  max-width: 60%;
  display: flex;
  flex-direction: column;
  p{
    border-radius: 15px 15px 0 0;
    margin-left: 10px;  
    background-color:  ${props => props.theme.colorStyled.ColorMidGrey};
    color: ${props => props.theme.colorStyled.ColorWhite};
  }
`;

export const FindAgentButton = styled(DefaultButton)`
  border-radius: 0 0 15px 15px;
  margin-left: 10px;
  padding: 10px 10px;
  background: transparent;
  color: ${props => props.theme.colorStyled.ColorBgDefault};
  border: 1px solid ${props => props.theme.colorStyled.ColorBgDefault};
  i{
    margin-right: 5px;
  }
  :hover{
    box-shadow: none;
  }
`;

export const ConversationHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em 1.5em 1em 0;
  border-right: 1px solid ${props => props.theme.colorStyled.ColorGrey};
  height: 60px;
  width: 100%;
  flex: 0 0 20%;
  span {
    cursor: pointer;
    font-weight: 600;
    &.create-ticket{
      font-weight: 400;
      margin-left: .5em;
    }
    &:hover{
      color: ${props => props.theme.colorStyled.ColorBgDefault};
    }
  }
  ${({ search }) => search && css`
    border-bottom: none;
    width: 94%;
    @media (max-width: 840px) {
      display: none;
    }
  `};
`;

export const ConversationHeaderTitleBlock = styled.div`
  flex: 0 0 15%;
`;

export const MessageInputContent = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
`;

export const ConversationActionWrapper = styled.div.attrs({
  className: 'conv-action-bar',
})`
  display: flex;
  button {
    margin-left: 1em;
    font-size: .85em;
    border-radius: .3em;
  }
`;

export const MessageBoxBlock = styled.div`
  height: 3em;
  width: 100%;
  @media (max-width: 1024px) {
    height: 4em;
  }
`;
