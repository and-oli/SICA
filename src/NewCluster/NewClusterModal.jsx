
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
    }).then(response => response.json()).then(json=>{
      if(json.success){
        this.setState({success:json.message,loading:false})
      }else{
        this.setState({error:json.message,loading:false})
      }
    })
  }
  handleChangeFile = ()=>{
      this.setState({fileSelected:this.refs.file.files[0]})
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
          </div>
        </Modal>

      )
    }
  }

  export default withStyles(styles, { withTheme: true })(NewClusterModal);
