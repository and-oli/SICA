import React from "react";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FolderIcon from "@material-ui/icons/Folder";
import AssignmentIcon from "@material-ui/icons/Description";
import ListIcon from "@material-ui/icons/List";
import Clock from "@material-ui/icons/Alarm";
import SearchIcon from "@material-ui/icons/Search";
import Badge from "@material-ui/core/Badge";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import ListAltIcon from "@material-ui/icons/ListAlt";

export default class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const drawer = (
      <div>
        <div className={this.props.classes.toolbar} />
        <img src="./SICA_Logo.png" alt="SICA Logo" className="sicaLogoMenu" />
        <Divider />
        <List>
          <ListItem
            button
            key={"Actividades"}
            onClick={this.props.handleClickActividad}
          >
            {this.props.notifications ? (
              <Badge
                className={this.props.classes.margin}
                color="secondary"
                variant="dot"
              >
                <Clock />
                <ListItemText primary={"Actividades"} />
              </Badge>
            ) : (
              <Clock />
            )}
            {!this.props.notifications && ( //toco machetear
              <ListItemText
                primary={"Actividades"}
                onClick={this.props.handleClickActividad}
              />
            )}
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={this.props.toggleCasesMenu}>
            <AssignmentIcon />
            <ListItemText primary="Casos" />
            {this.props.openCasesMenu ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </List>
        <Collapse in={this.props.openCasesMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <List>
              <ListItem
                button
                key={"Casos"}
                style={{ paddingLeft: "30px" }}
                onClick={this.props.handleClickConsolidate}
              >
                <ListIcon />
                <ListItemText primary={"Resumen"} />
              </ListItem>
            </List>
            <List>
              <ListItem
                button
                key={"Casos"}
                style={{ paddingLeft: "30px" }}
                onClick={this.props.handleClickCasos}
              >
                <SearchIcon />
                <ListItemText primary={"Ver casos"} />
              </ListItem>
            </List>
          </List>
        </Collapse>
        <Divider />
        <List>
          <ListItem button key={"Lotes"} onClick={this.props.handleClickLotes}>
            <FolderIcon />
            <ListItemText primary={"Lotes"} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key={"consolidado"}
            onClick={this.props.handleClickSeleccionarConsolidado}
          >
            <ListAltIcon />
            <ListItemText primary={"Consolidado"} />
          </ListItem>
        </List>
        <Divider />
        {
          // localStorage.getItem("userType") === "Comsistelco" &&
          // <List>
          //   <ListItem button key={"nuevosAtributosACasos"}>
          //     <CloudUpload />
          //     <ListItemText primary={"Subir cluster"} onClick={this.props.showClusterModal} />
          //     <NewClusterModal open={this.props.clusterModal} closeClusterModal={this.showClusterModal} />
          //   </ListItem>
          // </List>
        }
        {localStorage.getItem("userType") === "Comsistelco" && <Divider />}
        <List>
          <ListItem button key={"Logout"}>
            <img src="./exit.png" alt="exit" className="exitImg" />
            <ListItemText primary={"Salir"} onClick={this.props.doLogout} />
          </ListItem>
        </List>
        <Divider />
      </div>
    );

    return (
      <nav className={this.props.classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            container={this.props.container}
            variant="temporary"
            anchor={this.props.theme.direction === "rtl" ? "right" : "left"}
            open={this.props.mobileOpen}
            onClose={this.props.handleDrawerToggle}
            classes={{
              paper: this.props.classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: this.props.classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    );
  }
}
