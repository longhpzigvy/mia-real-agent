import {
  func, string, bool, shape,
} from 'prop-types';
import _keyBy from 'lodash/keyBy';
import React, { Component } from 'react';
import ReviewForm from '../ReviewForm';
import { ButtonPrimary, ButtonDefault } from '../../stylesheets/Button.style';
import {
  ReivewFormWrapper, ReviewFormHeader,
  ReviewFormRequestChangeWrapper,
  ReviewFormActionGroupRight,
} from './styles';
import LoadingSpin from '../Loading';
import { flatApplicationForm, toI18n } from '../../utils/func-utils';
import { APPLICATION_REVIEW_MAPPING } from '../../utils/constants';

class ApplicationReview extends Component {
  state = {
    applicationReviewForms: {},
  }

  static propTypes = {
    applicationId: string.isRequired,
    applicationDetail: shape().isRequired,
    reviewSubmit: func.isRequired,
    applicationApprove: func.isRequired,
    applicationReject: func.isRequired,
    toggleReview: func.isRequired,
    isSubmitting: bool.isRequired,
  }

  componentDidMount = () => {
    const { applicationDetail } = this.props;
    const flattedFields = flatApplicationForm(applicationDetail, APPLICATION_REVIEW_MAPPING);
    this.setState({
      applicationReviewForms: flattedFields,
    });
    this.reviewForm.setDefaultFields(flattedFields);
  }

  handleOnchange = () => {
    const { applicationReviewForms } = this.state;
    const form = this.reviewForm;
    const fields = form.getFields();
    this.setState({
      applicationReviewForms: {
        ...applicationReviewForms,
        ...fields,
      },
    });
  }

  getTotalRequestedChange = () => {
    const { applicationReviewForms } = this.state;
    const totalChange = Object.values(applicationReviewForms).filter(({ comment }) => comment).length;
    const { toggleReview } = this.props;
    if (totalChange > 0) {
      toggleReview(true);
    } else {
      toggleReview(false);
    }
    return totalChange;
  }

  handleApprove = () => {
    const { applicationApprove, applicationId } = this.props;
    applicationApprove({ _id: applicationId });
  }

  handleReject = () => {
    const { applicationReject, applicationId } = this.props;
    applicationReject({ _id: applicationId });
  }

  handleRequestChange = () => {
    const { reviewSubmit, applicationId } = this.props;
    const { applicationReviewForms } = this.state;
    // Filter fields with comment
    const filtered = _keyBy(
      Object.keys(applicationReviewForms)
        .map(key => ({ ...applicationReviewForms[key], name: key }))
        .filter(({ comment }) => comment)
        .map((field) => {
          const {
            name,
            ref, value, comment, type,
          } = field;
          let refValues = null;
          if (ref) {
            refValues = _keyBy(ref.map(fieldName => ({
              name: fieldName,
              value: applicationReviewForms[fieldName].value,
            })), 'name');
          }
          return {
            name, value, comment, type, ref: refValues,
          };
        }),
      'name'
    );
    reviewSubmit(filtered, applicationId);
  }

  renderActionGroup = () => {
    const totalRequest = this.getTotalRequestedChange();
    return (
      <ReviewFormActionGroupRight>
        <ButtonDefault
          onClick={this.handleReject}
        >
          {toI18n('APPLICATION_REVIEW_REJECT')}
        </ButtonDefault>
        <ButtonPrimary
          onClick={totalRequest > 0 ? this.handleRequestChange : this.handleApprove}
        >
          {totalRequest > 0
            ? toI18n('APPLICATION_REVIEW_REQUEST_CHANGE')
            : toI18n('APPLICATION_REVIEW_APPROVE')}
        </ButtonPrimary>
      </ReviewFormActionGroupRight>
    );
  }

  render() {
    const { applicationDetail, isSubmitting } = this.props;
    const { isLoading = false } = applicationDetail;
    const { applicationReviewForms } = this.state;
    return (
      <ReivewFormWrapper>
        <LoadingSpin loading={isLoading || isSubmitting}>
          <ReviewFormHeader>
            {/* <ReviewFormTitle>{label}</ReviewFormTitle> */}
            <ReviewFormRequestChangeWrapper>
              <span>
                {toI18n('APPLICATION_REVIEW_CHANGE_REQUESTED')}
              </span>
              <span className="value">
                {this.getTotalRequestedChange()}
              </span>
            </ReviewFormRequestChangeWrapper>
            {this.renderActionGroup()}
          </ReviewFormHeader>
          <ReviewForm
            ref={(reviewForm) => { this.reviewForm = reviewForm; }}
            onChange={this.handleOnchange}
            defaultFields={applicationReviewForms}
          />
        </LoadingSpin>
      </ReivewFormWrapper>
    );
  }
}

export default ApplicationReview;
