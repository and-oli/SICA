
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Arrow from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  modalUploadActivity: {
    position: 'absolute',
    width: theme.spacing.unit * 80,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
});

class DelteModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      error:"",
      success:""
    };
  }
  componentDidMount(){
    this.setState({userType:localStorage.getItem("userType")})
  }
  delete=()=>{
    this.setState({ loading: true, error: "", success:"" })

    fetch("https://intellgentcms.herokuapp.com/sica/api/borrarLote", {
      method: "POST",
      headers: {
        'x-access-token': localStorage.getItem("SICAToken"),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idActividad: this.props.activity._id,
        idLote:this.props.activity.idLote
      })
    }).then(response => response.json()).then(
      json=>{
        if(json.success){
          this.setState({ loading: false, error: "", success: json.message+ ". Por favor refresque la aplicación" })
        }else{
          this.setState({ loading: false, error: json.message, success: "" })
        }
      }
    )
  }
  render(){
    const { classes } = this.props;
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        >
          <div style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position:"relative"}} className={classes.modalUploadActivity}>
            <div>

              <Arrow onClick={this.props.cancelDelete} className="arrow" />
              <Typography variant="h5" component="h2" style ={{display:"inline-block", position:"absolute",left:"50%",transform:"translateX(-50%)", }}>
                ¿Desea borrar esta actividad y toda la información asociada?
              </Typography>
            </div>
            <br />
            {this.state.loading ? (
              <div style = {{marginTop:"90px"}}>
                <br />
                <span className="loader" id="loader"></span>
                <br />
                <br />
              </div>
            )
            :

            this.state.success === "" &&(
              <div className ="delete-vertical-align" >

                <div className = "consolidate-button-wrapper delete-button-wrapper">

                  <Button variant="contained" color="secondary" onClick ={this.props.cancelDelete} className = "consolidate-button">
                    Cancelar
                  </Button>
                  <Button variant="contained" color="primary" onClick ={this.delete} className = "consolidate-button">
                    Borrar
                  </Button>
                </div>
              </div>

            )
          }

          <div style = {{marginTop:"90px"}}>
            <p className="successText">{this.state.success}</p>
            <p className="errorText">{this.state.error}</p>
          </div>



        </div>
      </Modal>

    )
  }
}

export default withStyles(styles, { withTheme: true })(DelteModal);
