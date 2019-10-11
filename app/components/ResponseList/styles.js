import styled from 'styled-components';
import { Row } from 'antd';

export const SpinningWrapper = styled.div`
  height: calc(100vh - 150px);
`;

export const NoResposne = styled.div`
  height: calc(100vh - 150px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ResponseListHeader = styled(Row)`
  padding: .8em 1em;
`;
