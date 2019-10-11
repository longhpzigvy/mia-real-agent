import axios from 'axios';
import { handleError } from './utils';

export const createReview = data => axios
  .post('review', data)
  .then(response => ({ response }))
  .catch(handleError);

export const getByToken = token => axios
  .post('review/token', { token })
  .then(response => ({ response }))
  .catch(handleError);

export const updateByToken = (token, application) => axios
  .post('review/update', { token, application })
  .then(response => ({ response }))
  .catch(handleError);
