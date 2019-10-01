import styled from 'styled-components';

export const SupportPanelWrapper = styled.div`
  width: 20.5%;
  padding: 1em;
  position: relative;
  border-right: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  transition: .5s;
  ${({ visiable }) => !visiable && {
    width: 0,
    paddingLeft: 0,
    paddingRight: 0,
  }}
`;

export const SupportNotiWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
  button {
    margin-top: .5em;
    font-size: 1em;
  }
`;

export const ToggleSupportPanel = styled.div`
  position: absolute;
  background: ${props => props.theme.colorStyled.ColorXDarkGrey};
  color:  ${props => props.theme.colorStyled.ColorWhite};
  right: -1.7em;
  top: 0;
  z-index: 1;
  padding: .7em .5em .7em .2em;
  border-radius: 0 .5em .5em 0;
  i {
    font-weight: 600;
  }
`;
