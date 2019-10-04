import styled, { css } from 'styled-components';
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

export const ReceiptTableRow = styled(ReceiptRow)`
  ${props => props.grid && css`
    > div {
      border-right: 1px solid ${props.theme.colorStyled.ColorBorder};
      margin-bottom: -4px;
      padding: 5px 16px;
    }
    > div:last-child{
      border-right: none;
    }
      border: 1px solid ${props.theme.colorStyled.ColorBorder};
      margin-bottom: 0;
      border-bottom: none;
      :last-of-type{
        margin-bottom: .2em;
        border-bottom: 1px solid ${props.theme.colorStyled.ColorBorder};
      }
  `}
`;

export const ReceiptCol = styled(Col)`
  ${props => props.bold && {
    fontSize: '1.2em',
  }}
  ${props => props.mega && {
    fontSize: '1.3em !important',
  }}
  ${props => props.highlight && {
    color: props.theme.colorStyled.ColorPrimary,
  }}
  text-align: ${props => props.align || 'unset'};
  ${props => props.weight && css`
      font-weight: 600;
  `}
`;
