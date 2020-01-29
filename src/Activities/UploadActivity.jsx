import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

class NewActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpload: false,
      loading: false,
      error: "",
      success: "",
      fileSelected: false,
      casosRestantes: null
    };

    this.handleUpload = this.handleUpload.bind(this);
    this.sendFile = this.sendFile.bind(this);
    this.renderButtton = this.renderButtton.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
  }

  uploadFile = (archivo) => {
    let formData = new FormData();
    formData.append("file", archivo);
    formData.append("observacion", this.props.observation);

    return fetch(`https://intellgentcms.herokuapp.com/sica/api/${this.props.route}?module=${this.props.typeOfLot}`, {
      method: 'POST',
      headers: {
        'x-access-token': localStorage.getItem("SICAToken")
      },
      body: formData
    }).then(response => response.json());

  }

  async sendFile(e) {
    e.preventDefault();

    if (this.props.concept.trim() !== ""
      && this.props.observation.trim() !== ""
    ) {
      this.setState({ loading: true })
      if (this.refs.file.files[0]) {
        let fileResult = await this.uploadFile(this.refs.file.files[0]);
        if (fileResult.success) {
          const { URLArchivo, idLote } = fileResult;
          fetch("https://intellgentcms.herokuapp.com/sica/api/actividad", {
            method: "POST",
            headers: {
              'x-access-token': localStorage.getItem("SICAToken"),
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              usuario: `${localStorage.getItem("userType")} ${localStorage.getItem("userName")}`,
              observacion: this.props.observation,
              concepto: this.props.concept, //Incluye ya el tipo de lote (módulo)
              profundidad: this.props.depth,
              idActividadPadre: this.props.parentId,
              URLArchivo,
              idLote
            })
          }).then(response => response.json()).then(
            json => {
              if (json.success) {
                this.setState({ loading: false, error: "", success: fileResult.message, casosRestantes: fileResult.casosRestantes })
              } else {
                this.setState({ loading: false, error: fileResult.message, success: "" })
              }
            }
          )
        }
        else {
          this.setState({ loading: false, error: fileResult.message })
          return
        }
      }
      else {
        this.setState({ error: "Debe insertar un archivo", loading: false })
      }
    }
    else {
      this.setState({ error: "Debe ingresar todos los campos", loading: false })
    }
  }

  handleUpload() {
    this.setState({ showUpload: true })
  }


  handleChangeFile() {
    if (this.refs.file.files[0]) {
      this.setState({ fileSelected: true })
    }
  }

  renderButtton() {
    if (this.state.success !== "") {
      return (
        <button className="acceptButton" onClick={this.props.handleCloseModalUpload}>Volver</button>
      )
    }
    if (this.state.fileSelected) {
      return (
        <button className="acceptButton" onClick={this.sendFile}>Aceptar</button>
      )
    }
    return (
      <button className="acceptButton" style={{ cursor: " not-allowed", opacity: "0.6" }}>Aceptar</button>
    )

  }
  renderCasosrestantes = () => {
    let restantes = ""
    for (let i = 0; i < this.state.casosRestantes.length; i++) {
      restantes += this.state.casosRestantes[i] + ", "
    }
    return restantes
  }
  render() {
    return (
      <div>


        <br />
        <div>
          {
            this.props.otro ?
              <input className="inputFile" id="file-upload" type="file" ref="file" name="myimages" onChange={this.handleChangeFile}
                accept="*" /> :
              <input className="inputFile" id="file-upload" type="file" ref="file" name="myimages" onChange={this.handleChangeFile}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
          }
        </div>
        {this.state.loading ? (
          <div>
            <br />
            <span className="loader" id="loader"></span>
            <br />
            <br />
          </div>
        )
          :
          (<div className="cardActionAccept">
            {
              this.renderButtton()
            }
            <p className="errorText">{this.state.error}</p>
            <p className="successText">{this.state.success}</p>
            {(this.state.success !== "" && this.state.casosRestantes) && (
              <div style={{ overflowY: "auto", textAlign: "left", height:"100px" }}>
                Los siguientes casos no estaban en el sistema:{
                  this.renderCasosrestantes()
                }
              </div>
            )}
          </div>)
        }
      </div>
    )
  }
}

NewActivity.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NewActivity);
