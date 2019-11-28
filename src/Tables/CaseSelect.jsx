import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  modal: {
    position: 'absolute',
    width: theme.spacing.unit * 80,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    top: "50%",
    left: "60%",
    transform: "translate(-50%, -50%)"
  },
  button: {
    margin: theme.spacing.unit,
    float:"right"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});
const statesByModule = { // Estas contantes se definen aqui,  en el editCasesModal  y en el resumen en el back.
  "ANALISIS": [
      "Todos",
      "ASIGNACIÓN INCORRECTA",
      "CARGADA EPICA",
      "PARA ASIGNACIÓN LOCAL",
      "REMITIDO PARA CARGUE",
      "REMITIDO PARA CARGUE ODT",
      "PARA COBRO",
      "PENDIENTE ANÁLISIS",
      "PENDIENTE MOVIMIENTO",
      "GESTIONADO CODENSA",
      "DESASIGNADO CODENSA",
      "DEVUELTO CODENSA",
    ],
    "LIQUIDACION": [
    "Todos",
    "ASIGNACIÓN INCORRECTA",
    "CARGADA EN BASE",
    "CARGADA EPICA",
    "DESASIGNADO CODENSA",
    "DEVUELTO CONDENSA",
    "GESTIONADO CODENSA",
    "NO APLICA DEBIDO PROCESO",
    "PARA ASIGNACIÓN LOCAL",
    "PARA COBRO",
    "PENDIENTE CARGUE",
    "PENDIENTE LIQUIDACIÓN",
    "PENDIENTE MOVIMIENTO",
  ],
}; 

class CaseSelect extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      summaryData : [],
      filterState: "Todos",
      type:"0",
      module:"ANALISIS",
    };
  }
  handleStateDropdownChange= (e)=>{
    this.setState({filterState:e.target.value})
  }

  handleModuleDropdownChange = (e)=>{
    this.setState({module:e.target.value,filterState:"Todos"})
  }

  handleTypeChangeDropdown= (e)=>{
    this.setState({type:e.target.value})
  }

  ok = ()=>{
    this.props.casesQuery(this.state.filterState,document.querySelector("#date-1").value,document.querySelector("#date-2").value,this.state.type, this.state.module )
  }
  renderFilterStateMenuItems = () => {
    return statesByModule[this.state.module].map(state=>
      <MenuItem value={state}>{state}</MenuItem>
      )

  }
  render(){
    const { classes } = this.props;
    return (
          <div className={classes.modal}>
            <Typography variant="h5" component="h2" style ={{display:"inline-block", position:"relative",left:"50%",transform:"translateX(-50%)"}}>
              Seleccionar casos
            </Typography>
            <br />
            <Divider />
            <div className = "consolidate-data-wrapper">
              <div className = "consolidate-data-wrapper-title">Seleccione las fechas y el estado de los casos que desea ver</div>
              <div className = "consolidate-select">
              <FormControl className={classes.formControl}>
                  <InputLabel
                    htmlFor="state-label-placeholder"
                    >
                      Módulo
                    </InputLabel>

                    <Select
                      value={this.state.module}
                      onChange={this.handleModuleDropdownChange}
                      input={<Input name="newState" id="state-label-placeholder" />}
                      displayEmpty
                      name="newState"
                      >
                        <MenuItem value="ANALISIS">ANÁLISIS</MenuItem>
                        <MenuItem value="LIQUIDACION">LIQUIDACIÓN</MenuItem>
                      </Select>
                    </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel
                    htmlFor="state-label-placeholder"
                    >
                      Estado
                    </InputLabel>

                    <Select
                      value={this.state.filterState}
                      onChange={this.handleStateDropdownChange}
                      input={<Input name="newState" id="state-label-placeholder" />}
                      displayEmpty
                      name="newState"
                      >
                        {this.renderFilterStateMenuItems()}
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl} >
                      <InputLabel
                        htmlFor="state-label-placeholder"
                        >
                          Filtrar por
                        </InputLabel>

                        <Select
                          value={this.state.type}
                          onChange={this.handleTypeChangeDropdown}
                          input={<Input name="newState" id="state-label-placeholder" />}
                          displayEmpty
                          name="newState"
                          >
                            <MenuItem value="0">FECHA DE ASIGNACIÓN</MenuItem>
                            <MenuItem value="1">ÚLTIMA MODIFICACIÓN</MenuItem>
                          </Select>
                        </FormControl>
                  </div>
                  <div className = "consolidate-dates-wrapper">
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
                      defaultValue="2019-05-01"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div className = "consolidate-button-wrapper">
                    <Button variant="contained" color="primary" onClick ={this.ok} className = "consolidate-button">
                      Aceptar
                    </Button>
                    {/* <Button variant="contained" color="primary" onClick ={this.exportSummary} className = "consolidate-button">
                      Descargar resumen
                    </Button> */}
                  </div>
                </div>
              </div>

          )
        }
      }

      export default withStyles(styles, { withTheme: true })(CaseSelect);
