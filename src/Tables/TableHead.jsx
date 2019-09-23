import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import blue from '@material-ui/core/colors/blue';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: blue[300],
    color: theme.palette.common.white,
    position:'sticky',
    top: "64px",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class EnhancedTableHead extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openDelete:false,
      attrToDelete:"",
      loading:false,
      success:"",
      error:"",
    };
  }

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  delete = (e,attrToDelete)=>{
    e.preventDefault()
    this.setState({openDelete:true, attrToDelete})
  }
  cancelDelete = ()=>{
    this.setState({openDelete:false, success:"", attrToDelete:"", error:"",})
  }
  okDelete = ()=>{
    fetch("https://intellgentcms.herokuapp.com/sica/api/atributo", {
      method: "DELETE",
      headers: {
        'x-access-token': localStorage.getItem("SICAToken"),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.attrToDelete
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
  renderHeader(head) {
    if (head.label === " U R L Archivo") {
      return ("URL Archivo")
    }
    else {
      return (
        <span>
          <span onContextMenu ={(e)=>this.delete(e,head.original)}>
            {head.label}
          </span>

        </span>
      )

    }
  }

  render() {
    const { order, orderBy } = this.props;
    return (
      <TableHead>
        <TableRow>
          {this.props.rowsHeaders.map(
            (row,i) => (
              <CustomTableCell
                key={i}
                align={'center'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
                >
                  <Tooltip
                    title="Ordenar"
                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={this.createSortHandler(row.id)}
                        >
                          {
                            this.renderHeader(row)
                          }
                        </TableSortLabel>
                      </Tooltip>
                    </CustomTableCell>
                  )
                )}
              </TableRow>
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.openDelete}

                >
                  <div style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position:"relative",
                    position: 'absolute',
                    width: "30%",
                    padding: "20px",
                    backgroundColor: "white",
                    height:"220px",
                    outline: 'none'}} >
                    <div>
                      <Typography variant="h5" component="h2" style ={{display:"inline-block", position:"absolute",left:"50%",transform:"translateX(-50%)", }}>
                        ¿Desea borrar este atributo?
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
                          <Button variant="contained" color="secondary" onClick ={this.cancelDelete} className = "consolidate-button">
                            Cancelar
                          </Button>
                          <Button variant="contained" color="primary" onClick ={this.okDelete} className = "consolidate-button">
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
            </TableHead>
          );
        }
      }

      EnhancedTableHead.propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired
      };

      export default EnhancedTableHead;
