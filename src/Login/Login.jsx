import React from 'react';
import './Login.css';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing.unit,
      marginLeft : theme.spacing.unit * 7,
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
  });

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: "",
            loading: false,
            userType: "Comsistelco"
        };

        this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
    }

    login = (e) => {
        this.setState({ loading: true, loginError: "" });
        e.preventDefault();
        let data = { username: this.refs.username.value, password: this.refs.password.value,role: this.state.userType };
        //fetch('/api/authenticate', {
        fetch(`https://intellgentcms.herokuapp.com/sica/api/authenticateSICA`, {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ loading: false });
                if (!responseJson.success)
                    this.setState({ loginError: responseJson.message });
                else {
                    localStorage.setItem("SICAToken", responseJson.token);
                    localStorage.setItem("userType", this.state.userType);
                    localStorage.setItem("userName", this.refs.username.value);
                    this.props.setLogged(true);
                }

            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleChangeDropdown(e) {
        this.setState({ userType: e.target.value });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className="login">
                    <div className="container ">
                        <div className="profile profile--open">
                            <div className="profile__avatar" id="toggleProfile">
                                <img src="./SICA_Logo.png" alt="SICA" height="150" width="120" className="Logo" />
                            </div>
                            <form className="profile__form" onSubmit={this.login}>
                                <div className="profile__fields">
                                    <div className="field">
                                        <FormControl className={classes.formControl}>
                                            <InputLabel shrink htmlFor="username-tag"> Tipo de usuario</InputLabel>
                                            <Select
                                                value={this.state.userType}
                                                onChange={this.handleChangeDropdown}
                                                input={<Input name="username-tag" id="username-tag" />}
                                                displayEmpty
                                                name="username-tag"
                                                className={classes.selectEmpty}
                                            >
                                                <MenuItem value="Comsistelco">Comsistelco</MenuItem>
                                                <MenuItem value="Codensa">Codensa</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="field">
                                        <input type="text" id="fieldUser" className="input" ref="username" required pattern=".*\S.*" />
                                        <label htmlFor="fieldUser" className="label label1">Username</label>
                                    </div>
                                    <div className="field">
                                        <input type="password" id="fieldPassword" className="input" ref="password" required pattern=".*\S.*" />
                                        <label htmlFor="fieldPassword" className="label label2">Password</label>
                                    </div>
                                    {(!this.state.loading) && (
                                        <div className="profile__footer">
                                            <button className="btn" type="submit">Login</button>
                                        </div>
                                    )
                                    }
                                    {(this.state.loading) && (
                                        <div className="spinner">
                                            <div className="double-bounce1"></div>
                                            <div className="double-bounce2"></div>
                                        </div>
                                    )
                                    }
                                    <label className="login-error" >{this.state.loginError}</label>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Login);
