import React, { Component } from 'react';
import { func, bool, shape } from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _keyBy from 'lodash/keyBy';
import LoadingSpin from '../Loading';
import { APPLICATION_FORM, APPLICATION_REVIEW_MAPPING } from '../../utils/constants';
import ChangeRequestForm from '../ChangeRequestForm/ChangeRequestForm';
import { ChangeRequestWrapper, ChangeRequestItem, ChangeRequestLogo } from './styled';
import { toI18n } from '../../utils/func-utils';

const scrollStyle = {
  height: 'calc(100vh - 260px)',
  width: '100%',
};

class ChangeRequest extends Component {
  static propTypes = {
    fetchReview: func.isRequired,
    updateApplication: func.isRequired,
    isFetching: bool.isRequired,
    isUpdating: bool.isRequired,
    review: shape(),
    match: shape().isRequired,
  }

  componentDidMount() {
    const { fetchReview, match } = this.props;
    const { params } = match;
    const { token } = params;
    fetchReview(token);
  }


  mapReviewFieldWithValidate = () => {
    const { review } = this.props;
    if (_isEmpty(review)) {
      return {};
    }
    const { fields } = review;
    const mapped = Object.keys(fields).map((field) => {
      const {
        type, schema, displayFields, ...rest
      } = APPLICATION_REVIEW_MAPPING[field];
      const { ref, comment, value } = fields[field];

      if (type === 'list') {
        return {
          name: field,
          ...rest,
          type,
          comment,
          displayFields,
          value,
          schema: APPLICATION_FORM[schema],
        };
      }
      return {
        name: field,
        ...rest,
        type,
        schema: APPLICATION_FORM[schema].fields[field],
        ref,
        comment,
        value,
      };
    });
    return _keyBy(mapped, 'name');
  };

  handleUpdateApplication = (application) => {
    const { updateApplication, match } = this.props;
    const { params } = match;
    const { token } = params;
    updateApplication(token, application);
  }

  render() {
    const { isFetching = false, isUpdating = false, review } = this.props;
    return (
      <ChangeRequestWrapper>
        <ChangeRequestItem>
          <ChangeRequestLogo>
            <img className="img" src="/assets/images/logo-small-black.png" alt="logo mia" />
            <span className="applicationText">
              {toI18n('REQUEST_CHANGE_LOGO')}
            </span>
          </ChangeRequestLogo>
          <LoadingSpin loading={isFetching || isUpdating}>
            {!isFetching && (
              <ChangeRequestForm
                scrollStyle={scrollStyle}
                onSubmit={this.handleUpdateApplication}
                fields={this.mapReviewFieldWithValidate(review)}
              />
            )}
          </LoadingSpin>
        </ChangeRequestItem>
      </ChangeRequestWrapper>
    );
  }
}

export default ChangeRequest;
