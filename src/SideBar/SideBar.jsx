
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import EnhancedTable from "../Tables/Table";
import FolderIcon from '@material-ui/icons/Folder';
import AssignmentIcon from '@material-ui/icons/Description';
import blue from '@material-ui/core/colors/blue';
import "./SideBar.css"
import Grid from '@material-ui/core/Grid';
import Clock from "@material-ui/icons/Alarm";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NewActivityModal from "../Activities/NewActivityModal";
import MainActivity from "../Activities/MainActivity";
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Badge from '@material-ui/core/Badge';
import EditCasesModal from "../EditCases/EditCasesModal"
import ExportTableModal from '../Auxiliary/ExportTableModal';
import NewClusterModal from '../NewCluster/NewClusterModal';


const drawerWidth = 200;

const toolbarStyle = {
  backgroundColor: blue[500]
}

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  button: {
    margin: theme.spacing.unit,
  },
  fab: {
    bottom: theme.spacing.unit * 7,
    right: theme.spacing.unit * 4,
    position: "fixed",
  },

  modalUploadActivity: {
    position: 'absolute',
    width: theme.spacing.unit * 80,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
});

class ResponsiveDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      actualTable: "actividades",
      userType: "",
      loading: true,
      rowsHeaders: [],
      rows: [],
      rowsCopy: [],
      searching: false,
      empty: false,
      openUpload: false,
      openEdit:false,
      notifications:0,
      consolidateModal:false,
      clusterModal:false,
    };
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };
  casesQuery = (state) => {
    this.setState({ actualTable: "casos", loading: true, searching:false },
    ()=>this.doFetch("estado="+state)
  );
}
  handleClickCasos = () => {
    this.setState({ actualTable: "resumen", loading: true, searching:false },
    this.doFetch
  );
}

handleClickLotes = () => {
  this.setState({ actualTable: "lotes", loading: true, searching:false },
  this.doFetch
);
}

handleClickActividad = () => {
  this.setState({ actualTable: "actividades", loading: true, searching:false },
  this.doFetch
);
}

handleSearch = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const searchValue = e.target.value;
    if(searchValue.trim()!==""){
      let rowsToShow = [];
      for (let i = 0; i < this.state.rowsCopy.length; i++) {
        for (let j = 0; j < this.state.rowsHeaders.length; j++) {
          let row = this.state.rowsCopy[i];
          let header = this.state.rowsHeaders[j];
          if( row[header.id]){

            if ( row[header.id].toString().toLowerCase().includes(searchValue.toLowerCase()) ) {
              rowsToShow.push(row);
              break;
            }
          }
        }
      }
      this.setState({ rows: rowsToShow, searching: true })
    }
  }
}
handleSearchClick = () => {
  let searchValue = document.getElementById("searchInput").value;
  if(searchValue.trim()!==""){

    let rowsToShow = [];
    for (let i = 0; i < this.state.rowsCopy.length; i++) {
      for (let j = 0; j < this.state.rowsHeaders.length; j++) {
        let row = this.state.rowsCopy[i];
        let header = this.state.rowsHeaders[j];
        if( row[header.id]){
          if ( row[header.id].toString().toLowerCase().includes(searchValue.toLowerCase()) ) {
            rowsToShow.push(row);
            break;
          }
        }
      }
    }
    this.setState({ rows: rowsToShow, searching: true })
  }
}


handleResetSearch = () => {
  this.setState({ rows: this.state.rowsCopy, searching: false });
  document.getElementById("searchInput").value = "";
}

handleOpenModalUpload = () => {
  this.setState({ openUpload: true });
}

handleCloseModalUpload = () => {
  this.setState({ openUpload: false });
  window.location.reload();
};

componentDidMount() {
  this.doFetch();
}

