
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
    float:"right"
  },
});

class EditCasesModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      cases:[],
      error:"",
      newState:"ASIGNACIÓN INCORRECTA",
      loading:false,
      success:null
    };
  }
  checkForDuplicates = (newCases)=>{
    for(let i = 0 ;i<newCases.length; i++){
      for(let j = 0 ;j<this.state.cases.length; j++){
        if(newCases[i]=== this.state.cases[j]){
          return true
        }
      }
    }
    return false;
  }
  handleChange = ()=>{
    this.setState({error:""})
    const text = document.querySelector("#text-ids").value.trim()
    if(text.includes("\n")){
      const newCases = text.split("\n")

      for(let i = 0; i < newCases.length; i++){
        if(!Number.parseInt(newCases[i]) || Number.parseInt(newCases[i]).toString()!==newCases[i] ){
          this.setState({error:"Formato incorrecto "})
          return
        }
      }
      if(!this.checkForDuplicates(newCases)){
        this.setState((prevState)=>{return {cases:[...newCases,...prevState.cases]}}  )
      }
      document.querySelector("#text-ids").value = ""

    }
  }
  handleKey = (e)=>{
    this.setState({error:""})
    const text = document.querySelector("#text-ids").value.trim()
    if(e.key === "Enter"){
      e.preventDefault();
      if(!Number.parseInt(text) || Number.parseInt(text).toString()!==text){
        this.setState({error:"Formato incorrecto "})
        return
      }
      if(!this.checkForDuplicates([text])){
        this.setState((prevState)=>{return {cases:[text,...prevState.cases]}}  )
      }
      document.querySelector("#text-ids").value = ""

    }
  }
  renderIds = ()=>{
    return this.state.cases.map((c,i)=>{
      return(<div key = {i}>{c}</div>)
    }
  )
}
handleChangeDropdown= (e)=>{
  this.setState({newState:e.target.value})
}
handleCancel= ()=>{
  this.setState({cases:[]})
}
handleOk= ()=>{
  const obs = document.querySelector("#text-obs").value.trim()
  this.setState({ loading: true, error: "", success:null })

  if(obs!==""){
    fetch("https://intellgentcms.herokuapp.com/sica/api/cambiarEstadosACasos", {
      method: "POST",
      headers: {
        'x-access-token': localStorage.getItem("SICAToken"),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario: "Usuario "+localStorage.getItem("userType"),
        casos:this.state.cases,
        estado:this.state.newState,
        observacion:obs
      })
    }).then(response => response.json()).then(
      json=>{
        if(json.success){
          this.setState({ loading: false, error: "", success: json.message })
        }
        else{
          this.setState({ loading: false, error: json.message, success:null  })

        }
      }
    )
  }
  else{
    this.setState({ loading: false, error: "Ingrese una observación", success:null })
  }

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
          <Arrow onClick={this.props.closeEditModal} className="arrow" />
          <Typography variant="h5" component="h2" style ={{display:"inline-block", position:"relative",left:"50%",transform:"translateX(-50%)"}}>
            Editar casos
          </Typography>
          <br />
          <Divider />
          <FormControl className="new-activity-properties">
            <InputLabel shrink htmlFor="state-label-placeholder"> Nuevo estado</InputLabel>

            <Select
              value={this.state.newState}
              onChange={this.handleChangeDropdown}
              input={<Input name="newState" id="state-label-placeholder" />}
              displayEmpty
              name="newState"
              style = {{width:"100%"}}
              >

                <MenuItem value="ASIGNACIÓN INCORRECTA">ASIGNACIÓN INCORRECTA</MenuItem>
                <MenuItem value="CARGADA EPICA">CARGADA EPICA</MenuItem>
                <MenuItem value="PARA ASIGNACIÓN LOCAL">PARA ASIGNACIÓN LOCAL</MenuItem>
                <MenuItem value="PARA CARGUE">PARA CARGUE</MenuItem>
                <MenuItem value="PARA CARGUE ODT">PARA CARGUE ODT</MenuItem>
                <MenuItem value="PARA COBRO">PARA COBRO</MenuItem>
                <MenuItem value="PENDIENTE ANÁLISIS">PENDIENTE ANÁLISIS</MenuItem>
                <MenuItem value="PENDIENTE MOVIMIENTO">PENDIENTE MOVIMIENTO</MenuItem>

              </Select>
            <TextField
              label="Ordenados "
              multiline
              rows="4"
              value={this.state.multiline}
              className={classes.textField}
              margin="normal"
              id = "text-ids"
              helperText="Ingrese el ordenado del caso que desea modificar seguido de la tecla enter (también puede pegarlos)"
              onChange= {this.handleChange}
              onKeyDown= {this.handleKey}
              variant="outlined"
            />
            <TextField
              label="Observación "
              multiline
              rows="4"
              value={this.state.multiline}
              className={classes.textField}
              margin="normal"
              id = "text-obs"
              helperText="Ingrese una observación"
              variant="outlined"
            />
          </FormControl>
          {
            this.state.cases.length > 0 &&
            <div className = "ids-wrapper" >
              {`Casos seleccionados (${this.state.cases.length}):`}

              {this.renderIds()}

            </div>
          }
          <div style ={{color:"red"}}>{this.state.error}</div>
          <div style ={{color:"green"}}>{this.state.success}</div>
          {
            this.state.loading?(
              <div style = {{margin:"10px"}}>
                <br />
                <span className="loader" id="loader"></span>
                <br />
                <br />
              </div>
            ):
            (this.state.cases.length > 0 && !this.state.success) &&(
              <div className = "button-wrapper">
                <Button variant="contained" color="secondary" onClick ={this.handleCancel} >
                  Borrar selección
                </Button>
                <Button variant="contained" color="primary"  className={classes.button} onClick ={this.handleOk}>
                  Enviar
                </Button>
              </div>
            )
          }
          {
            (this.state.success) &&(
                <Button variant="contained" color="primary"  className={classes.button} onClick={this.props.closeEditModal}>
                  Volver
                </Button>
              )
          }

        </div>
      </Modal>

    )
  }
}

export default withStyles(styles, { withTheme: true })(EditCasesModal);
