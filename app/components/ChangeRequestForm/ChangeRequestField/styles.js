import styled from 'styled-components';

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
  flex: auto;
  display: flex;
  margin-right: -.5em;
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 600;
  padding-left: 1em;
  > div {
    width: fit-content;
    padding: .5em;
    display: flex;
    width: 100%;
    > div > i, > i {
      font-size: .7em;
      color: ${props => props.theme.colorStyled.ColorBgDefault};
      ${props => props.isList && {
    marginLeft: '-7em',
  }}
      svg {
        margin-bottom: -1.2em;
        height: 3em;
        margin-left: .5em;
      }
    }
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
  ${props => props.isList && {
    width: '100%',
  }}
`;

export const ReviewInputAction = styled.div`
  flex: 0 0 10%;
  padding: .5em;
  margin-left: .1em;
  color: ${props => props.theme.colorStyled.ColorGrey};
  .review-input-action {
    font-size: 1em;
    :hover {
      cursor: pointer;
      color: ${props => props.theme.colorStyled.ColorBgDefault};
    }
  }

`;

export const CommentWrapper = styled.div`
  padding: .5em 1em;
  margin-top: .2em;
  flex: 1;
  display: flex;
  color: ${props => props.theme.colorStyled.ColorBgDefault};
  i {
    font-size: .7em;
    margin-left: 0 !important;
    svg {
      margin-bottom: -.5em;
      height: 3em;
    }
  }
`;

export const CommentDisplayWrapper = styled.div`
  margin: .5em;
  position: relative;
  flex: 0 0 52.5%;
  max-width: 750px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  i {
    float: left;
    height: 1em;
    width: 1em;
    margin-right: .8em;
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
  span {
    display: flex;
  }
  > div {
    margin-bottom: 1em;
    border-bottom: 1px solid ${props => props.theme.colorStyled.ColorXXXLightGrey};
    padding-bottom: .2em;
    width: 100%;
    .ant-row{
      margin-bottom: .2em;
    }
  }
`;

export const ListFieldLabel = styled.div`
  flex: 0 0 30%;
  font-weight: 400;
`;

export const ListFieldValue = styled.div`
  flex: 0 0 70%;
  font-weight: 600;
  text-overflow: ellipsis;
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

export const ChangeInputWrapper = styled.div`
  padding-left: 1.2em;
  flex: auto;
  button {
    margin: .2em 0;
    font-size: 1em;
  }
  .review-input-value{
    padding-left: 0;
    margin-left: -.5em;
  }
`;

export const ListItemActionGroup = styled.div`
  i {
    font-size: 1.2em;
    margin-left: .5em;
    font-size: 1em;
  }
`;