doFetch = (pQuery) => {
  const query = (pQuery||"")
  fetch(`https://intellgentcms.herokuapp.com/sica/api/${this.state.actualTable}?${query}`, {
    method: 'GET',
    headers: {
      'x-access-token': localStorage.getItem("SICAToken")
    },
  }).then(response => response.json().then(
    (json) => {
      let tableInfo = Object.keys(json)[1];
      if (json.success) {
        if (json[tableInfo].length > 0) {

          this.setState({ rowsHeaders: [] });
          let newRowHeaders = [];
          const attributes = (json.atributos||Object.keys(json[tableInfo][0]))
          for (let j = 0; j < attributes.length; j++) {
            let headerToAdd = attributes[j];

            if ( (this.state.actualTable==="lotes" || headerToAdd !== "_id") && headerToAdd !== "__v") {
              let labelsplit = headerToAdd.split(/(?=[A-Z])/);
              let labelToShow = "";
              for (let i = 0; i < labelsplit.length; i++) {
                let word = labelsplit[i];
                if (i === 0) {
                  word = word.charAt(0).toUpperCase() + word.slice(1);
                }
                labelToShow = labelToShow + " " + word;
              }
              newRowHeaders.push({ id: headerToAdd, numeric: false, disablePadding: true, label: labelToShow, original:headerToAdd });

              this.setState({ rowsHeaders: newRowHeaders });
            }
          };
          // if (tableInfo === "casos") {
          //   if(!this.state.rowsHeaders.find(rh=>rh.id==="estado")){
          //     this.setState(prevState => {
          //       prevState.rowsHeaders.push({ id: "estado", numeric: false, disablePadding: true, label: "Estado" });
          //       return ({ rowsHeaders: prevState.rowsHeaders });
          //     })
          //   }
          //
          // }

          if(tableInfo === "actividades"){
            json[tableInfo].sort((r1,r2)=>{
              return  ( new Date(r2.fecha).getTime()-new Date(r1.fecha).getTime())
            })

            return this.setState({ rows: json[tableInfo], rowsCopy: json[tableInfo], loading: false, empty: false,notifications:json.notifications });
          }

          this.setState({ rows: json[tableInfo], rowsCopy: json[tableInfo], loading: false, empty: false,notifications:json.notifications });
        }
        else {
          this.setState({ empty: true, loading: false })
        }
      }
      else {
        if (response.status === 403) {
          localStorage.removeItem("SICAToken");
          window.location.reload();
        }
      }

    }
  ));
}

renderUploadActivityButton = () => {
  const { classes } = this.props;

  if (localStorage.getItem("userType") === "Codensa" && this.state.actualTable === "actividades") {
    return (
      <div>
        <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={this.handleOpenModalUpload}>
          <AddIcon />
        </Fab>
        <NewActivityModal
          open={this.state.openUpload}
          handleCloseModalUpload = {this.handleCloseModalUpload}
          depth = {0}
          nuevoLote = {true}
          concept = {"Nuevo lote"}
          route = {"nuevoLote"}
          >
          </NewActivityModal>
        </div>
      )
    }
  }
  renderActividades = () => {
    return this.state.rows.map( (r,i)=>
    <MainActivity row = {r} key = {i}/>
  )
}

showText(text, type){

  if(text === "" && type === "Obs"){
    return("Ninguna")
  }
  else if(text === "" && type === "URL"){
    return("No disponible")
  }
  else{
    return(text)
  }

}

renderComponents = () => {
  if (this.state.loading) {
    return (<span className="loaderTable" id="loaderTable"></span>)
  }
  else {
    if (!this.state.empty && this.state.actualTable !== "actividades") {
      return (
        <EnhancedTable rowsHeaders={this.state.rowsHeaders} rows={this.state.rows} currentTable={this.state.actualTable} casesQuery ={this.casesQuery}/>
      )
    }
    else if (!this.state.empty && this.state.actualTable === "actividades") {
      return (
        <div>
          <br />
          <Grid>
            {
              this.renderActividades()
            }

          </Grid>
          {
            this.renderUploadActivityButton()
          }
        </div>
      )
    }
    else if (this.state.empty) {
      return (
        <div>
          <br />
          <Grid>
            <span className = "no-la-hay">No hay información para mostrar</span>
          </Grid>
          {
            this.renderUploadActivityButton()
          }
        </div>

      )

    }
  }

}
renderActualTableName() {
  let tableName = this.state.actualTable;
  let tableNameToShow = tableName.charAt(0).toUpperCase() + tableName.slice(1);
  return (tableNameToShow)
}

