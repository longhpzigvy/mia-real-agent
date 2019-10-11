import styled from 'styled-components';
import { Modal, Row } from 'antd';

export const ModalStyled = styled(Modal)`
  width: 800px !important;
`;

export const ErrorMessage = styled.h2`
  color: red;
`;

export const ParameterListWrapper = styled(Row)`
  > div:nth-of-type(2n+1){
    padding-right: 8px !important;
  }
  > div:nth-of-type(2n+2){
    padding-left: 8px !important;
  }
`;

export const ParameterWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.colorStyled.ColorBorder};
  border-radius: 5px;
  padding: .5em 1em;
  i {
    width: 100%;
    text-align: right;
  }
  margin-top: 1em;
  :last-of-type {
    margin-bottom: 1em;
  }
`;

export const ParameterTitle = styled.div`
  flex: 0 0 20%;
`;

export const ParameterValue = styled.div`
  margin-right: .5em;
  font-weight: 600;
  flex: 0 0 70%;
`;

export const ParameterFormActionGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 1.5em;
  height: 4em;
  i:hover{
    color: ${props => props.theme.colorStyled.ColorPrimary};
  }
`;
