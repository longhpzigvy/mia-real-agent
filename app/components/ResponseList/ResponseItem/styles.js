import styled from 'styled-components';
import { Row } from 'antd';

export const ResponseItemWrapper = styled(Row)`
  border: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  border-bottom: 0;
  padding: .8em 1em;
  :last-of-type{
    border-bottom: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  }
`;

export const ResponseValueWrapper = styled.div`
  > div {
     b {
       font-weight: 600;
       margin-left: .5em;
     }
  }
`;

export const ResponseActionWrapper = styled.div`
  font-size: ${props => props.theme.fontSize.BaseFontSize};
  display: flex;
  padding-top: 1em;
  justify-content: center;
  width: 100%;
  .mia-edit{
    margin-right: .5em;
    &:hover{
      color:  ${props => props.theme.colorStyled.ColorBgDefault};
    }
  }
   .mia-close{
    &:hover{
      color:  ${props => props.theme.colorStyled.ColorWarming};
    }
  }
`;

export const ParameterValue = styled.div`
  font-weight: 600;
  padding: 0 1.3em;
  line-height: 2.4em;
`;
