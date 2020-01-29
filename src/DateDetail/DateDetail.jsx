import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Arrow from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import "./DateDetail.css";

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
    root: {
        width: '90%',
        marginTop: theme.spacing.unit * 3,
        marginBottom: "10px",
        marginLeft: "5%",
        overflowX: 'auto',
    },
    table: {
        minWidth: 260,
    },
});

class DateDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.handleGoBackToTable = this.handleGoBackToTable.bind(this);
    }
    handleGoBackToTable() {
        this.props.handleClose();
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Arrow onClick={this.handleGoBackToTable} className="arrow" />
                <br />
                <Divider />
                <Typography variant="h5" component="h2">
                    Detalle del caso
                </Typography>
                <br/>
                <Typography className="ordenadoText">
                    <strong>Ordenado: </strong>
                    {this.props.data.ordenado}
                </Typography>
                <Paper className={classes.root} style ={{overflowY: "auto", height: "500px"}}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>Fecha</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>Estado</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>Observaciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.data.cambiosDeEstado.map((row,i) => {
                                    return (
                                      <TableRow key={i}>
                                            <TableCell align="center" >{row.fecha}</TableCell>
                                            <TableCell align="center">{row.nuevoEstado}</TableCell>
                                            <TableCell align="center">{row.observacion}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

DateDetail.propTypes = {
    classes: PropTypes.object.isRequired,
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(DateDetail);
