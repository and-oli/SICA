import React from "react";
import exportxlsx from "../Auxiliary/exportFiles";
import Button from "@material-ui/core/Button";

const ExportConsolidate = (props) => {
  const { mes, module } = props;

  const generateAnsFile = () => {
    fetch(
      `http://localhost:3001/sica/api/consolidado/lotes?mes=${mes}&module=${module}`,
      {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("SICAToken"),
        },
      }
    ).then((response) => {
      response.json().then((json) => {
        const data = json.casos;
        exportxlsx(module, data, "xlsx");
      });
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className="summary-button"
      onClick={generateAnsFile}
    >
      Generar consolidado
    </Button>
  );
};

export default ExportConsolidate;
