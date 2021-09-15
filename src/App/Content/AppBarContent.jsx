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

const toolbarStyle = {
  backgroundColor: blue[500],
};

export default class AppBarContent extends React.Component {
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

  render() {
    const { classes } = this.props;

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
            style={{ width: "auto" }}
          >
            {this.renderActualTableName()}
          </Typography>
          {this.props.actualTable === "Seleccionar casos" && (
            <div>
              <Fab
                color="secondary"
                aria-label="Edit"
                className={classes.fab}
                onClick={this.props.onclickFap}
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
              <div
                className="consolidate-button-wrapper"
                className={classes.lookOneCaseModalButton}
              >
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
          {this.props.actualTable === "casos" && (
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
          {this.props.actualTable.split(" ")[0] === "consolidado:" && (
            <div>
              <Icon
                className="arrow-back"
                onClick={this.props.handleClickSeleccionarConsolidado}
              >
                arrow_back
              </Icon>
            </div>
          )}
          {(this.props.actualTable === "casos" ||
            this.props.actualTable === "actividades") && (
            <div>
              <Fab
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
              </Fab>
            </div>
          )}
          {this.props.actualTable === "casos" && (
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
            </span>
          )}
          {this.props.actualTable === "casos" && (
            <Select
              value={this.props.queryAttribute}
              onChange={this.handleChangeAttributeQueryDropdown}
              input={<Input name="newState" id="state-label-placeholder" />}
              displayEmpty
              name="newState"
              className="attributeSelector"
            >
              <MenuItem value="ordenado">ORDENADO</MenuItem>
              <MenuItem value="estado">ESTADO</MenuItem>
              {this.props.renderAttributes()}
            </Select>
          )}
          {this.props.actualTable === "casos" &&
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
          {this.props.actualTable.split(" ")[0] === "consolidado:" &&
            !this.props.loading &&
            !this.props.empty && (
              <ExportConsolidate
                moduleFilter={this.props.module}
                mes={this.props.mes}
              />
            )}
          {this.props.actualTable.split(" ")[0] === "consolidado:" && (
            <span className="select-info-wrapper">
              <span className="select-info">
                lotes: {this.props.rows.length}
              </span>
              <span className="select-info">
                casos: {this.props.porcentajesDeConsolidado.casos}
              </span>
              <span className="select-info">
                casos cerrados:{" "}
                {this.props.porcentajesDeConsolidado.casosCerrados}
              </span>
              <span className="select-info">
                % gestionado 3 dia:{" "}
                {this.props.porcentajesDeConsolidado.gestionadoAl3Dia}%
              </span>
              <span className="select-info">
                % gestionado 5 dia:{" "}
                {this.props.porcentajesDeConsolidado.gestionadoAl5Dia}%
              </span>
            </span>
          )}
          {this.props.actualTable.split(" ")[0] !== "consolidado:" &&
            this.props.actualTable !== "Seleccionar consolidado" &&
            this.props.actualTable !== "actividades" &&
            this.props.actualTable !== "Seleccionar casos" &&
            this.props.actualTable !== "Seleccionar resumen" && (
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
                  onClick={() => this.props.handleSearchClick()}
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            )}
          {this.props.renderResetSearchButton()}
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
