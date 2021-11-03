import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "./FormConsolidado.css";

const MODULOS = {
  ANALISIS: "ANALISIS",
  LIQUIDACION: "LIQUIDACION",
  HALLAZGOS: "HALLAZGOS",
  INFORMATIVAS: "INFORMATIVAS",
};

const MESES = {
  Enero: "01",
  Febrero: "02",
  Marzo: "03",
  Abril: "04",
  Mayo: "05",
  Junio: "06",
  Julio: "07",
  Agosto: "08",
  Septiembre: "09",
  Octubre: "10",
  Novimbre: "11",
  Diciembre: "12",
};

export default class ConsolidatedSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduloSelect: "ANALISIS",
      mesSelect: "Enero",
      añoSelect: 2019,
    };
  }

  ok = () => {
    const { moduloSelect, mesSelect, añoSelect } = this.state;
    this.props.consolidateSelect(moduloSelect, mesSelect, añoSelect);
  };

  handleChange = (e) => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  renderMapSelect = (values) => {
    return values.map((value, i) => (
      <MenuItem defaultValue={i === 0 ? value : false} value={value} key={i}>
        {value}
      </MenuItem>
    ));
  };

  render() {

    return (
      <Paper component="div" className="container-paper-padre">
        <h4>Seleccionar evaluación por lote (ANS)</h4>
        <Divider />
        <div>
          <div className="text-content">
            Seleccione el modulo y el mes de evaluación.
          </div>
          <form className="form-container">
            <FormControl
              style={{
                width: 180,
                marginRight: 30,
              }}
            >
              <InputLabel id="modulos-select">Modulo</InputLabel>
              <Select
                id="modulos-select"
                value={this.state.moduloSelect}
                onChange={this.handleChange}
                input={<Input name="newState" id="state-label-placeholder" />}
                displayEmpty
                name="moduloSelect"
              >
                {this.renderMapSelect(MODULOS)}
              </Select>
            </FormControl>
            <FormControl
              style={{
                width: 180,
                marginRight: 30,
              }}
            >
              <InputLabel id="mese-select">Mes</InputLabel>
              <Select
                id="meses-select"
                value={this.state.mesSelect}
                onChange={this.handleChange}
                input={<Input id="state-label-placeholder" />}
                displayEmpty
                name="mesSelect"
              >
                {this.renderMapSelect(Object.keys(MESES))}
              </Select>
            </FormControl>
            <FormControl
              style={{
                width: 180,
              }}
            >
              <InputLabel id="año-select">Año</InputLabel>
              <Select
                id="año-select"
                value={this.state.añoSelect}
                onChange={this.handleChange}
                input={<Input id="state-label-placeholder" />}
                displayEmpty
                name="añoSelect"
              >
                {this.renderMapSelect(años)}
              </Select>
            </FormControl>
            
          </form>
          <div className="consolidate-button-wrapper">
            <Button
              variant="contained"
              color="primary"
              className="consolidate-button"
              onClick={this.ok}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </Paper>
    );
  }
}
