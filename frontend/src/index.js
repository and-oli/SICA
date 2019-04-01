import React, { Component } from 'react';
import ReactDOM from "react-dom";
import ListItemComposition from "./SideBar/SideBar";
import Login from './Login/Login';
import './index.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false
        };
    }

    setLogged = (logged) => {
        this.setState({ logged });
    }
    componentDidMount() {
        if (localStorage.getItem("SICAToken")) {
            this.setState({ logged: true });
        }
        else
            this.setState({ logged: false });
    }
    render() {
        return (
            this.state.logged ? (<ListItemComposition setLogged={this.setLogged} />) : (<Login setLogged={this.setLogged} />)
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

