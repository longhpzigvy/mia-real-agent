import { fromJS } from 'immutable';

const emptyMap = fromJS({});


const getIsLoading = ({ review }, reviewId) => review.getIn(['reviews', reviewId], emptyMap).get('isLoading', false);


const getReviewById = ({ review }, reviewId) => review.getIn(['reviews', reviewId], emptyMap).toJS();

export {
  getIsLoading,
  getReviewById,
};
