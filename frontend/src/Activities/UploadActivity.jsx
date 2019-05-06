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
      fileSelected: false
    };

    this.handleUpload = this.handleUpload.bind(this);
    this.sendFile = this.sendFile.bind(this);
    this.renderButtton = this.renderButtton.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
  }

  uploadFile = (archivo) => {
    let formData = new FormData();
    formData.append("file", archivo);
    return fetch('http://localhost:3001/sica/api/'+this.props.route, {
      method: 'POST',
      headers: {
        'x-access-token': localStorage.getItem("SICAToken")
      },
      body: formData
    }).then(response => response.json());

  }

  async sendFile(e) {
    e.preventDefault();

    if (this.props.concept.trim() !==""
    &&this.props.observation.trim() !==""
  ) {
    this.setState({ loading: true })
    let URLArchivo = ""
    if(this.state.fileSelected) {
      let fileResult = await this.uploadFile(this.refs.file.files[0]);
      if(fileResult.success){
        const {URLArchivo, idLote} = fileResult;
        fetch("http://localhost:3001/sica/api/actividad", {
          method: "POST",
          headers: {
            'x-access-token': localStorage.getItem("SICAToken"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario: localStorage.getItem("userType"),
            observacion: this.props.observation,
            concepto: this.props.concept,
            profundidad: this.props.depth,
            idActividadPadre:this.props.parentId,
            URLArchivo,
            idLote
          })
        }).then(response => response.json()).then(
          json=>
          this.setState({ loading: false, error: "", success: json.message })
        )
      }
      else{
        this.setState({loading: false,  error: fileResult.message })
        return
      }
    }

  }
  else {
    this.setState({ error: "Debe ingresar todos los campos" })
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
  if(this.state.success !==""){
    return (
      <button className="acceptButton" onClick={this.props.handleCloseModalUpload}>Volver</button>
    )
  }
  if (this.state.fileSelected || !this.state.nuevoLote ) {
    return (
      <button className="acceptButton" onClick={this.sendFile}>Aceptar</button>
    )
  }
  return (
    <button className="acceptButton" style={{ cursor: " not-allowed", opacity: "0.6" }}>Aceptar</button>
  )

}

render() {
  return (
    <div>


      <br />
      <div>
        <input className="inputFile" id="file-upload" type="file" ref="file" name="myimages" onChange={this.handleChangeFile}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
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
        </div>)
      }
    </div>
  )
}
}

NewActivity.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NewActivity);
