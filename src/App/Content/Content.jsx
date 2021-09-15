import React, { Component } from "react";
import EnhancedTable from "../../Tables/Table";
import Grid from "@material-ui/core/Grid";
import CaseSelect from "../../Tables/CaseSelect";
import SummarySelect from "../../Tables/SummarySelect";
import ConsolidatedSelect from "../../ConsolidatedAns/FormConsolidated";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import NewActivityModal from "../../Activities/NewActivityModal";

export default class ContentApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderUploadActivityButton = () => {
    const { classes } = this.props;

    if (
      localStorage.getItem("userType") === "Codensa" &&
      this.state.actualTable === "actividades"
    ) {
      return (
        <div>
          <Fab
            color="secondary"
            aria-label="Add"
            className={classes.fab}
            onClick={this.handleOpenModalUpload}
          >
            <AddIcon />
          </Fab>
          <NewActivityModal
            open={this.state.openUpload}
            handleCloseModalUpload={this.handleCloseModalUpload}
            depth={0}
            nuevoLote={true}
          />
        </div>
      );
    }
  };

  renderComponents = () => {
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
        this.props.actualTable !== "actividades" &&
        this.props.actualTable !== "Seleccionar casos" &&
        this.props.actualTable !== "Seleccionar resumen" &&
        this.props.actualTable !== "Seleccionar consolidado"
      ) {
        return (
          <div>
            <EnhancedTable
              rowsHeaders={this.props.rowsHeaders}
              rows={this.props.rows}
              currentTable={this.props.actualTable}
              casesQuery={this.props.casesQuery}
              module={this.props.module}
              mes={this.props.mes}
            />
          </div>
        );
      } else if (this.props.actualTable === "actividades") {
        return (
          <div>
            <br />
            <Grid>{this.props.renderActividades()}</Grid>
            {this.renderUploadActivityButton()}
          </div>
        );
      } else if (this.props.actualTable === "Seleccionar resumen") {
        return (
          <div>
            <SummarySelect summaryQuery={this.props.summaryQuery} />
          </div>
        );
      } else if (this.props.actualTable === "Seleccionar consolidado") {
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
