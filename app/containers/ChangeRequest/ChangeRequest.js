import { connect } from 'react-redux';
import ChangeRequest from 'components/ChangeRequest';
import { actions, selectors } from 'reducers/review';
import { getReviewById } from 'selectors/review';

const mapStateToProps = (state) => {
  const reviewId = selectors.getReviewFetchedId(state);
  return {
    reviewId,
    isFetching: selectors.getReviewIsFetching(state),
    isUpdating: selectors.getReviewIsUpdating(state),
    review: getReviewById(state, reviewId),
  };
};

const mapDispatchToProps = {
  fetchReview: actions.fetchReviewSingleByToken,
  updateApplication: actions.updateChangeForApplication,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeRequest);