renderResetSearchButton = () => {
  const { classes, theme } = this.props;

  if (this.state.searching) {
    return (
      <div>
        <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleResetSearch}>
          Borrar búsqueda
        </Button>
      </div>
    )
  }
}
doLogout = ()=>{

  fetch(`https://intellgentcms.herokuapp.com/sica/api/reiniciarNotificaciones`, {
    method: 'GET',
    headers: {
      'x-access-token': localStorage.getItem("SICAToken")
    },
  }).then(r=>{  localStorage.removeItem("SICAToken");
  window.location.reload();})
}
generateConsolidate = ()=>{
  this.setState({consolidateModal:true})

}
closeConsolidateModal = ()=>{
  this.setState({consolidateModal:false})

}
closeClusterModal =()=>{
  this.setState({clusterModal:false})
}
showClusterModal =()=>{
  this.setState({clusterModal:true})
}
render() {


  const { classes, theme } = this.props;
  const drawer = (
    <div>
      <div className={classes.toolbar} />

      <img src="./SICA_Logo.png" alt="SICA Logo" className="sicaLogoMenu" />
      <Divider />
      <List>
        <ListItem button key={"Actividades"}>
          {
            this.state.notifications?(
              <Badge className={classes.margin} color="secondary" variant="dot">
                <Clock />
                <ListItemText primary={"Actividades"} onClick={this.handleClickActividad} />
              </Badge>
            ):(
              <Clock />
            )
          }
          {
            !this.state.notifications&&//toco machetear
            <ListItemText primary={"Actividades"} onClick={this.handleClickActividad} />
          }
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key={"Casos"}>
          <AssignmentIcon />
          <ListItemText primary={"Casos"} onClick={this.handleClickCasos} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key={"Lotes"}>
          <FolderIcon />
          <ListItemText primary={"Lotes"} onClick={this.handleClickLotes} />
        </ListItem>
      </List>
      <Divider />
      {
        localStorage.getItem("userType") === "Comsistelco"&&
        <List>
          <ListItem button key={"nuevosAtributosACasos"}>
            <CloudUpload />
            <ListItemText primary={"Subir cluster"} onClick={this.showClusterModal}/>
            <NewClusterModal  open = {this.state.clusterModal} closeClusterModal  = {this.closeClusterModal}/>
          </ListItem>
        </List>
      }
      {
        localStorage.getItem("userType") === "Comsistelco"&&
        <Divider />
      }
      <List>
        <ListItem button key={"Logout"}>
          <img src="./exit.png" alt="exit" className="exitImg" />
          <ListItemText primary={"Salir"} onClick={ this.doLogout } />
        </ListItem>
      </List>
      <Divider />

    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={toolbarStyle}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.handleDrawerToggle}
            className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap style={{ width: "120px" }}>
              {
                this.renderActualTableName()
              }
            </Typography>
            {this.state.actualTable === "casos"&&
            <div>
              <Fab color="secondary" aria-label="Edit" className={classes.fab} onClick = {()=>{this.setState({openEdit:true}) }}>
                <Icon>edit_icon</Icon>
              </Fab>
                <Icon  className="arrow-back" onClick = {this.handleClickCasos}>arrow_back</Icon>
              <EditCasesModal open = {this.state.openEdit} closeEditModal={()=>{window.location.reload();this.setState({openEdit:false}) }}/>
            </div>
          }
          {this.state.actualTable !== "actividades"&&
          <Paper className={classes.root} elevation={1}>
            <InputBase className={classes.input} placeholder="Buscar" onKeyDown={this.handleSearch} id = "searchInput"/>
            <IconButton className={classes.iconButton} aria-label="Search"  onClick={this.handleSearchClick}>
              <SearchIcon/>
            </IconButton>
          </Paper>

        }

        {
          this.renderResetSearchButton()
        }
        {
          (this.state.actualTable === "casos"&&!this.state.loading&&!this.state.empty)&&
          <Button variant="contained" color="primary" className="summary-button" onClick={this.generateConsolidate}>
            Generar consolidado
          </Button>
        }

        <ExportTableModal open = {this.state.consolidateModal} rowsCopy = {this.state.rowsCopy} rowsHeaders = {this.state.rowsHeaders} closeConsolidateModal = {this.closeConsolidateModal}/>
      </Toolbar>
    </AppBar>
    <nav className={classes.drawer}>
      <Hidden smUp implementation="css">
        <Drawer
          container={this.props.container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={this.state.mobileOpen}
          onClose={this.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <br />
          {
            this.renderComponents()
          }
        </main>
      </div>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
