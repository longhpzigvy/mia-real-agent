import styled from 'styled-components';
import { COLOR_BY_STATUS } from '../../../../../common/enums';

export const TicketStatus = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 2px;
  display: inline-block;
  background: ${({ status }) => [COLOR_BY_STATUS[status]]};
`;
