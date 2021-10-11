import React from "react";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import blue from "@material-ui/core/colors/blue";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import EditCasesModal from "../../EditCases/EditCasesModal";
import ExportTableModal from "../../Auxiliary/ExportTableModal";
import LookOneCaseModal from "../../Auxiliary/LookOneCaseModal";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import ExportConsolidate from "../../ConsolidatedAns/ExportConsolidate";
import TablePagination from "@material-ui/core/TablePagination";

const toolbarStyle = {
  backgroundColor: blue[500],
};

export default class ContentOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderActualTableName() {
    let tableName = this.props.actualTable;
    let tableNameToShow =
      tableName.charAt(0).toUpperCase() + tableName.slice(1);
    return tableNameToShow;
  }

  renderAttributes = () => {
    return this.props.currentModuleAttributes.map((atr, i) => (
      <MenuItem value={atr.nombreEnDB} key={i}>
        {atr.nombreEnArchivo}
      </MenuItem>
    ));
  };

  renderResetSearchButton = () => {
    const { classes } = this.props;

    if (this.props.searching) {
      return (
        <div>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={this.props.handleResetSearch}
          >
            Borrar búsqueda
          </Button>
        </div>
      );
    }
  };

  render() {
    const { classes, porcentajesDeConsolidado, tableNames } = this.props;

    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={toolbarStyle}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.props.handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            style={{ width: "auto", marginRight: 10 }}
          >
            {this.renderActualTableName()}
          </Typography>
          {this.props.actualTable === tableNames.seleccionarCasos && (
            <div>
              <Fab
                color="secondary"
                aria-label="Edit"
                className={classes.fab}
                onClick={this.props.onClickFab}
              >
                <Icon>edit_icon</Icon>
              </Fab>
              <EditCasesModal
                open={this.props.openEdit}
                closeEditModal={() => {
                  window.location.reload();
                  this.props.onclickFap(false);
                }}
              />
              <div className={classes.lookOneCaseModalButton}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.props.lookOneCaseModalClick}
                  className="consolidate-button"
                >
                  Buscar una orden
                </Button>
                <LookOneCaseModal
                  open={this.props.lookOneCaseModalVisible}
                  close={this.props.lookOneCaseModalClick}
                />
              </div>
            </div>
          )}
          {this.props.actualTable === tableNames.casos && (
            <div>
              <Fab
                color="secondary"
                aria-label="Edit"
                className={classes.fab}
                onClick={this.props.onClickFab}
              >
                <Icon>edit_icon</Icon>
              </Fab>

              <Icon
                className="arrow-back"
                onClick={this.props.handleClickCasos}
              >
                arrow_back
              </Icon>
              <EditCasesModal
                open={this.props.openEdit}
                closeEditModal={this.props.onClickFab}
              />
            </div>
          )}
          {this.props.actualTable.split(" ")[0] === tableNames.consolidado && (
            <div>
              <Icon
                className="arrow-back"
                onClick={this.props.handleClickSeleccionarConsolidado}
              >
                arrow_back
              </Icon>
            </div>
          )}
          {(this.props.actualTable === tableNames.casos ||
            this.props.actualTable === tableNames.actividades) && (
            <div className={classes.pagination}>
              {/* <Fab
                color="primary"
                aria-label="Edit"
                className={classes.left}
                onClick={this.props.prevPage}
              >
                <Icon>keyboard_arrow_left</Icon>
              </Fab>
              <Fab
                color="primary"
                aria-label="Edit"
                className={classes.right}
                onClick={this.props.nextPage}
              >
                <Icon>keyboard_arrow_right</Icon>
              </Fab> */}
              <TablePagination
                rowsPerPageOptions={[50, 100, 150]}
                component="div"
                labelRowsPerPage = "Filas por pagina:"
                className={classes.tablePagination}
                count={this.props.rows.length}
                rowsPerPage={this.props.rowsPerPage}
                page={this.props.page}
                onChangePage={(e, page) => {
                  this.props.handleChangePage(e, page);
                }}
                onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
              />
            </div>
          )}
          {this.props.actualTable === tableNames.casos && (
            <span className="select-info-wrapper">
              <span className="select-info">{this.props.module}</span>
              <span className="select-info">{this.props.stateT}</span>
              <span className="select-info">
                Fecha de{" "}
                {this.props.type ? "asignación " : "última modificación "}
                entre
              </span>
              <span className="select-info">{this.props.f1}</span>
              <span className="select-info">y</span>
              <span className="select-info">{this.props.f2}</span>
              <Select
                value={this.props.queryAttribute}
                onChange={this.props.handleChangeAttributeQueryDropdown}
                input={<Input name="newState" id="state-label-placeholder" />}
                displayEmpty
                name="newState"
                className="attributeSelector"
              >
                <MenuItem value="ordenado">ORDENADO</MenuItem>
                <MenuItem value="estado">ESTADO</MenuItem>
                {this.renderAttributes()}
              </Select>
            </span>
          )}
          {this.props.actualTable === tableNames.casos &&
            !this.props.loading &&
            !this.props.empty && (
              <Button
                variant="contained"
                color="primary"
                className="summary-button"
                onClick={() => this.props.generateConsolidate()}
              >
                Generar consolidado
              </Button>
            )}
          {this.props.actualTable.split(" ")[0] === tableNames.consolidado &&
            !this.props.loading &&
            !this.props.empty && (
              <ExportConsolidate
                moduleFilter={this.props.module}
                mes={this.props.mes}
              />
            )}
          {this.props.actualTable.split(" ")[0] === tableNames.consolidado && (
            <span className="select-info-wrapper">
              <span className="select-info">
                lotes:{this.props.rows.length}
              </span>
              <span className="select-info">
                casos: {porcentajesDeConsolidado.casos}
              </span>
              <span className="select-info">
                casos cerrados: {porcentajesDeConsolidado.casosCerrados}
              </span>
              <span className="select-info">
                % gestionado 3 dia: {porcentajesDeConsolidado.gestionadoAl3Dia}%
              </span>
              <span className="select-info">
                % gestionado 5 dia: {porcentajesDeConsolidado.gestionadoAl5Dia}%
              </span>
            </span>
          )}
          {this.props.actualTable.split(" ")[0] !== tableNames.consolidado &&
            this.props.actualTable !== tableNames.seleccionarConsolidado &&
            this.props.actualTable !== tableNames.actividades &&
            this.props.actualTable !== tableNames.seleccionarCasos &&
            this.props.actualTable !== tableNames.seleccionarResumen && (
              <Paper className={classes.root} elevation={1}>
                <InputBase
                  className={classes.input}
                  placeholder="Buscar"
                  onKeyDown={this.props.handleSearch}
                  id="searchInput"
                />
                <IconButton
                  className={classes.iconButton}
                  aria-label="Search"
                  onClick={this.props.handleSearchClick}
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            )}
          {this.renderResetSearchButton()}
          <ExportTableModal
            stateT={this.props.stateT}
            f1={this.props.f1}
            f2={this.props.f2}
            type={this.props.type}
            open={this.props.consolidateModal}
            closeConsolidateModal={this.props.generateConsolidate}
            module={this.props.module}
          />
        </Toolbar>
      </AppBar>
    );
  }
}
