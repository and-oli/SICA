import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import "./App.css";
import jsonPrueba from "../ConsolidatedAns/jsonPrueba";
import ContentApp from "./Content/Content";
import CssBaseline from "@material-ui/core/CssBaseline";
import ContentOverlay from "./Content/ContentOverlay";
import SideBar from "./SideBar/SideBar";
import exportxlsx from "../Auxiliary/exportFiles";

const drawerWidth = 200;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up("sm")]: {
      display: "none",
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
  lookOneCaseModalButton: {
    top: theme.spacing.unit * 2,
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
  tablePagination: {
    color: "white",
    fontSize: 12,
  },
  pagination: {
    bottom: theme.spacing.unit * 2,
    right: "38%",
    backgroundColor: "#3f51b5",
    "box-shadow": `
       0px 1px 5px 0px rgb(0 0 0 / 20%),
       0px 2px 2px 0px rgb(0 0 0 / 14%),
       0px 3px 1px -2px rgb(0 0 0 / 12%);
    `,
    position: "fixed",
    borderRadius: 5,
  },
  modalUploadActivity: {
    position: "absolute",
    width: theme.spacing.unit * 80,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
  },
  input: {
    marginLeft: 20,
    flex: 1,
  },
});

const TABLE_NAMES = {
  actividades: "actividades",
  seleccionarCasos: "Seleccionar casos",
  seleccionarConsolidado: "Seleccionar consolidado",
  seleccionarResumen: "Seleccionar resumen",
  lotes: "lotes",
  casos: "casos",
  resumen: "resumen",
  consolidado: "consolidado:",
};

class AppContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      actualTable: "actividades",
      userType: "",
      loading: true,
      rowsHeaders: [],
      rows: [],
      rowsPerPage: 50,
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
      type: "", // Fecha de asignación (1) o última modificación (0)
      page: 0,
      queryAttribute: "ordenado",
      queryAttributeValue: "",
      module: "ANALISIS",
      mes: "",
      currentModuleAttributes: [],
      lookOneCaseModalVisible: false,
      porcentajesDeConsolidado: {},
    };
  }

  handleDrawerToggle = () => {
    this.setState((state) => ({ mobileOpen: !state.mobileOpen }));
  };

  casesQuery = (stateT, f1, f2, type, module) => {
    if (f1) {
      // Utilizar el filtro en la pestaña "Ver casos"
      this.setState(
        {
          actualTable: "casos",
          loading: true,
          searching: false,
          rowsPerPage: 50,
          stateT,
          f1,
          f2,
          type,
          module,
        },
        () =>
          this.doFetch(
            `estado=${stateT}&f1=${f1}&f2=${f2}&type=${type}&module=${module}&perPage=${this.state.rowsPerPage}`
          )
      );
    } else {
      // Cuando se hace click en un numero de la tabla resumen (solamente el parametro stateT tiene valor (ver funcion interpretar en Table.jsx))
      this.setState(
        {
          actualTable: "casos",
          loading: true,
          searching: false,
          rowsPerPage: 50,
          stateT,
        },
        () =>
          this.doFetch(
            `estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}&module=${this.state.module}&perPage=${this.state.rowsPerPage}`
          )
      );
    }
    fetch(
      `http://localhost:3001/sica/api/atributosPorModulo?module=${this.state.module}&perPage=${this.state.rowsPerPage}`,
      {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("SICAToken"),
        },
      }
    )
      .then((response) => response.json())
      .then((json) =>
        this.setState({ currentModuleAttributes: json.atributos })
      );
  };
  //Funcion para cambiar el estado al seleccionar el modulo y mes en (ConsolidatedSelect)
  consolidateSelect = (newModule, mesConsolidado, fechaSeleccionada) => {
    this.setState({ loading: true });
    const newRows = jsonPrueba.rows[newModule].filter((valueFiltro) => {
      if (valueFiltro.fechaDeAsignacion === fechaSeleccionada) {
        return valueFiltro;
      } else return null;
    });
    const porcentajes = jsonPrueba.calcularPorcentajes(newRows);
    if (newRows.length) {
      this.setState({
        module: newModule,
        mes: mesConsolidado,
        actualTable: `consolidado: ${newModule}`,
        searching: false,
        rowsHeaders: jsonPrueba.headers,
        porcentajesDeConsolidado: porcentajes,
        rows: newRows,
        rowsPerPage: 50,
        page: 0,
        rowsCopy: newRows,
        loading: false,
      });
    } else {
      this.setState({
        empty: true,
        loading: false,
        rows: [],
        rowsCopy: [],
      });
    }
  };

  summaryQuery = (f1, f2, type, module) => {
    this.setState(
      {
        actualTable: "resumen",
        page: 0,
        rowsPerPage: 12,
        loading: true,
        searching: false,
        f1,
        f2,
        type,
        module,
      },
      () => this.doFetch(`f1=${f1}&f2=${f2}&type=${type}&module=${module}`)
    );
  };

  nextPage = () => {
    if (!this.state.empty) {
      const searchQuery = this.state.searching ? `&queryAttribute=${this.state.queryAttribute}&queryAttributeValue=${this.state.queryAttributeValue}` : "";
      const idQuery = this.state.rowsCopy[this.state.rowsCopy.length - 1] ? `&lastId=${this.state.rowsCopy[this.state.rowsCopy.length - 1]._id}` : "";
      // this.setState((prevState) => { return { page: prevState.page + 1 }; },
        this.doFetch(`estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}${idQuery}${searchQuery}&module=${this.state.module}&perPage=${this.state.rowsPerPage}`)
        // )
    }
  };

  prevPage = () => {
    // if (this.state.page !== 0) {
    //   if (this.state.empty) {
    //     this.setState({ page: 1 })
    //   }
      const searchQuery = this.state.searching ? `&queryAttribute=${this.state.queryAttribute}&queryAttributeValue=${this.state.queryAttributeValue}` : ""
      const idQuery = this.state.rowsCopy[0] ? `&firstId=${this.state.rowsCopy[0]._id}` : ""
      // this.setState((prevState) => { return { page: prevState.page - 1 } },
        this.doFetch(`estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}${idQuery}${searchQuery}&module=${this.state.module}&perPage=${this.state.rowsPerPage}`)
    // )
  //  }
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    },() => this.doFetch(`estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}&module=${this.state.module}&perPage=${this.state.rowsPerPage}`));
  };

  handleClickCasos = () => {
    this.setState({
      actualTable: "Seleccionar casos",
      page: 0,
      searching: false,
      empty: false,
    });
  };

  handleClickSeleccionarConsolidado = () => {
    this.setState({
      actualTable: "Seleccionar consolidado",
      page: 0,
      searching: false,
      empty: false,
    });
  };

  handleClickConsolidate = () => {
    this.setState({
      actualTable: "Seleccionar resumen",
      page: 0,
      searching: false,
      empty: false,
    });
  };

  handleClickLotes = () => {
    this.setState(
      {
        actualTable: "lotes",
        page: 0,
        loading: true,
        searching: false,
      },
      this.doFetch
    );
  };

  handleClickActividad = () => {
    this.setState(
      {
        actualTable: "actividades",
        loading: true,
        page: 0,
        searching: false,
      },
      this.doFetch
    );
  };

  handleChangeAttributeQueryDropdown = (e) => {
    this.setState({ queryAttribute: e.target.value });
  };

  handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const searchValue = e.target.value;
      if (searchValue.trim() !== "") {
        if (this.state.actualTable === "casos") {
          this.setState(
            {
              queryAttributeValue: searchValue,
              searching: true,
            },
            () =>
              this.doFetch(
                `estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}&queryAttribute=${this.state.queryAttribute}&queryAttributeValue=${this.state.queryAttributeValue}&module=${this.state.module}`
              )
          );
        } else {
          let rowsToShow = [];
          for (let i = 0; i < this.state.rowsCopy.length; i++) {
            for (let j = 0; j < this.state.rowsHeaders.length; j++) {
              let row = this.state.rowsCopy[i];
              let header = this.state.rowsHeaders[j];
              if (row[header.id]) {
                if (
                  row[header.id]
                    .toString()
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                ) {
                  rowsToShow.push(row);
                  break;
                }
              }
            }
          }
          this.setState({ rows: rowsToShow, searching: true });
        }
      }
    }
  };

  handleSearchClick = () => {
    let searchValue = document.getElementById("searchInput").value;
    if (searchValue.trim() !== "") {
      if (this.state.actualTable === TABLE_NAMES.casos) {
        this.setState(
          { queryAttributeValue: searchValue, searching: true },
          () =>
            this.doFetch(
              `estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}&queryAttribute=${this.state.queryAttribute}&queryAttributeValue=${this.state.queryAttributeValue}&module=${this.state.module}`
            )
        );
      } else {
        let rowsToShow = [];
        for (let i = 0; i < this.state.rowsCopy.length; i++) {
          for (let j = 0; j < this.state.rowsHeaders.length; j++) {
            let row = this.state.rowsCopy[i];
            let header = this.state.rowsHeaders[j];
            if (row[header.id]) {
              if (
                row[header.id]
                  .toString()
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              ) {
                rowsToShow.push(row);
                break;
              }
            }
          }
        }
        this.setState({ rows: rowsToShow, searching: true });
      }
    }
  };

  handleResetSearch = () => {
    document.getElementById("searchInput").value = "";
    if (this.state.actualTable === TABLE_NAMES.casos) {
      this.setState({ searching: false }, () =>
        this.doFetch(
          `estado=${this.state.stateT}&f1=${this.state.f1}&f2=${this.state.f2}&type=${this.state.type}&module=${this.state.module}`
        )
      );
    } else {
      this.setState({ rows: this.state.rowsCopy, searching: false });
    }
  };

  handleOpenModalUpload = () => {
    this.setState({ openUpload: true });
  };

  handleCloseModalUpload = () => {
    this.setState({ openUpload: false });
    window.location.reload();
  };

  componentDidMount() {
    this.doFetch();
  }

  doFetch = (pQuery) => {
    const query = pQuery || "";
    this.setState({ loading: true });
    fetch(`http://localhost:3001/sica/api/${this.state.actualTable}?${query}`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("SICAToken"),
      },
    }).then((response) =>
      response.json().then((json) => {
        let tableInfo = Object.keys(json)[1];
        if (json.success) {
          if (json[tableInfo].length > 0) {
            this.setState({ rowsHeaders: [] });
            let newRowHeaders = [];
            const attributes =
              json.atributos || Object.keys(json[tableInfo][0]);
            for (let j = 0; j < attributes.length; j++) {
              let headerToAdd = attributes[j];
              if (
                (this.state.actualTable === TABLE_NAMES.lotes ||
                  headerToAdd !== "_id") &&
                headerToAdd !== "__v"
              ) {
                let labelsplit = headerToAdd.split(/(?=[A-Z])/);
                let labelToShow = "";
                for (let i = 0; i < labelsplit.length; i++) {
                  let word = labelsplit[i];
                  if (i === 0) {
                    word = word.charAt(0).toUpperCase() + word.slice(1);
                  }
                  labelToShow = labelToShow + " " + word;
                }
                newRowHeaders.push({
                  id: headerToAdd,
                  numeric: false,
                  disablePadding: true,
                  label: labelToShow,
                  original: headerToAdd,
                });

                this.setState({ rowsHeaders: newRowHeaders });
              }
            }

            if (tableInfo === TABLE_NAMES.actividades) {
              json[tableInfo].sort((r1, r2) => {
                return (
                  new Date(r2.fecha).getTime() - new Date(r1.fecha).getTime()
                );
              });

              return this.setState({
                rows: json[tableInfo],
                rowsCopy: json[tableInfo],
                loading: false,
                empty: false,
                notifications: json.notifications,
              });
            }

            this.setState({
              rows: json[tableInfo],
              rowsCopy: json[tableInfo],
              loading: false,
              empty: false,
              notifications: json.notifications,
            });
          } else {
            this.setState({
              empty: true,
              loading: false,
              rows: [],
              rowsCopy: [],
            });
          }
        } else {
          if (response.status === 403) {
            localStorage.removeItem("SICAToken");
            window.location.reload();
          }
        }
      })
    );
  };

  showText(text, type) {
    if (text === "" && type === "Obs") {
      return "Ninguna";
    } else if (text === "" && type === "URL") {
      return "No disponible";
    } else {
      return text;
    }
  }

  doLogout = () => {
    fetch(`http://localhost:3001/sica/api/reiniciarNotificaciones`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("SICAToken"),
      },
    }).then((r) => {
      localStorage.removeItem("SICAToken");
      window.location.reload();
    });
  };

  generateConsolidate = () => {
    const { consolidateModal } = this.state;
    this.setState({ consolidateModal: !consolidateModal });
  };

  showClusterModal = () => {
    const { clusterModal } = this.state;
    this.setState({ clusterModal: !clusterModal });
  };

  toggleCasesMenu = () => {
    this.setState((prevState) => ({ openCasesMenu: !prevState.openCasesMenu }));
  };

  onClickFab = () => {
    const { openEdit } = this.state;
    this.setState({ openEdit: !openEdit });
  };

  lookOneCaseModalClick = () => {
    const { lookOneCaseModalVisible } = this.state;
    this.setState({
      lookOneCaseModalVisible: !lookOneCaseModalVisible,
    });
  };

  generarConcolidadoPorL = (module, mes, fileType, id) => {
    let porcentajesConsolidado;
    const newRows = jsonPrueba.rows[module].filter((valueFiltro) => {
      if (valueFiltro.mes === mes && valueFiltro.id === id) {
        return valueFiltro;
      } else return [];
    });
    const porcentajes = jsonPrueba.calcularPorcentajes(newRows);

    if (newRows.length) {
      porcentajesConsolidado = porcentajes;

      exportxlsx(module, newRows, fileType, porcentajesConsolidado);
    }
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <ContentOverlay
          tableNames={TABLE_NAMES}
          classes={classes}
          theme={theme}
          actualTable={this.state.actualTable}
          lookOneCaseModalVisible={this.state.lookOneCaseModalVisible}
          openEdit={this.state.openEdit}
          stateT={this.state.stateT}
          queryAttribute={this.state.queryAttribute}
          mes={this.state.mes}
          rows={this.state.rows}
          porcentajesDeConsolidado={this.state.porcentajesDeConsolidado}
          f1={this.state.f1}
          f2={this.state.f2}
          module={this.state.module}
          consolidateModal={this.state.consolidateModal}
          currentModuleAttributes={this.state.currentModuleAttributes}
          searching={this.state.searching}
          page={this.state.page}
          rowsPerPage={this.state.rowsPerPage}
          handleResetSearch={this.handleResetSearch}
          nextPage={this.nextPage}
          prevPage={this.prevPage}
          handleSearchClick={this.handleSearchClick}
          handleSearch={this.handleSearch}
          generateConsolidate={this.generateConsolidate}
          renderAttributes={this.renderAttributes}
          handleChangeAttributeQueryDropdown={
            this.handleChangeAttributeQueryDropdown
          }
          handleClickSeleccionarConsolidado={
            this.handleClickSeleccionarConsolidado
          }
          handleClickCasos={this.handleClickCasos}
          handleDrawerToggle={this.handleDrawerToggle}
          onClickFab={this.onClickFab}
          lookOneCaseModalClick={this.lookOneCaseModalClick}
          handleChangePage={this.handleChangePage}
          handleChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <SideBar
          classes={classes}
          notifications={this.state.notifications}
          openCasesMenu={this.state.openCasesMenu}
          container={this.props.container}
          mobileOpen={this.state.mobileOpen}
          theme={theme}
          clusterModal={this.state.clusterModal}
          showClusterModal={this.showClusterModal}
          handleDrawerToggle={this.handleDrawerToggle}
          handleClickSeleccionarConsolidado={
            this.handleClickSeleccionarConsolidado
          }
          handleClickLotes={this.handleClickLotes}
          handleClickCasos={this.handleClickCasos}
          handleClickConsolidate={this.handleClickConsolidate}
          handleClickActividad={this.handleClickActividad}
          toggleCasesMenu={this.toggleCasesMenu}
          doLogout={this.doLogout}
        />
        <ContentApp
          generarConcolidadoPorL={this.generarConcolidadoPorL}
          tableNames={TABLE_NAMES}
          handleChangeRowsPerPage={this.handleChangeRowsPerPage}
          handleChangePage={this.handleChangePage}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          classes={classes}
          loading={this.state.loading}
          empty={this.state.empty}
          actualTable={this.state.actualTable}
          rowsHeaders={this.state.rowsHeaders}
          rows={this.state.rows}
          module={this.state.module}
          mes={this.state.mes}
          openUpload={this.state.openUpload}
          consolidateSelect={this.consolidateSelect}
          summaryQuery={this.summaryQuery}
          casesQuery={this.casesQuery}
          handleOpenModalUpload={this.handleOpenModalUpload}
          handleCloseModalUpload={this.handleCloseModalUpload}
        />
      </div>
    );
  }
}

AppContent.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AppContent);
