import React, {Component} from "react";
import {Typography} from "@material-ui/core";
import styles from './Navbar.module.css'
import Grid from "@material-ui/core/Grid";
import ExpandMoreRounded from '@material-ui/icons/ExpandMoreRounded'
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {actionLogout} from "../../js/store";
import {connect} from "react-redux";
import axios from 'axios';
import API from '../../js/api_constants';
import {Link} from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import {withRouter} from "react-router-dom";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorMenu: null,
        };
    }

    onClickAvatar = (event) => {
        this.setState({anchorMenu: event.currentTarget})
    };
    onCloseMenu = () => {
        this.setState({anchorMenu: null})
    };
    onClickLogout = () => {
        this.setState({anchorMenu: null});
        axios.post(API.USER + API.LOGOUT, {}).then(() => {
            this.setState({anchorMenu: null});
            this.props.actionLogout();
        }).catch(() => {
            // TODO show error logout fail
        });
    };
    onClickProfile = () => {
        this.setState({anchorMenu: null});
        this.props.history.push('/user/profile/edit');
    };

    LoginRegister =
        <div className={styles.navbar_right}>
            <Link className={styles.link} to='/login'>
                Login
            </Link>
            <div className={styles.link}>/</div>
            <Link className={styles.link} to='/register'>
                Register
            </Link>
        </div>;

    render() {
        const {anchorMenu} = this.state;
        const {user, isLogin} = this.props;
        return (
            <Grid container className={styles.wrapper}>
                <Grid item md={1} sm={false} xs={false}/>
                <Grid item md={10} sm={12} xs={12} className={styles.d_flex}>
                    <div className={styles.navbar_brand}>
                        <Typography variant='h4' className={styles.normal_text}>StarScream</Typography>
                    </div>
                    <div className={styles.navbar_search}>
                        <SearchBar/>
                    </div>
                    {isLogin ?
                        <div className={styles.navbar_right + " " + styles.avatar_wrap} onClick={this.onClickAvatar}>
                            <div>
                                <img className={styles.avatar} alt='avatar' src={user.avatar}/>
                            </div>
                            <div>
                                <span className={styles.first_name}>{user.first_name}</span>
                            </div>
                            <ExpandMoreRounded className={styles.normal_text}/>
                        </div> : this.LoginRegister}
                </Grid>
                <Grid item md={1} sm={false} xs={false}></Grid>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorMenu}
                    open={Boolean(anchorMenu)}
                    onClose={this.onCloseMenu}>
                    <MenuItem onClick={this.onCloseMenu}>Profile</MenuItem>
                    <MenuItem onClick={this.onClickProfile}>Edit profile</MenuItem>
                    <MenuItem onClick={this.onClickLogout}>Logout</MenuItem>
                </Menu>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    const {isLogin, user} = state;
    return {isLogin: isLogin, user: user}
};

export default withRouter(connect(mapStateToProps, {actionLogout})(Navbar));