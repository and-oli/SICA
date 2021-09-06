import React from "react";
import exportxlsx from "../Auxiliary/exportFiles";
import Button from "@material-ui/core/Button";
import jsonPrueba from "./jsonPrueba";

const ExportConsolidate = (props) => {
  const { mes, moduleFilter } = props;

  const ConsultaDb = () => {
    let rows, module, porcentajesConsolidado;
    const newRows = jsonPrueba.rows[moduleFilter].filter((valueFiltro) => {
      if (valueFiltro.mes === mes) {
        return valueFiltro;
      }
    });
    const porcentajes = jsonPrueba.calcularPorcentajes(newRows);
    if (newRows.length) {
      porcentajesConsolidado = porcentajes;
      module = moduleFilter;
      rows = newRows;
      exportxlsx( module, rows, 'xlsx', porcentajesConsolidado);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className="summary-button"
      onClick={ConsultaDb}
    >
      Generar consolidado
    </Button>
  );
};

export default ExportConsolidate;
