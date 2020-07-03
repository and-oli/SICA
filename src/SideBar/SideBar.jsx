
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
import ListIcon from '@material-ui/icons/List';
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
import CaseSelect from '../Tables/CaseSelect';
import SummarySelect from '../Tables/SummarySelect';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

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
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    position: "fixed",
  },
  left: {
    bottom: theme.spacing.unit * 2,
    right: "45%",
    position: "fixed",
  },
  right: {
    bottom: theme.spacing.unit * 2,
    right: "38%",
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
      openEdit: false,
      notifications: 0,
      consolidateModal: false,
      clusterModal: false,
      openCasesMenu: false,
      stateT: "", // Estado del caso (Todos, asignacion incorrecta, cargada epica, etc)
      f1: "",
      f2: "",
      type: "",// Fecha de asignación (1) o última modificación (0)
      page: 0,
      queryAttribute: "ordenado",
      queryAttributeValue: "",
      module: "ANALISIS",
      currentModuleAttributes: [],
    };
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  casesQuery = (stateT, f1, f2, type, module) => {
    if (f1) { // Utilizar el filtro en la pestaña "Ver casos" 
      this.setState({ actualTable: "casos", loading: true, searching: false, stateT, f1, f2, type, module },
        () => this.doFetch(`estado=${stateT}&f1=${f1}&f2=${f2}&type=${type}&module=${module}`)
      );
    }
    else { // Cuando se hace click en un numero de la tabla resumen (solamente el parametro stateT tiene valor (ver funcion interpretar en Table.jsx))
      this.setState({ actualTable: "casos", loading: true, searching: false, stateT },
        () => this.doFetch(`estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}&module=${this.state.module}`)
      );
    }
    fetch(`https://intellgentcms.herokuapp.com/sica/api/atributosPorModulo?module=${this.state.module}`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem("SICAToken")
      },
    }).then(response => response.json()).then(json => this.setState({ currentModuleAttributes: json.atributos }));

  }

  summaryQuery = (f1, f2, type, module) => {
    this.setState({ actualTable: "resumen", loading: true, searching: false, f1, f2, type, module },
      () => this.doFetch(`f1=${f1}&f2=${f2}&type=${type}&module=${module}`)
    );
  }

  nextPage = () => {
    if (!this.state.empty) {
      const searchQuery = this.state.searching ? `&queryAttribute=${this.state.queryAttribute}&queryAttributeValue=${this.state.queryAttributeValue}` : ""
      const idQuery = this.state.rowsCopy[this.state.rowsCopy.length - 1] ? `&lastId=${this.state.rowsCopy[this.state.rowsCopy.length - 1]._id}` : ""

      this.setState((prevState) => { return { page: prevState.page + 1 }; },
        this.doFetch(`estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}${idQuery}${searchQuery}&module=${this.state.module}`))
    }
  }

  prevPage = () => {

    if (this.state.page !== 0) {
      if (this.state.empty) {
        this.setState({ page: 1 })
      }
      const searchQuery = this.state.searching ? `&queryAttribute=${this.state.queryAttribute}&queryAttributeValue=${this.state.queryAttributeValue}` : ""
      const idQuery = this.state.rowsCopy[0] ? `&firstId=${this.state.rowsCopy[0]._id}` : ""
      this.setState((prevState) => { return { page: prevState.page - 1 } },
        this.doFetch(`estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}${idQuery}${searchQuery}&module=${this.state.module}`))
    }
  }

  handleClickCasos = () => {
    this.setState({ actualTable: "Seleccionar casos", searching: false, empty: false }
    );
  }

  handleClickConsolidate = () => {
    this.setState({ actualTable: "Seleccionar resumen", searching: false, empty: false }
    );
  }

  handleClickLotes = () => {
    this.setState({ actualTable: "lotes", loading: true, searching: false },
      this.doFetch
    );
  }

  handleClickActividad = () => {
    this.setState({ actualTable: "actividades", loading: true, searching: false },
      this.doFetch
    );
  }

  handleChangeAttributeQueryDropdown = (e) => {
    this.setState({ queryAttribute: e.target.value })
  }

  handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchValue = e.target.value;
      if (searchValue.trim() !== "") {
        if (this.state.actualTable === "casos") {
          this.setState({ queryAttributeValue: searchValue, searching: true },
            () => this.doFetch(`estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}&queryAttribute=${this.state.queryAttribute}&queryAttributeValue=${this.state.queryAttributeValue}&module=${this.state.module}`)
          );
        } else {
          let rowsToShow = [];
          for (let i = 0; i < this.state.rowsCopy.length; i++) {
            for (let j = 0; j < this.state.rowsHeaders.length; j++) {
              let row = this.state.rowsCopy[i];
              let header = this.state.rowsHeaders[j];
              if (row[header.id]) {

                if (row[header.id].toString().toLowerCase().includes(searchValue.toLowerCase())) {
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
  }

  handleSearchClick = () => {
    let searchValue = document.getElementById("searchInput").value;
    if (searchValue.trim() !== "") {
      if (this.state.actualTable === "casos") {
        this.setState({ queryAttributeValue: searchValue, searching: true },
          () => this.doFetch(`estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}&queryAttribute=${this.state.queryAttribute}&queryAttributeValue=${this.state.queryAttributeValue}&module=${this.state.module}`)
        );
      } else {
        let rowsToShow = [];
        for (let i = 0; i < this.state.rowsCopy.length; i++) {
          for (let j = 0; j < this.state.rowsHeaders.length; j++) {
            let row = this.state.rowsCopy[i];
            let header = this.state.rowsHeaders[j];
            if (row[header.id]) {
              if (row[header.id].toString().toLowerCase().includes(searchValue.toLowerCase())) {
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

  handleResetSearch = () => {
    document.getElementById("searchInput").value = "";
    if (this.state.actualTable === "casos") {
      this.setState({ searching: false },
        () => this.doFetch(`estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}&module=${this.state.module}`)
      );
    } else {
      this.setState({ rows: this.state.rowsCopy, searching: false });
    }
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
    const query = (pQuery || "")
    this.setState({ loading: true })
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
            const attributes = (json.atributos || Object.keys(json[tableInfo][0]))
            for (let j = 0; j < attributes.length; j++) {
              let headerToAdd = attributes[j];

              if ((this.state.actualTable === "lotes" || headerToAdd !== "_id") && headerToAdd !== "__v") {
                let labelsplit = headerToAdd.split(/(?=[A-Z])/);
                let labelToShow = "";
                for (let i = 0; i < labelsplit.length; i++) {
                  let word = labelsplit[i];
                  if (i === 0) {
                    word = word.charAt(0).toUpperCase() + word.slice(1);
                  }
                  labelToShow = labelToShow + " " + word;
                }
                newRowHeaders.push({ id: headerToAdd, numeric: false, disablePadding: true, label: labelToShow, original: headerToAdd });

                this.setState({ rowsHeaders: newRowHeaders });
              }
            };

            if (tableInfo === "actividades") {
              json[tableInfo].sort((r1, r2) => {
                return (new Date(r2.fecha).getTime() - new Date(r1.fecha).getTime())
              })

              return this.setState({ rows: json[tableInfo], rowsCopy: json[tableInfo], loading: false, empty: false, notifications: json.notifications });
            }

            this.setState({ rows: json[tableInfo], rowsCopy: json[tableInfo], loading: false, empty: false, notifications: json.notifications });
          }
          else {
            this.setState({ empty: true, loading: false, rows: [], rowsCopy: [] })
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
            handleCloseModalUpload={this.handleCloseModalUpload}
            depth={0}
            nuevoLote={true}
          >
          </NewActivityModal>
        </div>
      )
    }
  }
  renderActividades = () => {
    return this.state.rows.map((r, i) =>
      <MainActivity row={r} key={i} />
    )
  }

  showText(text, type) {

    if (text === "" && type === "Obs") {
      return ("Ninguna")
    }
    else if (text === "" && type === "URL") {
      return ("No disponible")
    }
    else {
      return (text)
    }

  }

  renderComponents = () => {
    if (this.state.loading) {
      return (<span className="loaderTable" id="loaderTable"></span>)
    }
    else {
      if (this.state.empty) {
        return (
          <div>
            <br />
            <Grid>
              <span className="no-la-hay">No hay información para mostrar</span>
            </Grid>
            {
              this.renderUploadActivityButton()
            }
          </div>
        )
      }
      else if (this.state.actualTable !== "actividades" && this.state.actualTable !== "Seleccionar casos" && this.state.actualTable !== "Seleccionar resumen") {
        return (
          <EnhancedTable rowsHeaders={this.state.rowsHeaders} rows={this.state.rows} currentTable={this.state.actualTable} casesQuery={this.casesQuery} />
        )
      }
      else if (this.state.actualTable === "actividades") {
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
      else if (this.state.actualTable === "Seleccionar resumen") {
        return <div>
          <SummarySelect summaryQuery={this.summaryQuery} />
        </div>
      }
      else {
        return <div>
          <CaseSelect casesQuery={this.casesQuery} />
        </div>
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

  doLogout = () => {
    fetch(`https://intellgentcms.herokuapp.com/sica/api/reiniciarNotificaciones`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem("SICAToken")
      },
    }).then(r => {
      localStorage.removeItem("SICAToken");
      window.location.reload();
    })
  }

  generateConsolidate = () => {
    this.setState({ consolidateModal: true })
  }

  closeConsolidateModal = () => {
    this.setState({ consolidateModal: false })
  }

  closeClusterModal = () => {
    this.setState({ clusterModal: false })
  }

  showClusterModal = () => {
    this.setState({ clusterModal: true })
  }

  toggleCasesMenu = () => {
    this.setState(
      prevState => { return { openCasesMenu: !prevState.openCasesMenu } }
    )
  }

  renderAttributes = () => {
    return this.state.currentModuleAttributes.map(atr =>
      <MenuItem value={atr.nombreEnDB}>{atr.nombreEnArchivo}</MenuItem>
    )
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
              this.state.notifications ? (
                <Badge className={classes.margin} color="secondary" variant="dot">
                  <Clock />
                  <ListItemText primary={"Actividades"} onClick={this.handleClickActividad} />
                </Badge>
              ) : (
                  <Clock />
                )
            }
            {
              !this.state.notifications &&//toco machetear
              <ListItemText primary={"Actividades"} onClick={this.handleClickActividad} />
            }
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={this.toggleCasesMenu} >
            <AssignmentIcon />
            <ListItemText primary="Casos" />
            {this.state.openCasesMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </List>
        <Collapse in={this.state.openCasesMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <List>
              <ListItem button key={"Casos"} style={{ paddingLeft: "30px" }}>
                <ListIcon />
                <ListItemText primary={"Resumen"} onClick={this.handleClickConsolidate} />
              </ListItem>
            </List>
            <List>
              <ListItem button key={"Casos"} style={{ paddingLeft: "30px" }}>
                <SearchIcon />
                <ListItemText primary={"Ver casos"} onClick={this.handleClickCasos} />
              </ListItem>
            </List>
          </List>
        </Collapse>
        <Divider />
        <List>
          <ListItem button key={"Lotes"}>
            <FolderIcon />
            <ListItemText primary={"Lotes"} onClick={this.handleClickLotes} />
          </ListItem>
        </List>
        <Divider />
        {
          // localStorage.getItem("userType") === "Comsistelco" &&
          // <List>
          //   <ListItem button key={"nuevosAtributosACasos"}>
          //     <CloudUpload />
          //     <ListItemText primary={"Subir cluster"} onClick={this.showClusterModal} />
          //     <NewClusterModal open={this.state.clusterModal} closeClusterModal={this.closeClusterModal} />
          //   </ListItem>
          // </List>
        }
        {
          localStorage.getItem("userType") === "Comsistelco" &&
          <Divider />
        }
        <List>
          <ListItem button key={"Logout"}>
            <img src="./exit.png" alt="exit" className="exitImg" />
            <ListItemText primary={"Salir"} onClick={this.doLogout} />
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
            <Typography variant="h6" color="inherit" noWrap style={{ width: "auto" }}>
              {
                this.renderActualTableName()
              }
            </Typography>
            {(this.state.actualTable === "Seleccionar casos") &&
              <div>
                <Fab color="secondary" aria-label="Edit" className={classes.fab} onClick={() => { this.setState({ openEdit: true }) }}>
                  <Icon>edit_icon</Icon>
                </Fab>
                <EditCasesModal open={this.state.openEdit} closeEditModal={() => { window.location.reload(); this.setState({ openEdit: false }) }} />
              </div>
            }
            {(this.state.actualTable === "casos") &&
              <div>
                <Fab color="secondary" aria-label="Edit" className={classes.fab} onClick={() => { this.setState({ openEdit: true }) }}>
                  <Icon>edit_icon</Icon>
                </Fab>

                <Icon className="arrow-back" onClick={this.handleClickCasos}>arrow_back</Icon>
                <EditCasesModal open={this.state.openEdit} closeEditModal={() => { window.location.reload(); this.setState({ openEdit: false }) }} />
              </div>
            }
            {
            (this.state.actualTable === "casos" || this.state.actualTable === "actividades") &&
              <div>
                <Fab color="primary" aria-label="Edit" className={classes.left} onClick={this.prevPage}>
                  <Icon>keyboard_arrow_left</Icon>
                </Fab>
                <Fab color="primary" aria-label="Edit" className={classes.right} onClick={this.nextPage}>
                  <Icon>keyboard_arrow_right</Icon>
                </Fab>
              </div>
            }
            {this.state.actualTable === "casos" &&
              <span className="select-info-wrapper">
                <span className="select-info">{this.state.module}</span>
                <span className="select-info">{this.state.stateT}</span>
                <span className="select-info">Fecha de {this.state.type ? "asignación " : "última modificación "}entre</span>
                <span className="select-info">{this.state.f1}</span>
                <span className="select-info">y</span>
                <span className="select-info">{this.state.f2}</span>
              </span>
            }
            {this.state.actualTable === "casos" &&
              <Select
                value={this.state.queryAttribute}
                onChange={this.handleChangeAttributeQueryDropdown}
                input={<Input name="newState" id="state-label-placeholder" />}
                displayEmpty
                name="newState"
                className="attributeSelector"
              >
                <MenuItem value="ordenado">ORDENADO</MenuItem>
                <MenuItem value="estado">ESTADO</MenuItem>
                {this.renderAttributes()}
              </Select>

            }
            {
              (this.state.actualTable === "casos" && !this.state.loading && !this.state.empty) &&
              <Button variant="contained" color="primary" className="summary-button" onClick={this.generateConsolidate}>
                Generar consolidado
            </Button>
            }
            {this.state.actualTable !== "actividades" && this.state.actualTable !== "Seleccionar casos" && this.state.actualTable !== "Seleccionar resumen" &&
              <Paper className={classes.root} elevation={1}>
                <InputBase className={classes.input} placeholder="Buscar" onKeyDown={this.handleSearch} id="searchInput" />
                <IconButton className={classes.iconButton} aria-label="Search" onClick={this.handleSearchClick}>
                  <SearchIcon />
                </IconButton>
              </Paper>

            }
            {
              this.renderResetSearchButton()
            }

            <ExportTableModal stateT={this.state.stateT} f1={this.state.f1} f2={this.state.f2} type={this.state.type} open={this.state.consolidateModal} closeConsolidateModal={this.closeConsolidateModal} module={this.state.module} />
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
