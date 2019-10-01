import React from 'react';
import PropTypes from 'prop-types';
import HeaderContainer from 'components/HeaderContainer/HeaderContainer';
import { PageWrapper } from 'components/PermissionDeniedPage/PermissionDeniedPage.styled';
import { ItemDetailListWrapper } from 'components/Generals/ItemDetail.styled';
import ErrorContent from 'components/ErrorContent';

const ItemManagementHoc = (ItemsManagementTable) => {
  class ItemManagementWrapper extends React.PureComponent {
    render() {
      const {
        handleSort,
        currentSorting,
        sortItems,
        createEndpoint,
        title,
        shouldRenderNewButton = true,
        shouldRenderSendEmailButton = false,
        openModal,
        filterItems,
        handleFilter,
        currentFiltering,
        shouldRenderFilter,
        errorMsg,
        newButtonType,
        onClickAddButton,
        onClickRow,
        noHeader = false,
        ...propsTables
      } = this.props;

      if (errorMsg) {
        return (
          <PageWrapper>
            <ErrorContent error={errorMsg} />
          </PageWrapper>
        );
      }

      return (
        <ItemDetailListWrapper>
          {!noHeader && (
            <HeaderContainer
              sortItem={sortItems}
              url={createEndpoint}
              handleSort={handleSort}
              sorting={currentSorting}
              title={title}
              shouldRenderNewButton={shouldRenderNewButton}
              onClickAddButton={onClickAddButton}
              newButtonType={newButtonType}
              shouldRenderSendEmailButton={shouldRenderSendEmailButton}
              openModal={openModal}
              filterItems={filterItems}
              handleFilter={handleFilter}
              filtering={currentFiltering}
              shouldRenderFilter={shouldRenderFilter}
            />
          )}
          <ItemsManagementTable onClickRow={onClickRow} />
        </ItemDetailListWrapper>
      );
    }
  }

  ItemManagementWrapper.propTypes = {
    handleSort: PropTypes.func.isRequired,
    currentSorting: PropTypes.object.isRequired,
    sortItems: PropTypes.array.isRequired,
    createEndpoint: PropTypes.string,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    shouldRenderNewButton: PropTypes.bool,
    shouldRenderSendEmailButton: PropTypes.bool,
    openModal: PropTypes.func,
    filterItems: PropTypes.array,
    handleFilter: PropTypes.func,
    onClickAddButton: PropTypes.func,
    onClickRow: PropTypes.func,
    currentFiltering: PropTypes.object,
    shouldRenderFilter: PropTypes.bool,
    errorMsg: PropTypes.string,
    newButtonType: PropTypes.string,
    noHeader: PropTypes.bool,
  };

  return ItemManagementWrapper;
};

export default ItemManagementHoc;
