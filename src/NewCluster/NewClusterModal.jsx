
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Arrow from '@material-ui/icons/ArrowBack';
import './NewCluster.css';

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

class NewClusterModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      error:"",
      success:"",
      casosRestantes:null,
    };
  }
  renderButtton() {
    if(this.state.success !==""){
      return (
        <button className="acceptButton" onClick={()=>{window.location.reload();this.props.closeClusterModal();}}>Volver</button>
      )
    }
    if (this.state.fileSelected ) {
      return (
        <button className="acceptButton" onClick={this.sendFile}>Aceptar</button>
      )
    }

  }
  sendFile = ()=>{
    let formData = new FormData();
    this.setState({loading:true,error:""})

    formData.append("file", this.state.fileSelected);
    fetch(`https://intellgentcms.herokuapp.com/sica/api/nuevosAtributosACasos`, {
      method: 'POST',
      headers: {
        'x-access-token': localStorage.getItem("SICAToken")
      },
      body: formData
    }).then(response => response.json()).then(json1=>{
      if(json1.success){
        fetch("https://intellgentcms.herokuapp.com/sica/api/actividad", {
          method: "POST",
          headers: {
            'x-access-token': localStorage.getItem("SICAToken"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario: localStorage.getItem("userType"),
            observacion: "",
            concepto: "CLUSTER",
            profundidad: 0,
            URLArchivo:json1.URLArchivo
          })
        }).then(response => response.json()).then(
          json=>{
            if(json.success){
              this.setState({success:json.message,loading:false, casosRestantes:json.casosRestantes,error: ""})
            }else{
              this.setState({ loading: false, error: json.message, success: "" })
            }
          }
        )
      }else{
        this.setState({error:json1.message,loading:false})
      }
    })
  }
  handleChangeFile = ()=>{
    this.setState({fileSelected:this.refs.file.files[0]})
  }
  renderCasosrestantes = ()=>{
    let restantes = ""
    for(let i = 0;i< this.state.casosRestantes.length; i++){
      restantes += this.state.casosRestantes[i]+", "
    }
    return restantes
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
      <Arrow onClick={this.props.closeClusterModal} className="arrow" />
      <Typography variant="h5" component="h2" style ={{display:"inline-block", position:"relative",left:"50%",transform:"translateX(-50%)"}}>
      Subir nuevo cluster
      </Typography>
      <br />
      <Divider />
      <div>


      <br />
      <input className="inputFile" id="file-upload" type="file" ref="file" name="myimages" onChange={this.handleChangeFile}
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
      {this.state.loading ? (
        <div>
        <br />
        <span className="loader" id="loader"></span>
        <br />
        <br />
        </div>
      )
      :
      (<div className="cardActionAccept">
      {
        this.renderButtton()
      }
      <p className="errorText">{this.state.error}</p>
      <p className="successText">{this.state.success}</p>
      </div>)
    }
    </div>
    {(this.state.success!==""&&this.state.casosRestantes)&&(
      <div style ={{overflow: "auto",textAlign: "left"}}>
      Los siguientes casos no estaban en el sistema ({this.state.casosRestantes.length}):{

        this.renderCasosrestantes()
      }
      </div>
    )}
    </div>
    </Modal>

  )
}
}

export default withStyles(styles, { withTheme: true })(NewClusterModal);
