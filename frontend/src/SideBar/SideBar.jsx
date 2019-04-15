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
import UploadFile from "../UploadFile/UploadFile";
import DateDetail from "../DateDetail/DateDetail";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
    }
});

class ResponsiveDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            actualTable: "Casos",
            userType: "",
            showUpload: false,
            showDateDetail: false,
            loading: true,
            rowsHeaders: [],
            rows: [],
            rowData: "",
            rowsCopy: [],
            searching: false,
            empty: false
        };

        // This binding is necessary to make `this` work in the callback
        this.handleClickCasos = this.handleClickCasos.bind(this);
        this.handleClickLotes = this.handleClickLotes.bind(this);
        this.switchUploadView = this.switchUploadView.bind(this);
        this.switchDateDetailView = this.switchDateDetailView.bind(this);
        this.doFetchLotes = this.doFetchLotes.bind(this);
        this.doFetchCasos = this.doFetchCasos.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleResetSearch = this.handleResetSearch.bind(this);
        this.renderResetSearchButton = this.renderResetSearchButton.bind(this);
    }
    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    handleClickCasos() {
        this.doFetchCasos();
        this.setState({ actualTable: "Casos", showUpload: false, showDateDetail: false, loading: true });
    }

    handleClickLotes() {
        this.doFetchLotes();
        this.setState({ actualTable: "Lotes", showUpload: false, showDateDetail: false, loading: true });
    }

    switchUploadView(value) {
        this.setState({ showUpload: value });
    }

    switchDateDetailView(value, data) {
        this.setState({ showDateDetail: value, rowData: data });
    }

    handleSearch(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            let searchValue = e.target.value.trim();
            let rowsToShow = [];
            this.state.rowsCopy.map(row => {
                this.state.rowsHeaders.map(header => {
                    if (row[header.id] === searchValue) {
                        rowsToShow.push(row);
                    }
                    return null;
                })
                return null;
            });
            this.setState({ rows: rowsToShow, searching: true })
        }

    }

    handleResetSearch() {
        this.setState({ rows: this.state.rowsCopy, searching: false });
        document.getElementById("searchInput").value = "";
    }

    componentDidMount() {
        this.doFetchCasos();
    }

    doFetchCasos() {
        return fetch('https://intellgentcms.herokuapp.com/sica/api/casos', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem("SICAToken")
            },
        }).then(response => response.json().then(
            (json) => {
                if (json.success) {
                    if (json.casos.length > 0) {
                        //Table row header
                        this.setState({ rowsHeaders: [] });
                        Object.keys(json.casos[0]).map(headerToAdd => {
                            if (headerToAdd !== "_id" && headerToAdd !== "__v") {
                                this.setState(prevState => {
                                    let labelsplit = headerToAdd.split(/(?=[A-Z])/);
                                    let labelToShow = "";
                                    labelsplit.map((word, i) => {
                                        if (i === 0) {
                                            word = word.charAt(0).toUpperCase() + word.slice(1);
                                        }
                                        labelToShow = labelToShow + " " + word;
                                        return ("");
                                    })
                                    prevState.rowsHeaders.push({ id: headerToAdd, numeric: false, disablePadding: true, label: labelToShow });
                                    return ({ rowsHeaders: prevState.rowsHeaders });
                                })
                            }
                            return ("");
                        });
                        //Table rows information
                        this.setState({ rows: json.casos, rowsCopy: json.casos });
                        this.setState({ loading: false });
                    }
                    else {
                        this.setState({ empty: true, loading: false })
                    }
                }
                else {
                    if (response.status === 403) {
                        localStorage.removeItem("SICAToken"); window.location.reload();
                    }
                }

            }
        ));
    }

    doFetchLotes() {
        return fetch('https://intellgentcms.herokuapp.com/sica/api/lotes', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem("SICAToken")
            },
        }).then(response => response.json().then(
            (json) => {
                if (json.success) {
                    if (json.lotes.length > 0) {
                        //Table row header
                        this.setState({ rowsHeaders: [] });
                        Object.keys(json.lotes[0]).map(headerToAdd => {
                            if (headerToAdd !== "__v") {
                                this.setState(prevState => {
                                    let labelsplit = headerToAdd.split(/(?=[A-Z])/);
                                    let labelToShow = "";
                                    labelsplit.map((word, i) => {
                                        if (i === 0) {
                                            word = word.charAt(0).toUpperCase() + word.slice(1);
                                        }
                                        labelToShow = labelToShow + " " + word;
                                        return ("");
                                    })
                                    prevState.rowsHeaders.push({ id: headerToAdd, numeric: false, disablePadding: true, label: labelToShow });
                                    return ({ rowsHeaders: prevState.rowsHeaders });
                                })
                            }
                            return ("");
                        });

                        //Table rows information
                        this.setState({ loading: false });
                        this.setState({ rows: json.lotes, rowsCopy: json.lotes });
                    }
                    else {
                        this.setState({ empty: true, loading: false })
                    }
                }
                else {
                    if (json.message === "Failed to authenticate token.") {
                        localStorage.removeItem("SICAToken"); window.location.reload();
                    }
                }

            }
        ));
    }

    renderUploadFile() {
        if (localStorage.getItem("userType") === "Codensa" && this.state.actualTable === "Lotes") {
            return (
                <div>
                    <button className="uploadButton" type="button" onClick={() => { this.switchUploadView(true) }}>Agregar nuevo lote</button>
                </div>
            );
        }
        else if (localStorage.getItem("userType") === "Comsistelco" && this.state.actualTable === "Casos") {
            return (
                <div>
                    <button className="uploadButtonCasos" type="button" onClick={() => { this.switchUploadView(true) }}>Subir finalización de inspecciones</button>
                </div>
            );
        }
    }

    renderComponents() {
        if (this.state.loading) {
            return (<span className="loaderTable" id="loaderTable"></span>)
        }
        else {
            if (!this.state.showUpload && !this.state.showDateDetail && !this.state.empty) {
                return (
                    <EnhancedTable rowsHeaders={this.state.rowsHeaders} rows={this.state.rows} switchDateDetailView={this.switchDateDetailView} currentTable={this.state.actualTable} />
                )
            }
            else if (this.state.showDateDetail) {
                return (<DateDetail switchDateDetailView={this.switchDateDetailView} data={this.state.rowData}></DateDetail>)
            }
            else if (this.state.showUpload) {
                return (
                    <div>
                        <UploadFile switchUploadView={this.switchUploadView} currentUser />
                    </div>
                )
            }
            else if (this.state.empty) {
                return (
                    <div>
                        <br />
                        <Grid>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        No hay información para mostrar
                                </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </div>
                )

            }
        }

    }

    renderResetSearchButton() {
        if (this.state.searching) {
            return (
                <div>
                    <button className="resetSearchButton" onClick={this.handleResetSearch}>Borrar búsqueda</button>
                </div>
            )
        }
    }
    render() {
        const { classes, theme } = this.props;

        const drawer = (
            <div>
                <div className={classes.toolbar} />

                <img src="./SICA_Logo.png" alt="SICA Logo" />
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
                <List>
                    <ListItem button key={"Logout"}>
                        <img src="./exit.png" alt="exit image" className="exitImg" />
                        <ListItemText primary={"Salir"} onClick={() => { localStorage.removeItem("SICAToken"); window.location.reload(); }} />
                    </ListItem>
                </List>
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
                        <Typography variant="h6" color="inherit" noWrap style={{ width: "100px" }}>
                            {this.state.actualTable}
                        </Typography>
                        {
                            this.renderUploadFile(classes)
                        }
                        <form style={{ marginLeft: "20%" }}>
                            <input type="text" name="search" placeholder="Buscar..." id="searchInput" className="searchBarTable" onKeyDown={this.handleSearch} />
                        </form>
                        {
                            this.renderResetSearchButton()
                        }
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer}>
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);