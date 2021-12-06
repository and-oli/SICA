import React, { Component } from "react";
import EnhancedTable from "../../Tables/Table";
import Grid from "@material-ui/core/Grid";
import CaseSelect from "../../Tables/CaseSelect";
import SummarySelect from "../../Tables/SummarySelect";
import ConsolidatedSelect from "../../ConsolidatedAns/FormConsolidated";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import NewActivityModal from "../../Activities/NewActivityModal";
import MainActivity from "../../Activities/MainActivity";

export default class ContentApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderUploadActivityButton = () => {
    const { classes, tableNames } = this.props;
    if (
      localStorage.getItem("userType") === "Codensa" &&
      this.props.actualTable === tableNames.actividades
    ) {

      return (
        <div>
          <Fab
            color="secondary"
            aria-label="Add"
            className={classes.fab}
            onClick={this.props.handleOpenModalUpload}
          >
            <AddIcon />
          </Fab>
          <NewActivityModal
            open={this.props.openUpload}
            handleCloseModalUpload={this.props.handleCloseModalUpload}
            depth={0}
            nuevoLote={true}
          />
        </div>
      );
    }
  };

  renderActividades = () => {
    return this.props.rows.map((r, i) => <MainActivity row={r} key={i} />);
  };

  renderComponents = () => {
    const {tableNames} = this.props;
    if (this.props.loading) {
      return <span className="loaderTable" id="loaderTable"></span>;
    } else {
      if (this.props.empty) {
        return (
          <div>
            <br />
            <Grid>
              <span className="no-la-hay">No hay información para mostrar</span>
            </Grid>
            {this.renderUploadActivityButton()}
          </div>
        );
      } else if (
        this.props.actualTable !== tableNames.actividades &&
        this.props.actualTable !== tableNames.seleccionarCasos &&
        this.props.actualTable !== tableNames.seleccionarResumen &&
        this.props.actualTable !== tableNames.seleccionarConsolidado
      ) {
        return (
          <div>
            <EnhancedTable
              generarConcolidadoPorLote={this.props.generarConcolidadoPorLote}
              tableNames={tableNames}
              rowsHeaders={this.props.rowsHeaders}
              rows={this.props.rows}
              page={this.props.page}
              handleChangeRowsPerPage={this.props.handleChangeRowsPerPage}
              handleChangePage={this.props.handleChangePage}
              rowsPerPage={this.props.rowsPerPage}
              currentTable={this.props.actualTable}
              casesQuery={this.props.casesQuery}
              module={this.props.module}
              mes={this.props.mes}
            />
          </div>
        );
      } else if (this.props.actualTable === tableNames.actividades) {
        return (
          <div>
            <br />
            <Grid>{this.renderActividades()}</Grid>
            {this.renderUploadActivityButton()}
          </div>
        );
      } else if (this.props.actualTable === tableNames.seleccionarResumen) {
        return (
          <div>
            <SummarySelect summaryQuery={this.props.summaryQuery} />
          </div>
        );
      } else if (this.props.actualTable === tableNames.seleccionarConsolidado) {
        //Formulario para seleccionar (modulo, mes y año) y generar la tabla
        return (
          <div>
            <ConsolidatedSelect
              consolidateSelect={this.props.consolidateSelect}
            />
          </div>
        );
      } else {
        return (
          <div>
            <CaseSelect casesQuery={this.props.casesQuery} />
          </div>
        );
      }
    }
  };

  render() {
    return (
      <main className={this.props.classes.content}>
        <br />
        {this.renderComponents()}
      </main>
    );
  }
}
