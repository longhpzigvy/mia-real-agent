import styled from 'styled-components';

export const AvatarWrapper = styled.div`
  position: relative;
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  :hover {
    .avatar-upload-edit{
    height: 50%;
    opacity: 100;
    }
  }
  .ant-upload.ant-upload-select-picture-card > .ant-upload{
    padding-bottom: 3px;
    width: 128px;
    height: 128px;
  }
  img {
    height: 100%;
  }
`;

export const ClickToEditWrapper = styled.div.attrs({
  className: 'avatar-upload-edit',
})`
  opacity: 0;
  width: calc(100% + 5px);
  height: 0%;
  background-color: ${props => props.theme.colorStyled.ColorEdit};
  position: absolute;
  bottom: 0px;
  border-radius: 0px 0 2px 2px;
  cursor: pointer;
  transition: 0.3s;
  color: white;
  text-align: center;
  font-size: 1.3em;
  font-size: 1.1em;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    flex-direction: column;
    i {
      font-size: 1.2em;
    }
  }
`;
