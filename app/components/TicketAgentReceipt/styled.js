import styled from 'styled-components';
import { Row, Col } from 'antd';

export const ReceiptWrapper = styled.div`
  .ant-divider:last-of-type{
    margin-bottom: 12px;
  }
`;

export const ReceiptTitle = styled.div`
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: .2em;
`;

export const ReceiptRow = styled(Row).attrs({
  gutter: 32,
})`
  color: ${props => props.theme.colorStyled.ColorBlack};
  margin-bottom: .2em;
  div:last-child {
    text-align: end;
  }
  :last-of-type {
    margin-bottom: 0;
  }
`;

export const ReceiptCol = styled(Col)`
  ${props => props.bold && {
    fontSize: '1.2em',
  }}
  ${props => props.mega && {
    fontSize: '1.4em !important',
  }}
  ${props => props.hightlight && {
    color: props.theme.colorStyled.ColorPrimary,
  }}
  :last-of-type{
    font-size: 1.2em;
  }
`;
