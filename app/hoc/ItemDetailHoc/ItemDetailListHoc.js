import React from 'react';
import PropTypes from 'prop-types';
import { ItemDetailListWrapper } from 'components/Generals/ItemDetail.styled';
import ShadowScrollbars from 'components/Scrollbar';
import HeaderContainer from 'components/HeaderContainer/HeaderContainer';
import TableBorder from 'components/TableBorder';
const scrollStyle = {
  height: 'calc(100vh - 108px)',
  width: '100%',
};

const ItemDetailListHoc = (ItemsDetailListItem) => {
  class ItemDetailList extends React.PureComponent {
    componentDidMount() {
      const { fetchList } = this.props;

      fetchList();
    }

    renderListItem = (item) => {
      const { selectedId } = this.props;
      const { _id } = item;
      const active = (selectedId) ? selectedId === _id : false;

      return <ItemsDetailListItem key={_id} item={item} active={active} />;
    };

    render() {
      const {
        handleSort,
        currentSorting,
        sortItems,
        createEndpoint,
        title,
        isLoading,
        items,
        shouldRenderNewButton = true,
        // for TableBorder
        totalCount,
        selectedPage,
        sizePerPage,
        changePage,
        filterItems,
        handleFilter,
        currentFiltering,
        shouldRenderFilter,
        onClickAddButton,
      } = this.props;

      const size = items.length;

      return (
        <ItemDetailListWrapper>
          <HeaderContainer
            onClickAddButton={onClickAddButton}
            sortItem={sortItems}
            url={createEndpoint}
            handleSort={handleSort}
            sorting={currentSorting}
            title={title}
            shouldRenderNewButton={shouldRenderNewButton}
            filterItems={filterItems}
            handleFilter={handleFilter}
            filtering={currentFiltering}
            shouldRenderFilter={shouldRenderFilter}
          />
          <TableBorder
            pageName="detail-list-hoc"
            size={size}
            isLoading={isLoading}
            totalCount={totalCount}
            selectedPage={selectedPage}
            changePage={changePage}
            sizePerPage={sizePerPage}
            shouldRenderPageInfo={false}
          >
            <ShadowScrollbars autoHide style={scrollStyle}>
              {items.map(this.renderListItem)}
            </ShadowScrollbars>
          </TableBorder>
        </ItemDetailListWrapper>
      );
    }
  }

  ItemDetailList.propTypes = {
    handleSort: PropTypes.func.isRequired,
    currentSorting: PropTypes.object.isRequired,
    sortItems: PropTypes.array.isRequired,
    createEndpoint: PropTypes.string,
    title: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    fetchList: PropTypes.func.isRequired,
    selectedId: PropTypes.string.isRequired,
    shouldRenderNewButton: PropTypes.bool,
    changePage: PropTypes.func.isRequired,
    totalCount: PropTypes.number.isRequired,
    selectedPage: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
    filterItems: PropTypes.array,
    handleFilter: PropTypes.func,
    currentFiltering: PropTypes.object,
    shouldRenderFilter: PropTypes.bool,
    onClickAddButton: PropTypes.func,
  };

  return ItemDetailList;
};

export default ItemDetailListHoc;
