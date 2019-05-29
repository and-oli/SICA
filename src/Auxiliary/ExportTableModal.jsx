
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
import exportToCSV from './ExportToCSV';
import SummaryModal from './SummaryModal';
import './ExportTable.css';

const styles = theme => ({
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
    float:"right"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class ExportTableModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      filterState:"todos",
      summaryData : [],
    };
  }

  handleChangeDropdown= (e)=>{
    this.setState({filterState:e.target.value})
  }
  interpretar = (serial)=>{
    if(!serial) return ""
    const num = Number.parseInt(serial);
    if(num ){
      if(serial.length === 5){
        const milis = Math.round((num - 25569)*86400*1000)+3600*24*1000
        if( 1262322000000<milis && milis<1735707600000)
        {
          const date = new Date(milis);
          return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`.toString()
        }
      }
    }
    return serial
  }

  generateConsolidateData= ()=>{
    let data = []
    data.push(this.props.rowsHeaders.map(rh=>rh.label))
    for(let i = 0; i<this.props.rowsCopy.length;i++)
    {
      let newRow = []
      let rc = this.props.rowsCopy[i]
      let upperLimit = new Date(document.querySelector("#date-2").value).getTime() + 86399999
      let lowerLimit = new Date(document.querySelector("#date-1").value).getTime()
      let currentTime = new Date (rc.cambiosDeEstado[rc.cambiosDeEstado.length-1].fecha).getTime()
      let insideRange = currentTime <= upperLimit && currentTime >= lowerLimit;
      if((rc.estado.toLowerCase().trim()===this.state.filterState.toLowerCase().trim() || this.state.filterState.toLowerCase() ==="todos")
      && insideRange  ){
        for(let header of this.props.rowsHeaders){
            let k = header.original;
          if(k==="cambiosDeEstado"){
            newRow.push(rc[k][rc[k].length-1].fecha)
          }else{
            newRow.push(this.interpretar(rc[k]))
          }
        }
        data.push(newRow)
      }
    }
    return data
  }
  exportConsolidate=()=>{

    if(exportToCSV('Consolidado.csv',this.generateConsolidateData())){
      alert("Esta función no está disponible en su navegador");
    }
  }

  viewConsolidate=()=>{
    this.setState({summaryData:this.generateConsolidateData()})
  }
  cancelView=()=>{
    this.setState({summaryData:[]})
  }
generateSummaryData=()=>{
  let data = []
  data.push(["Estado","Cantidad"])
  let dataObj = {}
  for(let i = 0; i<this.props.rowsCopy.length;i++)
  {
    let rc = this.props.rowsCopy[i]
    let upperLimit = new Date(document.querySelector("#date-2").value).getTime() + 86399999
    let lowerLimit = new Date(document.querySelector("#date-1").value).getTime()
    let currentTime = new Date (rc.cambiosDeEstado[rc.cambiosDeEstado.length-1].fecha).getTime()
    let insideRange = currentTime <= upperLimit && currentTime >= lowerLimit;
    if( insideRange  ){
      dataObj[rc.estado] = dataObj[rc.estado]? dataObj[rc.estado]+1:1
    }
  }
  for(let dataKey in dataObj){
    data.push([dataKey,dataObj[dataKey]])
  }
  return data
}

  exportSummary=()=>{
    if(exportToCSV('Resumen.csv',this.generateSummaryData())){
      alert("Esta función no está disponible en su navegador");
    }
  }



  viewSummary=()=>{
    this.setState({summaryData:this.generateSummaryData()})

  }
  render(){
    const { classes } = this.props;
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        className = "edit-case-modal"
        >
          <div className={classes.modal}>
            <SummaryModal open = {this.state.summaryData.length>0} results = {this.state.summaryData} cancelView = {this.cancelView}/>
            <Arrow onClick={this.props.closeConsolidateModal} className="arrow" />
            <Typography variant="h5" component="h2" style ={{display:"inline-block", position:"relative",left:"50%",transform:"translateX(-50%)"}}>
              Seleccionar datos del consolidado
            </Typography>
            <br />
            <Divider />
            <div className = "consolidate-data-wrapper">
              <div className = "consolidate-data-wrapper-title">Seleccione las fechas de última modificación y el estado de los casos en el consolidado</div>
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
                        <MenuItem value="todos">Todos</MenuItem>
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
                    <Button variant="contained" color="primary" onClick ={this.exportConsolidate} className = "consolidate-button">
                      Descargar tabla
                    </Button>
                    <Button variant="contained" color="primary" onClick ={this.viewSummary} className = "consolidate-button">
                      Ver resumen
                    </Button>
                    {/* <Button variant="contained" color="primary" onClick ={this.exportSummary} className = "consolidate-button">
                      Descargar resumen
                    </Button> */}
                  </div>
                </div>
              </div>
            </Modal>

          )
        }
      }

      export default withStyles(styles, { withTheme: true })(ExportTableModal);
