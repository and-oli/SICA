
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Arrow from '@material-ui/icons/ArrowBack';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
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
    transform: "translate(-50%, -50%)",
  },
  button: {
    margin: theme.spacing.unit,
    float:"right"
  },
});

class ModifiedCasesModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderResults = ()=>{
    if(this.props.results){
      return this.props.results.map((row,i) => {
          return (
              <TableRow key={i}>
                  <TableCell align="center" >{row.caso}</TableCell>
                  <TableCell align="center">{row.nuevoEstado}</TableCell>
              </TableRow>
          )
      })
    }
  }
  render(){
    const { classes } = this.props;
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        >
          <div className={classes.modal}>
            <Arrow onClick={this.props.closeResultModal} className="arrow" />
            <Typography variant="h5" component="h2" style ={{display:"inline-block", position:"relative",left:"50%",transform:"translateX(-50%)"}}>
              Casos modificados en esta actividad
            </Typography>
            <br />
            <Divider />
            <div className = "modified-cases-content">

            <Paper className={classes.root}
              style  = {{marginTop:"10px"}}
              >
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>Caso</TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>Nuevo estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    this.renderResults()
                  }
                </TableBody>
              </Table>
            </Paper>
          </div>
          </div>
        </Modal>

      )
    }
  }

  export default withStyles(styles, { withTheme: true })(ModifiedCasesModal);
