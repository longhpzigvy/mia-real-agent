import axios from 'axios';

export const fetchMainActivities = (limit = 50, skip = 0) => axios
  .get(`/activity_logs?limit=${limit}&skip=${skip}`)
  .then(response => ({ response }))
  .catch(error => ({ error }));

export const fetchTicketActivities = ticketId => axios
  .get(`/tickets/${ticketId}/activities`)
  .then(response => ({ response }))
  .catch(error => ({ error }));

export const fetchConversationctivities = ticketId => axios
  .get(`/conversations/${ticketId}/activities`)
  .then(response => ({ response }))
  .catch(error => ({ error }));
