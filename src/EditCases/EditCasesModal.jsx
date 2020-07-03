
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Arrow from '@material-ui/icons/ArrowBack';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import "./EditCasesModal.css"
const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  modal: {
    position: 'absolute',
    width: theme.spacing.unit * 80,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  button: {
    margin: theme.spacing.unit,
    float: "right"
  },
});

class EditCasesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cases: [],
      error: "",
      newState: null,
      loading: false,
      success: null,
      casosRestantes: null,
      idValues: "",
      obsValues: "",
      statesByModule: null,
      module: "ANALISIS",
    };
  }

  componentDidMount() {
    fetch(`https://intellgentcms.herokuapp.com/sica/api/diccionarioDeEstados`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem("SICAToken")
      },
    }).then(response => response.json()).then(json => this.setState({ statesByModule: json.estadosPorModulo }));
  }

  handleModuleDropdownChange = (e) => {
    this.setState({ module: e.target.value })
  }

  handleStateDropdownChange = (e) => {
    this.setState({ newState: e.target.value })
  }
  checkForDuplicates = (newCases) => {
    for (let i = 0; i < newCases.length; i++) {
      for (let j = 0; j < this.state.cases.length; j++) {
        if (newCases[i] === this.state.cases[j]) {
          return true
        }
      }
    }
    return false;
  }
  handleTextChange = (e) => {
    const text = e.target.value.trim()
    this.setState({ error: "", idValues: text })
    if (text.includes("\n")) {
      const newCases = text.split("\n")

      for (let i = 0; i < newCases.length; i++) {
        if (!Number.parseInt(newCases[i]) || Number.parseInt(newCases[i]).toString() !== newCases[i]) {
          this.setState({ error: "Formato incorrecto " })
          return
        }
      }
      if (!this.checkForDuplicates(newCases)) {
        this.setState((prevState) => { return { cases: [...newCases, ...prevState.cases] } })
      }
      this.setState({ idValues: "" })
    }
  }
  handleKeyType = (e) => {
    this.setState({ error: "" })
    const text = this.state.idValues.trim()
    if (e.key === "Enter") {
      e.preventDefault();
      if (!Number.parseInt(text) || Number.parseInt(text).toString() !== text) {
        this.setState({ error: "Formato incorrecto " })
        return
      }
      if (!this.checkForDuplicates([text])) {
        this.setState((prevState) => { return { cases: [text, ...prevState.cases] } })
      }
      this.setState({ idValues: "" })

    }
  }
  renderIds = () => {
    return this.state.cases.map((c, i) => {
      return (<div key={i}>{c}</div>)
    }
    )
  }
  handleCancel = () => {
    this.setState({ cases: [] })
  }
  handleOk = () => {
    this.setState({ loading: true, error: "", success: null })

    if (this.state.newState) {
      if (this.state.obsValues !== "") {
        fetch("https://intellgentcms.herokuapp.com/sica/api/cambiarEstadosACasos", {
          method: "POST",
          headers: {
            'x-access-token': localStorage.getItem("SICAToken"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario: `${localStorage.getItem("userType")} ${localStorage.getItem("userName")}`,
            casos: this.state.cases,
            modulo: this.state.module,
            estado: this.state.newState,
            observacion: this.state.obsValues
          })
        }).then(response => response.json()).then(
          json => {
            if (json.success) {
              this.setState({ loading: false, error: "", success: json.message, casosRestantes: json.casosRestantes })
            }
            else {
              this.setState({ loading: false, error: json.message, success: null })
            }
          }
        )
      }
      else {
        this.setState({ loading: false, error: "Ingrese una observación", success: null })
      }
    }
    else {
      this.setState({ loading: false, error: "Ingrese una estado", success: null })
    }

  }
  renderCasosrestantes = () => {
    let restantes = ""
    for (let i = 0; i < this.state.casosRestantes.length; i++) {
      restantes += this.state.casosRestantes[i] + ", "
    }
    return restantes
  }

  renderStateMenuItems = () => {
    if (this.state.statesByModule) {
      return this.state.statesByModule[this.state.module].map(state =>
        <MenuItem value={state}>{state}</MenuItem>
      )
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        className="edit-case-modal"
      >
        <div className={classes.modal}>
          <Arrow onClick={this.props.closeEditModal} className="arrow" />
          <Typography variant="h5" component="h2" style={{ display: "inline-block", position: "relative", left: "50%", transform: "translateX(-50%)" }}>
            Editar casos
          </Typography>
          <br />
          <Divider />

          <FormControl className="edit-case-modal-field">
            <InputLabel
              htmlFor="module-label-placeholder"
            >
              Módulo
              </InputLabel>
            <Select
              value={this.state.module}
              onChange={this.handleModuleDropdownChange}
              input={<Input name="newState" id="module-label-placeholder" />}
              displayEmpty
              name="newState"
            >
                <MenuItem value="ANALISIS">ANÁLISIS</MenuItem>
                <MenuItem value="LIQUIDACION">LIQUIDACIÓN</MenuItem>
                <MenuItem value="BALANCE MACROMEDICION">BALANCE MACROMEDICION</MenuItem>
                <MenuItem value="NOVEDADES">NOVEDADES</MenuItem>
                <MenuItem value="STORIA">STORIA</MenuItem>
                <MenuItem value="HALLAZGOS">HALLAZGOS</MenuItem>
                <MenuItem value="INFORMATIVAS">INFORMATIVAS</MenuItem>
            </Select>
            </FormControl>
            <FormControl className="edit-case-modal-field">

              <InputLabel shrink htmlFor="state-label-placeholder"> Nuevo estado</InputLabel>

              <Select
                value={this.state.newState}
                onChange={this.handleStateDropdownChange}
                input={<Input name="newState" id="state-label-placeholder" />}
                displayEmpty
                name="newState"
                style={{ width: "100%" }}
              >
                {this.renderStateMenuItems()}

              </Select>
            </FormControl>

            <TextField
              label="Ordenados "
              multiline
              rows="4"
              value={this.state.idValues}
              className="edit-case-modal-field"
              margin="normal"
              id="text-ids2407"
              helperText="Ingrese el ordenado del caso que desea modificar seguido de la tecla enter (también puede pegarlos de columnas de excel)"
              onChange={this.handleTextChange}
              onKeyDown={this.handleKeyType}
              variant="outlined"

            >
            </TextField>
            <TextField
              label="Observación "
              multiline
              rows="4"
              value={this.state.obsValues}
              onChange={e => {
                this.setState({ obsValues: e.target.value })
              }}
              className="edit-case-modal-field"
              margin="normal"
              id="text-obs"
              helperText="Ingrese una observación"
              variant="outlined"
            />
          {
            this.state.cases.length > 0 &&
            <div className="ids-wrapper" >
              {`Casos seleccionados (${this.state.cases.length}):`}

              {this.renderIds()}

            </div>
          }
          <div style={{ color: "red" }}>{this.state.error}</div>
          <div style={{ color: "green" }}>{this.state.success}</div>
          {
            this.state.loading ? (
              <div style={{ margin: "10px" }}>
                <br />
                <span className="loader" id="loader"></span>
                <br />
                <br />
              </div>
            ) :
              (this.state.cases.length > 0 && !this.state.success) && (
                <div className="button-wrapper">
                  <Button variant="contained" color="secondary" onClick={this.handleCancel} >
                    Borrar selección
                      </Button>
                  <Button variant="contained" color="primary" className={classes.button} onClick={this.handleOk}>
                    Enviar
                      </Button>
                </div>
              )
          }
          {
            (this.state.success) && (
              <Button variant="contained" color="primary" className={classes.button} onClick={this.props.closeEditModal}>
                Volver
                    </Button>
            )
          }
          {(this.state.success !== "" && this.state.casosRestantes) && (
            <div style={{ overflow: "auto", textAlign: "left" }}>
              Los siguientes casos no estaban en el sistema:{

                this.renderCasosrestantes()
              }
            </div>
          )}

        </div>
      </Modal>

    )
  }
}

export default withStyles(styles, { withTheme: true })(EditCasesModal);
