
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
      error:"",
      loading:false,
      enableMultiDownload:false
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
        const milis = Math.round((serial - 25569)*86400*1000)//+3600*24*1000 solo para local (chrome le muestra la hora -5gmt)
        if( 1262322000000<milis && milis<1735707600000)
        {
          const date = new Date(milis);
          return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`.toString()
        }
      }
    }
    return serial
  }

  exportConsolidate=()=>{
    let data = []
    this.setState({error:"",loading:true})
    fetch(`https://intellgentcms.herokuapp.com/sica/api/casosDescargar?estado=${this.props.stateT}&f1=${this.props.f1}&f2=${this.props.f2}&type=${this.props.type}&module=${this.props.module}`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem("SICAToken")
      },
    }).then(response => response.json().then(
      (json) => {
        if(json.success){
          data.push(json.atributos.map(atr=>atr))
          for(let i = 0; i<json.casos.length;i++)
          {
            let newRow = []
            let rc = json.casos[i]
            for(let k of json.atributos){
              if(k==="cambiosDeEstado"){
                newRow.push(rc[k][rc[k].length-1].fecha)
              }else{
                newRow.push(this.interpretar(rc[k]))
              }
            }
            data.push(newRow)
          }
          this.setState({loading:false})

          if(exportToCSV('Consolidado.csv',data)){
            alert("Esta función no está disponible en su navegador");
          }
        }else{
          this.setState({error:json.message, loading:false})
          if(json.code === 1){
            this.setState({error:json.message, enableMultiDownload:true})
          }
        }
      }
    ));

  }

  generate5Files= ()=>{
    this.setState({error:"",loading:true, enableMultiDownload:false})
    let cases = []
    let generateSingleFile = (index)=>{
      if (index < 6){
        let data = []

        const idQuery = cases[cases.length-1]?`&lastId=${cases[cases.length-1]._id}`:""
        fetch(`https://intellgentcms.herokuapp.com/sica/api/casosDescargarMil?estado=${this.props.stateT}&f1=${this.props.f1}&f2=${this.props.f2}&type=${this.props.type}${idQuery}&module=${this.props.module}`, {
          method: 'GET',
          headers: {
            'x-access-token': localStorage.getItem("SICAToken")
          },
        }).then(response => response.json().then(
          (json) => {
            if(json.success){
              cases = json.casos
              data.push(json.atributos.map(atr=>atr))
              for(let i = 0; i<json.casos.length;i++)
              {
                let newRow = []
                let rc = json.casos[i]
                for(let k of json.atributos){
                  if(k==="cambiosDeEstado"){
                    newRow.push(rc[k][rc[k].length-1].fecha)
                  }else{
                    newRow.push(this.interpretar(rc[k]))
                  }
                }
                data.push(newRow)
              }
              if(data.length > 1){
                if(exportToCSV('Consolidado.csv',data)){
                  alert("Esta función no está disponible en su navegador");
                  this.setState({loading:false})
                }else{
                  generateSingleFile(index+1)
                }
              }else{
                this.setState({loading:false})
              }
            }else{
              this.setState({error:json.message, loading:false})
            }
          }
        ));
      }else{
        this.setState({loading:false})
      }
    }
    generateSingleFile(0);

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
            <Arrow onClick={this.props.closeConsolidateModal} className="arrow" />
            <Typography variant="h5" component="h2" style ={{display:"inline-block", position:"relative",left:"50%",transform:"translateX(-50%)"}}>
              Descargar tabla
            </Typography>
            <br />
            <Divider />
            <div className = "consolidate-data-wrapper">
              {/* <div className = "consolidate-data-wrapper-title">Seleccione las fechas de última modificación y el estado de los casos en el consolidado</div>
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

      </div> */}
      {/* <div className = "consolidate-dates-wrapper">
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
</div> */}
{
  this.state.loading?(
    <div style = {{margin:"10px"}}>
      <br />
      <span id="loader1"></span>
      <br />
      <br />
    </div>
  ):
  <div className = "consolidate-button-wrapper">
    <Button variant="contained" color="primary" onClick ={this.exportConsolidate} className = "consolidate-button">
      Descargar
    </Button>

    {/* <Button variant="contained" color="primary" onClick ={this.viewSummary} className = "consolidate-button">
    Ver resumen
  </Button> */}
  {/* <Button variant="contained" color="primary" onClick ={this.exportSummary} className = "consolidate-button">
  Descargar resumen
</Button> */}
</div>
}
{
  this.state.enableMultiDownload&&(
    <div className = "consolidate-button-wrapper">
      <Button variant="contained" color="primary" onClick ={this.generate5Files} className = "consolidate-button">
        Descargar 6 archivos
      </Button>
    </div>
  )

}

<span style = {{color:"red", padding:"10px"}}>{this.state.error}</span>
</div>
</div>
</Modal>

)
}
}

export default withStyles(styles, { withTheme: true })(ExportTableModal);
