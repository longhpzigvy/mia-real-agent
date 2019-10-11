import React from 'react';
import { shape } from 'prop-types';
import {
  TicketActivityQuantityGroup, TicketActivityQuantityItem, TicketActivityQuantityContent, TicketActivityQuantityNumber
} from './ApplicationSummary.styled';
import { toI18n } from '../../../utils/func-utils';

const ApplicationSummary = ({ applicationSummary: { pending = 0, reviewing = 0 } }) => (
  <TicketActivityQuantityGroup>
    <TicketActivityQuantityItem>
      <TicketActivityQuantityContent>
        {toI18n('ADMIN_DASHBOARD_WAITING_FOR_REVIEW')}
      </TicketActivityQuantityContent>
      <TicketActivityQuantityNumber>
        {pending}
      </TicketActivityQuantityNumber>
    </TicketActivityQuantityItem>

    <TicketActivityQuantityItem>
      <TicketActivityQuantityContent>
        {toI18n('ADMIN_DASHBOARD_REVIEWING')}
      </TicketActivityQuantityContent>
      <TicketActivityQuantityNumber>
        {reviewing}
      </TicketActivityQuantityNumber>
    </TicketActivityQuantityItem>
  </TicketActivityQuantityGroup>
);

ApplicationSummary.propTypes = {
  applicationSummary: shape().isRequired,
};


export default ApplicationSummary;
