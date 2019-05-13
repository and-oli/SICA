import React from 'react';
import "./Activity.css"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Activity from './Activity';
import NewActivityModal from './NewActivityModal';
import ModifiedCasesModal from '../EditCases/ModifiedCasesModal';

class MainActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showActivities:false,
      openUpload: false,
      showResultModal:false
    };

  }
  closeResultModal = ()=>{
    this.setState({ showResultModal: false });
  }
  openResultModal = ()=>{
    this.setState({ showResultModal: true });
  }
  handleOpenModalUpload = () => {
    this.setState({ openUpload: true });
  }
  handleCloseModalUpload = () => {
    this.setState({ openUpload: false });
    window.location.reload();
  };
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
  renderActividades=()=>{
    return this.props.row.hijitas.map((h,i)=><Activity content = {h} key = {i} showText = {this.showText}/>);
  }
  handleSwitch = ()=>{
    this.setState(prevState=>({showActivities:!prevState.showActivities}))
  }
  render() {
    let row  = this.props.row
    return (
      <Card  style = {{marginBottom:"20px"}}>
        <CardContent>
          <p><strong>{row["usuario"]}</strong> {row["fecha"]}</p>
          <p ><strong>Concepto:</strong> {row["concepto"]} </p>
          {
            (row["idLote"])&&(<p ><strong>Id del lote:</strong> {this.showText(row["idLote"] , "Obs")}</p>)
          }

          <p ><strong>Observación:</strong> {this.showText(row["observacion"] , "Obs")}</p>

          <div style = {{position:"relative"}}> <strong style={{display:"inline"}}>Archivo: </strong>

          {
            (row["URLArchivo"] === ""||!row["URLArchivo"])?(
              <span>No disponible</span>
            ):(
              <a className="downloadAvailable" href={row["URLArchivo"]}>Descargar</a>
            )
          }
          {
            (row["cambiosCasos"] && row["cambiosCasos"].length>0 )&&(
              <div className="downloadAvailable" onClick = {this.openResultModal}>Mostrar resultado</div>
            )
          }
          {
            (row["concepto"] !== "Cambio manual a estado de casos" )&&(
              <span className="text-right">
                <span className="downloadAvailable" onClick = {this.handleSwitch}>{this.state.showActivities?"Ocultar":"Ver"} respuestas</span>
              </span>
            )
          }

        </div>
        {
          this.state.showActivities && (<div className = "activities-wrapper" >
            {this.renderActividades()}

            <Card className = "new-activity-button" onClick = {this.handleOpenModalUpload}>
              <CardContent>
                Nueva respuesta
            </CardContent>
          </Card>
          <NewActivityModal
            open={this.state.openUpload}
            handleCloseModalUpload = {this.handleCloseModalUpload}
            depth = {1}
            nuevoLote = {false}
            parentId  = {row._id}
            />
          </div>)
        }
        <ModifiedCasesModal closeResultModal = {this.closeResultModal} open = {this.state.showResultModal} results = {row["cambiosCasos"]} culo = {true}/>

      </CardContent>
    </Card>
  )
}
}


export default MainActivity;
