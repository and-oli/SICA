import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import blue from '@material-ui/core/colors/blue';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: blue[300],
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class EnhancedTableHead extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  renderHeader(label) {
    console.log(label);
    if (label === " U R L Archivo") {
      return ("URL Archivo")
    }
    else {
      return (label)
    }

  }

  render() {
    const { order, orderBy } = this.props;
    return (
      <TableHead>
        <TableRow>
          {this.props.rowsHeaders.map(
            row => (
              <CustomTableCell
                key={row.id}
                align={'center'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Ordenar"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {
                      this.renderHeader(row.label)
                    }
                  </TableSortLabel>
                </Tooltip>
              </CustomTableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
};

export default EnhancedTableHead;