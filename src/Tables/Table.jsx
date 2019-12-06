import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import EnhancedTableHead from "./TableHead";
import "./Table.css";
import Modal from '@material-ui/core/Modal';
import DateDetail from "../DateDetail/DateDetail";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 4,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
  },

  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  modalDateDetail: {
    position: 'absolute',
    width: theme.spacing.unit * 120,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
});

class EnhancedTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      page: 0,
      rowsPerPage: 50,
      openUpload: false,
      openDateDetail: false,
      rowData: "",
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleOpenDateDetail = (data) => {
    this.setState({ openDateDetail: true, rowData: data });
  }

  handleCloseModalDateDetail = () => {
    this.setState({ openDateDetail: false });
  }

  handleOpenModalUpload = () => {
    this.setState({ openUpload: true });
  }

  handleCloseModalUpload = () => {
    this.setState({ openUpload: false });
  };
  interpretar = (serial)=>{
    if(serial===0) return serial
    if(!serial) return ""
    const num = Number.parseInt(serial);

    if(num){
      if(serial.length === 5){
        const milis = Math.round((serial - 25569)*86400*1000)//+3600*24*1000 solo para local (chrome le muestra la hora -5gmt)
        if( 1527173971106<milis && milis<1735707600000)
        {
          const date = new Date(milis);
          return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`.toString()
        }
      }
    }
    else if(this.props.currentTable === "resumen"){//Hay certeza de que se trata del estado pues no es un numero
      return (
          <a className = "downloadAvailable" onClick = {()=>{this.props.casesQuery(serial)}} >{serial.toString()}</a>
      )
    }
    if(serial.length >80){
      return(
        <Tooltip title={serial} interactive>
          <Typography   >{serial.substring(0,80)+"..."}</Typography>
        </Tooltip>
      )
    }
    return serial.toString()
  }
  render() {
    const { rows, classes } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
      <div>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper} >
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={rows.length}
                rowsHeaders={this.props.rowsHeaders}
              />
              <TableBody>
                {stableSort(rows, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n,i) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={i}
                        >
                          {
                            this.props.rowsHeaders.map((header, i) => {

                              if (header.id === "cerrado") {
                                return (
                                  <TableCell key={i} align="center">{n[header.id]?"Sí":"No"}</TableCell>
                                )
                              }
                              else if (header.id === "cambiosDeEstado") {
                                return (
                                  <TableCell key={i} align="center" style={{ whiteSpace: "nowrap" }} className="dateLink">
                                    <Tooltip title="Ver en detalle">
                                      {
                                        n[header.id]&&
                                        <Typography style={{ color: "#2196f3" }} onClick={this.handleOpenDateDetail.bind(this, n)}  >{n[header.id][n[header.id].length - 1].fecha}</Typography>
                                      }
                                    </Tooltip>
                                  </TableCell>
                                )
                              }
                              else if (header.id === "URLArchivo") {
                                return (
                                  <TableCell key={i} align="center" style={{ whiteSpace: "nowrap" }} className="dateLink">
                                    <Tooltip title="Descargar">
                                      <a style={{ color: "#2196f3" }} href={n[header.id]} >Descargar archivo</a>
                                    </Tooltip>
                                  </TableCell>
                                )
                              }
                              // else if (header.id === "estado") {
                              //   return (
                              //     <TableCell key={i} align="center" style={{ whiteSpace: "nowrap" }}>
                              //     <Typography >{n.cambiosDeEstado[n.cambiosDeEstado.length - 1].nuevoEstado}</Typography>
                              //     </TableCell>
                              //   )
                              // }

                              return (
                                <TableCell key={i} align="center">{this.interpretar(n[header.id])}</TableCell>
                              )
                            }
                          )
                        }
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {
              this.props.currentTable !== "casos"&&
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100,500]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            }

          </Paper>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openUpload}
            >
            </Modal>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.state.openDateDetail}
              >
                <div style={getModalStyle()} className={classes.modalDateDetail}>
                  <DateDetail handleClose={this.handleCloseModalDateDetail} data={this.state.rowData}></DateDetail>
                </div>
              </Modal>
            </div>
          );
        }
      }

      EnhancedTable.propTypes = {
        classes: PropTypes.object.isRequired,
      };

      export default withStyles(styles)(EnhancedTable);
