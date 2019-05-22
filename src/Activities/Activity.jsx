import React from 'react';
import "./Activity.css"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ModifiedCasesModal from '../EditCases/ModifiedCasesModal';

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          showResultModal:false

        };

    }
    closeResultModal = ()=>{
      this.setState({ showResultModal: false });
    }
    openResultModal = ()=>{
      this.setState({ showResultModal: true });
    }
    render() {
      let row  = this.props.content
      let showText = this.props.showText
        return (
          <Card className = "activity">
            <CardContent>
              <p><strong>{row["usuario"]}</strong> {row["fecha"]}</p>
              <p ><strong>Concepto:</strong> {row["concepto"]} </p>
              <p ><strong>Observación:</strong> {showText(row["observacion"] , "Obs")}</p>
              <div style = {{position:"relative"}}> <strong style={{display:"inline"}}>Archivo: </strong>

              {
                (row["URLArchivo"] === ""||!row["URLArchivo"])?(
                  <span>No disponible</span>
                ):(
                  <a className="downloadAvailable" href={row["URLArchivo"]} target ="_blank" >Descargar</a>
                )
              }
              {
                (row["cambiosCasos"] && row["cambiosCasos"].length>0 )&&(
                  <div className="downloadAvailable" onClick = {this.openResultModal}>Mostrar resultado</div>
                )
              }
            </div>
              <ModifiedCasesModal closeResultModal = {this.closeResultModal} open = {this.state.showResultModal} results = {row["cambiosCasos"]}/>

          </CardContent>
        </Card>
        )
    }
}


export default Activity;
