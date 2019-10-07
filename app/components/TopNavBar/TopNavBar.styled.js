import styled from 'styled-components';
import { Icon, Layout, Menu } from 'antd';
const { Header } = Layout;

export const TopNavBarWrapper = styled(Header)`
  display: flex;
  height: ${props => props.theme.heightSite.heightTopNavBar};
  padding: 0px 1.5em;
  background-color: ${props => props.theme.colorStyled.ColorBlack};
  box-shadow: 0px 0px 6px -1px ${props => props.theme.colorStyled.ColorBlackSecondary};
  position: relative;
  z-index: 1;
  color: #fff;
  &.user-account {
    background-color: ${props => props.theme.colorStyled.ColorBgUser};   
    .menu-top-nav-bar{
      .menu-items-top{
         &.ant-menu-item-active{
           &:after{
             background-color: ${props => props.theme.colorStyled.ColorWhite}; 
           } 
         }
         a {
          color: ${props => props.theme.colorStyled.ColorWhite};
          &:hover{
            color: ${props => props.theme.colorStyled.ColorWhite};        
          }
        }
      }
    }
    .profile-name{
      &:hover{
        span{
          color: ${props => props.theme.colorStyled.ColorWhite};
        }
        .select-icon {
          color: ${props => props.theme.colorStyled.ColorWhite};
        }
      }
    }
  }
`;

// Logo Page Here
export const Logo = styled.div.attrs({
  className: 'logo',
})`
  flex: 0 0 90px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 15px;
  a {
    display: flex;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
      border-radius: 0;
      object-fit: contain;
      padding-bottom: 0.5em;
    }
  }
`;

// Menu Top Nav Bar Here

export const TopbarRight = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

export const MenuTopNavBar = styled(Menu).attrs({
  className: 'menu-top-nav-bar',
})`
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
  background-color: ${props => props.theme.colorStyled.ColorTransparent};
  border-color: ${props => props.theme.colorStyled.ColorTransparent};
  .menu-items-top{
    &:active{
      background: ${props => props.theme.colorStyled.ColorTransparent};
    }
    &.ant-menu-item-active{
      background: ${props => props.theme.colorStyled.ColorTransparent}!important;
      color: ${props => props.theme.colorStyled.ColorBgDefault};
      border-bottom: ${props => props.theme.colorStyled.ColorTransparent};
      position: relative;
      &:after{
        content: '';
        width: 100%;
        height: 2px;
        background-color: ${props => props.theme.colorStyled.ColorBgDefault};        
        position: absolute;
        bottom: -19px;
        left: 0;
      }     
    }
    a {
      color: ${props => props.theme.colorStyled.ColorWhite};
      &:hover{
        color: ${props => props.theme.colorStyled.ColorBgDefault};        
      }
    }
    &:hover{
      color: ${props => props.theme.colorStyled.ColorBgDefaultHover};
      border-bottom: ${props => props.theme.colorStyled.ColorTransparent};
    
    }
  }
`;

export const MenuItem = styled(Menu.Item).attrs({
  className: 'menu-items-top',
})`
  padding: 0px 15px;
  text-transform: uppercase;
  border-bottom: 2px solid transparent;
  transition: all 400ms ease;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;    
`;

// DropDown Right Top Nav Bar
export const ProfileStyled = styled.div.attrs({
  className: 'profile-name',
})`
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
  cursor: pointer;
  &:hover{
    span{
      color: ${props => props.theme.colorStyled.ColorBgDefault};
    }
    .select-icon {
      color: ${props => props.theme.colorStyled.ColorBgDefault};
    }
  }
`;

export const ProfileImageStyled = styled.img`
  height: 2.78em;
  width: 2.78em;
  cursor: pointer;
  border-radius: 100%;
`;

export const UserName = styled.div.attrs({
  className: 'drop-vienpn',
})`
  margin: 0 0.5em;
  font-weight: 400;
  font-size: 0.85em;
  color: ${props => props.theme.colorStyled.ColorBlackSecondary};
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-right: 12px;  
  span {
    display: inline-block;
    width: 100%;
    text-align: left;
    line-height: 1.250em;
    &.type-user{
      font-weight: bold;
    }
  }
  @media (max-width: 1024px) {
    font-size: 1em;
  }
`;

export const MenuStyled = styled(Icon).attrs({
  className: 'select-icon',
})`
  height: 40%;
  svg {
    color: ${props => props.theme.colorStyled.ColorBlackSecondary};
    font-size: 0.75em;
  }
`;
