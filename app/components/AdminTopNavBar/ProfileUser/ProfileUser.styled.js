import styled from 'styled-components';

export const ProfileUserInfoWrapper = styled.div`
  position: absolute;
  top: 58px;
  right: -7px;
  transition: all 300ms ease-in-out;
  box-shadow: -2px 5px 10px 1px rgba(0, 0, 0, 0.176);
  width: 13em;
  z-index: 1;
  background-color: ${props => props.theme.colorStyled.ColorWhite};
`;

export const ProfileUserHead = styled.div`
  background-color: #f7f7f8;
  position: relative;
`;

export const ProfileUserAvatar = styled.div`
  width: 75px;
  height: 75px;
  margin: 20px auto 10px;
  display: flex;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 100%;
  }
`;

export const ProfileUserName = styled.div`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 15px;
  height: 30px;
  line-height: 30px;
`;

export const ProfileUserID = styled.div`
  line-height: 9.3px;
  padding: 5px 0;
  font-size: 11px;
  color: #777;
`;

export const ProfileUserEmail = styled.div`
  max-width: 100%;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: #777;
  height: 30px;
  line-height: 30px;
`;

export const ProfileUserAction = styled.div`
  line-height: 30px;
  a.my-account{
    height: 3em;
    display: flex;
    color: ${props => props.theme.colorStyled.ColorPrimary};
    justify-content: center;
    align-items: center;
    &:hover {
      color: ${props => props.theme.colorStyled.ColorPrimaryHover};
      background-color: #fff;
    }
}
  }
  button {
    padding: 0px;        
    cursor: pointer;
    background-color: transparent;
    align-items: center;
    border: none;
  }  
  .sign-out {
    color: ${props => props.theme.colorStyled.ColorPrimary};
    width:100%;
    height: 3em;
    &:hover {
      background-color: #fff;
      color: ${props => props.theme.colorStyled.ColorPrimaryHover};
    }
  }
`;

export const CloseAction = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 20px;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;

export const ProfileOrganizationWrapper = styled.div`
  padding: 8px 20px;
`;

export const ProfileOrganizationHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0px;
  span {
    text-transform: uppercase;
    font-size: 15px;
    color: #999;
  }

  a {
    text-decoration: unset;
  }
`;

export const ProfileOrganizationSetting = styled.div`
  display: flex;
  align-items: center;
  color: #206ec5;
  cursor: pointer;
  &:hover {
    color: #095cb7;
  }
  i {
    font-size: 20px;
    margin-right: 3px;
  }
`;

export const ProfileOrganizationItemWrapper = styled.div`
  max-height: 420px;
  overflow: auto;
`;

export const ProfileOrganizationItem = styled.div`
  text-align: left;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  i {
    color: #10bc83;
    font-size: 22px;
  }
`;

export const ProfileOrganizationContent = styled.div``;

export const ProfileOrganizationName = styled.div`
  font-size: 15px;
`;

export const ProfileOrganizationID = styled.div`
  font-size: 10px;
  padding: 3px 0px;
`;

export const ProfileOrganizationStatus = styled.div`
  font-size: 10px;
`;

export const AdditionalInformationWrapper = styled.div`
  padding: 1em;
  border-bottom: 1px solid ${props => props.theme.colorStyled.ColorBorder};
`;

export const AdditionalInformationTitle = styled.div`
  box-sizing: border-box;
  color: ${props => props.theme.colorStyled.ColorDarkGrey};
`;

export const AdditionalInformationValue = styled.div`
  font-weight: 600;
  font-size: 1.25em;
  color: ${props => props.theme.colorStyled.ColorBlack};
`;

export const LanguageWrapper = styled.div`
  color: ${props => props.theme.colorStyled.ColorDarkGrey};
  font-weight: 600;
`;

export const LanguageRadioWrapper = styled.div`

`;

export const LanguageRadio = styled.div`
  background-color: ${props => props.active
    ? props.theme.colorStyled.ColorBgDefault
    : props.theme.colorStyled.ColorWhite};
  color: ${props => props.active
    ? props.theme.colorStyled.ColorWhite
    : props.theme.colorStyled.ColorDarkGrey};
  border-color: ${props => props.active
    ? props.theme.colorStyled.ColorBgDefault
    : props.theme.colorStyled.ColorWhite};
`;
