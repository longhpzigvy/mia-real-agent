import React from 'react';
import PropTypes, { shape } from 'prop-types';
import moment from 'moment';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import { Icon } from 'antd';
import _reducer from 'lodash/reduce';
import { TableContent } from 'components/TableComponent/TableComponent';
import { CurrencyFormat } from 'components/Generals/CurrencyFormat';
import {
  TableContentItem,
  TableContentItemGroup,
  TableContentWrapper,
  TableStatusContent,
} from 'components/TableComponent/TableComponent.styled';
import { IconStyled } from 'components/Generals/General.styled';
import { COLUMN_TYPE } from 'utils/constants';
import history from 'utils/history';
import { ButtonGroupWrapper, ButtonElement, UppercaseText } from './TableManagement.styled';
import { ActionBarStyled } from './styles';

class TableRow extends React.PureComponent {
  onClick = () => {
    const {
      item,
      onClick,
    } = this.props;

    onClick(item);
  };

  handleEditButton = () => {
    const { item } = this.props;
    const { _id } = item;

    history.push(`/role/${_id}/edit`);
  };

  renderActiveColumn = (column) => {
    const { item } = this.props;
    const { dataKey } = column;
    const active = _get(item, dataKey, false);

    return <IconStyled className="icon-dots" active={active} />;
  };

  renderDateColumn = (column) => {
    const { item } = this.props;
    const { dataKey, format } = column;

    const value = _get(item, dataKey);

    return moment(value).format(format);
  };

  renderLinkColumn = (column) => {
    const { item } = this.props;
    const { dataKey } = column;

    const value = _get(item, dataKey);

    return (<a href={value}>Link</a>);
  };

  renderArrayColumn = (column) => {
    const { item } = this.props;
    const { dataKey, key } = column;

    const values = _get(item, dataKey);
    return values.map(value => value[key]).join(', ');
  };

  handleActionBarOnClick = (e) => {
    e.stopPropagation();
  }

  renderActionsColumn = (column) => {
    const { item, rest: parentProps } = this.props;
    const { actions } = column;
    let icons = [];
    actions.forEach(({
      dataKey, oneOf, action, ...rest
    }) => {
      if (!dataKey) {
        const func = parentProps[action];
        icons = icons.concat({
          func,
          ...rest,
        });
      } else {
        const value = _get(item, dataKey);
        const func = parentProps[action];
        if (_includes(oneOf, value)) {
          icons = icons.concat({
            func,
            ...rest,
          });
        }
      }
    });
    return (
      <ActionBarStyled onClick={this.handleActionBarOnClick}>
        {icons.map(({ type, func = () => { } }) => (
          <Icon key={type} type={type} onClick={() => func(item)} />
        ))}
      </ActionBarStyled>
    );
  };

  renderTextColumn = (column) => {
    const { item } = this.props;
    const { dataKey } = column;
    if (dataKey instanceof (Array)) {
      return dataKey.map((key) => {
        const value = _get(item, key);
        if (Array.isArray(value)) {
          return value.length > 1 ? value.join(' , ') : value;
        }
        return `${value} ` || '-';
      });
    }
    const value = _get(item, dataKey);
    if (Array.isArray(value)) {
      return value.length > 1 ? value.join(' , ') : value;
    }
    return value || '-';
  };

  renderConstantColumn = (column) => {
    const { item } = this.props;
    const { dataKey, constant } = column;
    const value = _get(item, dataKey);

    return constant[value].label;
  };

  renderTotalColumn = (column) => {
    const { item } = this.props;
    const { dataKey, format } = column;
    const data = _get(item, dataKey);
    return _reducer(data, (prevValue, value) => prevValue + value[format], 0);
  };

  renderCurrencyColumn = (column) => {
    const { item } = this.props;
    const { dataKey } = column;
    const value = _get(item, dataKey);

    return <CurrencyFormat value={value} format="Ticket" />;
  };

  renderStatusColumn = (column) => {
    const { item } = this.props;
    const { dataKey } = column;
    const value = _get(item, dataKey);
    return (
      <TableStatusContent status={value}>
        <i className={`type-${value}`} />
        {value}
      </TableStatusContent>
    );
  };

  renderRoleButtonGroupColumn = () => (
    <ButtonGroupWrapper>
      <ButtonElement>
        <i className="icon-pencil" onClick={this.handleEditButton} /> { /* eslint-disable-line */}
      </ButtonElement>
    </ButtonGroupWrapper>
  );

  renderUppercaseColumn = (column) => {
    const { dataKey } = column;
    const { item } = this.props;

    const value = _get(item, dataKey);

    return <UppercaseText>{value}</UppercaseText>;
  }

  renderColumnContent = (column) => {
    const { type } = column;
    switch (type) {
      case COLUMN_TYPE.DATE:
        return this.renderDateColumn(column);
      case COLUMN_TYPE.LINK:
        return this.renderLinkColumn(column);
      case COLUMN_TYPE.ARRAY:
        return this.renderArrayColumn(column);
      case COLUMN_TYPE.ACTIONS:
        return this.renderActionsColumn(column);
      case COLUMN_TYPE.ACTIVE:
        return this.renderActiveColumn(column);
      case COLUMN_TYPE.CONSTANT:
        return this.renderConstantColumn(column);
      case COLUMN_TYPE.TOTAL:
        return this.renderTotalColumn(column);
      case COLUMN_TYPE.CURRENCY:
        return this.renderCurrencyColumn(column);
      case COLUMN_TYPE.STATUS:
        return this.renderStatusColumn(column);
      case COLUMN_TYPE.ROLE_BUTTON_GROUP:
        return this.renderRoleButtonGroupColumn(column);
      case COLUMN_TYPE.UPPERCASE:
        return this.renderUppercaseColumn(column);
      case COLUMN_TYPE.TEXT:
      default:
        return this.renderTextColumn(column);
    }
  };

  renderColumn = (column, index) => {
    const {
      columnAttr: { value, ...rest },
    } = column;
    return (
      <TableContent {...rest} key={index}>
        {this.renderColumnContent(column)}
      </TableContent>
    );
  };

  render() {
    const { columns, isPointer } = this.props;
    return (
      <TableContentWrapper>
        <TableContentItem onClick={this.onClick}>
          <TableContentItemGroup isPointer={isPointer}>
            {columns.map(this.renderColumn)}
          </TableContentItemGroup>
        </TableContentItem>
      </TableContentWrapper>
    );
  }
}

TableRow.propTypes = {
  columns: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isPointer: PropTypes.bool,
  rest: shape(),
};

export default TableRow;
