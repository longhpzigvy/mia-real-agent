import styled from 'styled-components';
import TextArea from 'antd/lib/input/TextArea';

export const ReviewInputWrapper = styled.div`
  display: flex;
  padding: .5em;
  margin: -1px;
  border: 1px solid;
  border-color: ${props => props.theme.colorStyled.ColorGrey};
  user-select: none;  
  :first-of-type{
    margin-top: 0;
  }
  + div {
   ${props => props.isRequest && {
    borderTop: `1px solid ${props.theme.colorStyled.ColorPrimary}`,
  }}
  }
  ${props => props.isRequest && {
    borderColor: props.theme.colorStyled.ColorPrimary,
  }}
    .review-input-value{
  ${props => props.isCommenting && {
    flex: '0 0 41%',
  }}
    }
`;

export const ReviewInputValueWrapper = styled.div`
  flex: 0 0 80%;
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
  }
  :hover {
    .review-input-action {
      color: ${props => props.theme.colorStyled.ColorBlackGrey};
    }
  }
`;

export const ReviewInputTitle = styled.div`
  padding: .5em;
  flex: 0 0 20%;
  border-right: 1px solid ${props => props.theme.colorStyled.ColorXXXLightGrey};
`;

export const ReviewInputValue = styled.div.attrs({
  className: 'review-input-value',
})`
  font-weight: 600;
  max-width: 750px;
  width: ${props => props.isList && '40%'};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 1em;
  > div {
    width: fit-content;
    padding: .5em;
  }
  .ant-upload-list-picture-card .ant-upload-list-item-info{
    width: 100%;
  }
  .ant-upload-list-picture-card {
    margin-left: -.5em;
  }
  ${props => props.isRequest && {
    fontWeight: 600,
  }}
`;

export const ReviewInputAction = styled.div`
  flex: 0 0 10%;
  padding: .5em;
  margin-left: .1em;
  color: ${props => props.theme.colorStyled.ColorGrey};
  .review-input-action, .comment-icon {
    :hover {
      cursor: pointer;
      color: ${props => props.theme.colorStyled.ColorBgDefault};
    }
  }
  .comment-icon {
    font-size: .8em;
    svg {
      margin-bottom: -.7em;
    }
  }
`;

export const CommentWrapper = styled.div`
  padding: .5em 1em;
  margin-top: .2em;
  flex: 1;
  display: flex;
`;

export const CommentInput = styled(TextArea)`
  flex: 0 0 50%;
  border: 1px solid ${props => props.theme.colorStyled.ColorXXXLightGrey};
  padding: .5em;
  box-shadow: none !important;
  border-radius: .5em;
`;

export const CommentAction = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: flex-end;
  padding-bottom: .3em;
  button {
    width: 100%;
    min-width: 1em;
    i {
      margin-right: 0;
    }
  }
  > i{
    margin-left: .5em;
    padding-bottom: .3em;
  }
`;

export const CommentDisplayWrapper = styled.div`
  margin: .5em;
  border-top: 1px solid;
  padding: .5em 1em;
  position: relative;
  flex: 0 0 92.5%;
  max-width: 750px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  i {
    font-size: .8em;
    float: left;
    height: 1em;
    width: 1em;
    margin-right: .8em;
    padding-top: .3em;
    cursor: unset;
  }
  .comment-action {
    position: absolute;
    right: 0;
    margin-right: .1em;
    font-size: 1.2em;
    :hover {
      cursor: pointer;
      color: ${props => props.theme.colorStyled.ColorBgDefault}
    }
  }
`;

export const ListItemWrapper = styled.div`
  width: 100% !important;
  border-bottom: 1px solid ${props => props.theme.colorStyled.ColorXXXLightGrey};
  span {
    display: flex;
  }
  :last-of-type {
    border-bottom: none;
  }
`;

export const ListFieldLabel = styled.div`
  flex: 0 0 25%;
  font-weight: 400;
`;

export const ListFieldValue = styled.div`
  flex: 0 0 75%;
  padding-left: 1.2em;
  text-overflow: ellipsis;
  font-weight: 600;
  overflow: hidden;
  .ant-upload-list-item-info {
    span {
      flex-direction: column;
    }
    img {
      margin-bottom: 0;
    }
  }
  .ant-upload-list-item-thumbnail{
    max-height: 55px;
  }
`;
