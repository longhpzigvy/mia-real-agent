import axios from 'axios';

export const getAllConversation = () => axios
  .get('conversations')
  .then(response => ({ response }))
  .catch(error => ({ error }));

export const createConversation = data => axios
  .post('conversations', data)
  .then(response => ({ response }))
  .catch(error => ({ error }));

export const getConversation = id => axios
  .get(`conversations/${id}`)
  .then(response => ({ response }))
  .catch(error => ({ error }));

export const getConversationMessage = id => axios
  .get(`conversations/${id}/replies`)
  .then(response => ({ response }))
  .catch(error => ({ error }));

export const updateConversation = ({ _id, ...rest }) => axios
  .put(`conversations/${_id}`, rest)
  .then(response => ({ response }))
  .catch(error => ({ error }));

export const removeConversation = id => axios
  .delete(`conversations/${id}`)
  .then(response => ({ response }))
  .catch(error => ({ error }));

export const submitRating = (id, rating) => axios
  .post(`conversations/${id}/rating`, rating)
  .then(response => ({ response }))
  .catch(error => ({ error }));

export const fetchConversationctivities = ticketId => axios
  .get(`/conversations/${ticketId}/activities`)
  .then(response => ({ response }))
  .catch(error => ({ error }));
