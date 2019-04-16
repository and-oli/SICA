import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Arrow from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import "./UploadFile.css"

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

class UploadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUpload: false,
            loading: false,
            error: "",
            success: "",
            fileSelected : false
        };

        this.handleUpload = this.handleUpload.bind(this);
        this.sendFile = this.sendFile.bind(this);
        this.handleGoBackToTable = this.handleGoBackToTable.bind(this);
        this.renderButtton = this.renderButtton.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
    }

    uploadFile = (archivo) => {
        if (localStorage.getItem("userType") === "Comsistelco") {
            let formData = new FormData();
            formData.append("file", archivo);
            return fetch('https://intellgentcms.herokuapp.com/sica/api/finalizacionInspeccion', {
                method: 'POST',
                headers: {
                    'x-access-token': localStorage.getItem("SICAToken")
                },
                body: formData
            }).then(response => response.json())
        }
        else if (localStorage.getItem("userType") === "Codensa") {
            let formData = new FormData();
            formData.append("file", archivo);
            return fetch('https://intellgentcms.herokuapp.com/sica/api/nuevoLote', {
                method: 'POST',
                headers: {
                    'x-access-token': localStorage.getItem("SICAToken")
                },
                body: formData
            }).then(response => response.json())
        }

    }

    sendFile(e) {
        e.preventDefault();
        if (this.refs.file.files[0]) {
            this.setState({ loading: true })
            this.uploadFile(this.refs.file.files[0]).then(json2 => {
                if (json2.success) {
                    this.setState({ loading: false, error: "", success: json2.message });
                }
                else {
                    this.setState({ error: json2.message, loading: false });
                }
            })
        }
        else {
            this.setState({ error: "No se ha seleccionado ningún archivo" })
        }
    }

    handleUpload() {
        this.setState({ showUpload: true })
    }

    handleGoBackToTable() {
        this.props.switchUploadView(false);
        window.location.reload();
    }

    handleChangeFile(){
        if(this.refs.file.files[0]){
            this.setState({fileSelected : true})
        }
    }

    renderButtton() {
        if (this.state.error === "" && this.state.success === "" && this.state.fileSelected) {
            return (
                <button className="acceptButton" onClick={this.sendFile}>Aceptar</button>
            )
        }
        else {
            return (
                <button className="acceptButton" style={{cursor:" not-allowed", opacity: "0.6"}}>Aceptar</button>
            )
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <br />
                <Grid className="subirArchivo">
                    <Card className={classes.card}>
                        <CardContent>
                            <Arrow onClick={this.handleGoBackToTable} className="arrow" />
                            <br />
                            <Divider />
                            <Typography variant="h5" component="h2">
                                Subir un archivo
                    </Typography>
                        </CardContent>
                        <CardActions>
                            <div>
                                <input className="inputFile" id="file-upload" type="file" ref="file" name="myimages" onChange={this.handleChangeFile}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                            </div>
                        </CardActions>
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
                    </Card>
                </Grid>
            </div>
        )
    }
}

UploadFile.propTypes = {
    classes: PropTypes.object.isRequired,
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(UploadFile);