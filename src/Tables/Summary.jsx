
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
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

class Summary extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      summaryData : [],
      filterState: "Todos"
    };
  }

  handleChangeDropdown= (e)=>{
    this.setState({filterState:e.target.value})
  }


 ok = ()=>{
   this.props.casesQuery(this.state.filterState,document.querySelector("#date-1").value,document.querySelector("#date-2").value )
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
              <div className = "consolidate-data-wrapper-title">Seleccione las fechas de última modificación y el estado de los casos que desea ver</div>
              <div className = "consolidate-select">
                <FormControl className={classes.formControl}>
                  <InputLabel
                    htmlFor="state-label-placeholder"
                    >
                      Estado
                    </InputLabel>

                    <Select
                      value={this.state.filterState}
                      onChange={this.handleChangeDropdown}
                      input={<Input name="newState" id="state-label-placeholder" />}
                      displayEmpty
                      name="newState"
                      >
                        <MenuItem value="Todos">TODOS</MenuItem>
                        <MenuItem value="ASIGNACIÓN INCORRECTA">ASIGNACIÓN INCORRECTA</MenuItem>
                        <MenuItem value="CARGADA EPICA">CARGADA EPICA</MenuItem>
                        <MenuItem value="PARA ASIGNACIÓN LOCAL">PARA ASIGNACIÓN LOCAL</MenuItem>
                        <MenuItem value="REMITIDO PARA CARGUE">REMITIDO PARA CARGUE</MenuItem>
                        <MenuItem value="REMITIDO PARA CARGUE ODT">REMITIDO PARA CARGUE ODT</MenuItem>
                        <MenuItem value="PARA COBRO">PARA COBRO</MenuItem>
                        <MenuItem value="PENDIENTE ANÁLISIS">PENDIENTE ANÁLISIS</MenuItem>
                        <MenuItem value="PENDIENTE MOVIMIENTO">PENDIENTE MOVIMIENTO</MenuItem>
                        <MenuItem value="GESTIONADO CODENSA">GESTIONADO CODENSA</MenuItem>
                        <MenuItem value="DESASIGNADO CODENSA">DESASIGNADO CODENSA</MenuItem>
                        <MenuItem value="DEVUELTO CODENSA">DEVUELTO CODENSA</MenuItem>
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

      export default withStyles(styles, { withTheme: true })(Summary);
