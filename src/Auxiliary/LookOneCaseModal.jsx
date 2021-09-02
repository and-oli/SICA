import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Arrow from "@material-ui/icons/ArrowBack";
import DateDetail from "../DateDetail/DateDetail";
import TextField from "@material-ui/core/TextField";

const styles = (theme) => ({
  modal: {
    position: "absolute",
    width: theme.spacing.unit * 80,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "600px",
    overflowY: "scroll",
  },
  button: {
    margin: theme.spacing.unit,
    float: "right",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class LookOneCaseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      currentCase: null,
      id: "",
    };
  }

  handleTextChange = (e) => {
    this.setState({ id: e.target.value });
  };
  handleKeyType = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.submit();
    }
  };
  submit = () => {
    this.setState({ loading: true, error: "", currentCase: null });
    if (this.state.id.trim() !== "") {
      fetch("http://localhost:3001/sica/api/caso/" + this.state.id.trim(), {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("SICAToken"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            if (json.caso) {
              this.setState({
                loading: false,
                error: "",
                currentCase: json.caso,
              });
            } else {
              this.setState({
                loading: false,
                error: "No se encontró un caso con ese número de orden.",
              });
            }
          } else {
            this.setState({ loading: false, error: json.message, success: "" });
          }
        });
    } else {
      this.setState({ loading: false, error: "Ingrese un número de orden" });
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.open}
        onClose={this.props.close}
        className="edit-case-modal"
      >
        <div className={classes.modal}>
          <Arrow onClick={this.props.close} className="arrow" />
          <Typography
            variant="h5"
            component="h2"
            style={{
              display: "inline-block",
              position: "relative",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Buscar una orden
          </Typography>
          <br />
          <Divider />
          <div style={{ marginTop: "50px" }}>
            {this.state.loading ? (
              <div className="cool-loader"></div>
            ) : (
              <div>
                <div>
                  <TextField
                    label="Número de orden"
                    multiline
                    rows="1"
                    value={this.state.id}
                    className="edit-case-modal-field"
                    margin="normal"
                    helperText="Ingrese un número de orden"
                    onChange={this.handleTextChange}
                    onKeyDown={this.handleKeyType}
                    variant="outlined"
                  />
                </div>
                <Button
                  onClick={this.submit}
                  style={{ display: "block", margin: "0 auto" }}
                >
                  Buscar
                </Button>
                {this.state.currentCase && (
                  <div className="consolidate-data-wrapper">
                    <DateDetail
                      data={this.state.currentCase}
                      hideArrow={true}
                    ></DateDetail>
                  </div>
                )}
              </div>
            )}
            <div style={{ color: "red" }}>{this.state.error}</div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles, { withTheme: true })(LookOneCaseModal);
