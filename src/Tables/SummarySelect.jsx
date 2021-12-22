import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  modal: {
    position: "absolute",
    width: theme.spacing.unit * 80,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
    top: "50%",
    left: "60%",
    transform: "translate(-50%, -50%)",
  },
  button: {
    margin: theme.spacing.unit,
    float: "right",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class SummarySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summaryData: [],
      type: "0",
      module: "ANALISIS",
    };
  }

  handleModuleDropdownChange = (e) => {
    this.setState({ module: e.target.value });
  };

  handleTypeChangeDropdown = (e) => {
    this.setState({ type: e.target.value });
  };

  ok = () => {
    this.props.summaryQuery(
      document.querySelector("#date-1").value,
      document.querySelector("#date-2").value,
      this.state.type,
      this.state.module
    );
  };

  renderOptions = (object) => {
    return Object.keys(object).map((key, i) => (
      <MenuItem value={object[key]} key={i}>{key}</MenuItem>
    ))
  }

  render() {
    const { classes } = this.props;
    const modules = {
      "ANÁLISIS":"ANALISIS",
      "LIQUIDACIÓN":"LIQUIDACION",
      "BALANCE MACROMEDICION":"BALANCE MACROMEDICION",
      "NOVEDADES":"NOVEDADES",
      "STORIA":"STORIA",
      "HALLAZGOS":"HALLAZGOS",
      "INFORMATIVAS":"INFORMATIVAS"
    };
    const type = {
      "FECHA DE ASIGNACIÓN":"0",
      "ÚLTIMA MODIFICACIÓN":"1"
    };

    return (
      <div id="summarySelect" className={classes.modal}>
        <Typography
          variant="h5"
          component="h2"
          style={{
            display: "inline-block",
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Seleccionar consolidado
        </Typography>
        <br />
        <Divider />
        <div className="consolidate-data-wrapper">
          <div className="consolidate-data-wrapper-title">
            Seleccione las fechas de los casos en el consolidado
          </div>
          <div className="consolidate-select">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="state-label-placeholder">Módulo</InputLabel>
              <Select
                value={this.state.module}
                onChange={this.handleModuleDropdownChange}
                input={<Input name="newState" id="state-label-placeholder" />}
                displayEmpty
                name="newState"
              >
                {this.renderOptions(modules)}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="state-label-placeholder">
                Filtrar por
              </InputLabel>

              <Select
                value={this.state.type}
                onChange={this.handleTypeChangeDropdown}
                input={<Input name="newState" id="state-label-placeholder" />}
                displayEmpty
                name="newState"
              >
                {this.renderOptions(type)}
              </Select>
            </FormControl>
          </div>
          <div className="consolidate-dates-wrapper">
            <TextField
              id="date-1"
              label="Desde"
              type="date"
              defaultValue="2019-05-01"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="date-2"
              label="Hasta"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="consolidate-button-wrapper">
            <Button
              variant="contained"
              color="primary"
              onClick={this.ok}
              className="consolidate-button"
            >
              Aceptar
            </Button>
            {/* <Button variant="contained" color="primary" onClick ={this.exportSummary} className = "consolidate-button">
                Descargar resumen
              </Button> */}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SummarySelect);
