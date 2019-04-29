import React from 'react';
import "./Activity.css"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

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
              <span> <strong>Archivo: </strong></span>
              {
                  row["URLArchivo"] === ""?(
                      <span>No disponible</span>
                  ):(
                      <a className="downloadAvailable" href={row["URLArchivo"]}>Descargar</a>
                  )
              }
          </CardContent>
        </Card>
        )
    }
}


export default Activity;
