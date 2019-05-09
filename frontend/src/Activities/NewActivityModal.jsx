
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import UploadActivity from "./UploadActivity";
import Arrow from '@material-ui/icons/ArrowBack';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

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
const conceptsRoutes = {"Gestión terceros":"gestionTerceros","Finalización inspecciones":"finalizacionInspecciones","Otro":"otro"}

class NewActivityModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      concept:"",
      observation:"",
      route:"",
      userType:""
    };
  }
  componentDidMount(){
    this.setState({userType:localStorage.getItem("userType")})
  }
  handleObsChange = ()=>{
    this.setState({observation:this.observation.value})
  }
  handleChangeDropdown =(e)=> {
      this.setState({ concept: e.target.value,route: conceptsRoutes[ e.target.value]});
  }
  render(){
    const { classes } = this.props;
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        >
          <div style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position:"relative" }} className={classes.modalUploadActivity}>
            <Arrow onClick={this.props.handleCloseModalUpload} className="arrow" />
            <Typography variant="h5" component="h2" style ={{display:"inline-block", position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
              {this.props.nuevoLote?("Nuevo lote"):("Nueva respuesta")}
            </Typography>
            <br />
            <Divider />
            <FormControl className="new-activity-properties">
              {
                !this.props.nuevoLote&&(
                  <div style = {{width:"100%"}}>
                    <InputLabel shrink htmlFor="concept-label-placeholder"> Concepto</InputLabel>
                    <Select
                      value={this.state.concept}
                      onChange={this.handleChangeDropdown}
                      input={<Input name="concept" id="concept-label-placeholder" />}
                      displayEmpty
                      name="concept"
                      style = {{width:"100%"}}
                      >
                      {
                        this.state.userType ==="Comsistelco"&&
                        <MenuItem value="Gestión terceros">Gestión terceros</MenuItem>
                      }
                      {
                        this.state.userType ==="Comsistelco"&&
                        <MenuItem value="Finalización inspecciones">Finalización inspecciones</MenuItem>
                      }
                      {
                        this.state.userType ==="Codensa"&&
                        <MenuItem value="Otro">Otro</MenuItem>
                      }

                      </Select>
                    </div>
                  )
                }
                <TextField
                  id="standard-multiline-flexible"
                  label="Observación"
                  inputRef={inRef => this.observation = inRef}
                  multiline
                  rowsMax="4"
                  className={classes.textField}
                  margin="normal"
                  onChange = {this.handleObsChange}
                />
              </FormControl>
              <UploadActivity
                concept = {(this.props.concept||this.state.concept)}
                depth={(this.props.depth===0?0:1)}
                observation ={this.state.observation}
                parentId={this.props.parentId}
                route = {(this.props.route||this.state.route)}
                nuevoLote = {this.props.nuevoLote}
                handleCloseModalUpload={this.props.handleCloseModalUpload}
              />
            </div>
          </Modal>

        )
      }
    }

    export default withStyles(styles, { withTheme: true })(NewActivityModal);
