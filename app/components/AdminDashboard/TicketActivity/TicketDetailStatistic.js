/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React from 'react';
import { shape } from 'prop-types';
import {
  PieChart, Pie, Cell, Tooltip,
} from 'recharts';
import {
  TicketDetailGroupActiveItem,
  TicketDetailPercent,
} from './TicketActivity.styled';
import { COLOR_BY_STATUS, TICKET_STATUS } from '../../../../common/enums';

const ChartSize = 200;
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const converData = ({
  solved, unsolved, pending, processing, idle,
}) => [{
  name: TICKET_STATUS.SOLVED,
  value: solved,
  color: COLOR_BY_STATUS.Solved,
},
{
  name: TICKET_STATUS.UNSOLVED,
  value: unsolved,
  color: COLOR_BY_STATUS.Unsolved,
},
{
  name: TICKET_STATUS.PENDING,
  value: pending,
  color: COLOR_BY_STATUS.Pending,
},
{
  name: TICKET_STATUS.PROCESSING,
  value: processing,
  color: COLOR_BY_STATUS.Processing,
},
{
  name: TICKET_STATUS.IDLE,
  value: idle,
  color: COLOR_BY_STATUS.Idle,
}];

const TicketDetailStatistic = ({ ticketActivity }) => (
  <TicketDetailGroupActiveItem>
    <TicketDetailPercent>
      <PieChart width={ChartSize} height={ChartSize}>
        <Tooltip />
        <Pie
          data={converData(ticketActivity)}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {converData(ticketActivity).map(({ color }, index) => (
            <Cell key={index} fill={color} />
          ))}
        </Pie>
      </PieChart>
    </TicketDetailPercent>
  </TicketDetailGroupActiveItem>
);

TicketDetailStatistic.propTypes = {
  ticketActivity: shape().isRequired,
};

export default TicketDetailStatistic;
