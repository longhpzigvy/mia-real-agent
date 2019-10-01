import styled from 'styled-components';

export const LanguageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 1em;
  border-left: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  border-right: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  padding: 0 .8em;
  line-height: 3em;
`;

export const LanguageValue = styled.span`
  line-height: 0;
  text-transform: uppercase;
  font-weight: 600;
`;

export const LanguageDropdownValue = styled.span`
  font-size: 1.2em;
`;
