import styled, { css } from 'styled-components';

export const ActionGroup = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2em;
  ${({ submit }) => submit && css`
    margin-left: auto;
    border: 1px solid ${props => props.theme.colorStyled.ColorBgDefault};
    background: ${props => props.theme.colorStyled.ColorBgDefault};
    color: ${props => props.theme.colorStyled.ColorWhite};
    i {
      margin-left: 5px;
      margin-right: 0px;
    }
  `}
`;
