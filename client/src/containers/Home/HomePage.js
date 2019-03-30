import React, {Component} from 'react'
import styles from './Homepage.module.css';
import axios from 'axios';
import Navbar from "../../components/Navbar/Navbar";
import {actionLogout, actionLogin} from "../../js/store";
import {connect} from "react-redux";
import API from '../../js/api_constants';
import Footer from "../../components/Footer/Footer";
import {withRouter} from "react-router-dom";

class HomePage extends Component {
    constructor(props) {
        super(props);
        axios.get(API.USER + API.IS_USER).then(response => {
            this.props.actionLogin(response.data);
        }).catch(() => {
            this.props.actionLogout();
        });
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <Navbar/>
                <div style={{flex: '1 1 700px'}}>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default withRouter(connect(null, {actionLogout, actionLogin})(HomePage));