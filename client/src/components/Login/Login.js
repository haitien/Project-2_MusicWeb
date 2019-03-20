import React, {Component} from 'react'
import style from './Login.module.css'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid'

class Login extends Component {
    constructor(props) {
        super(props);
        this.inputChange = this.inputChange.bind(this)
        this.validate = this.validate.bind(this)
        this.state = {
            username: '',
            password: '',
            usernameIsValid: true,
            passwordIsValid: true,
            loginFail: false
        }
    }

    login(event) {
        event.preventDefault();
        if (!this.state.usernameIsValid || !this.state.passwordIsValid) {
            return;
        }
        const username = event.target['username'].value
        const password = event.target['password'].value
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({username: username, password: password}),
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }
        }).then(function (res) {
            return res.json()
        }).then(function (json) {
            if (json.result) {
                this.props.history.push('/')
            } else {
                this.setState({loginFail: true})
            }
        }.bind(this))
    }

    inputChange(event) {
        const value = event.target.value
        if (event.target.name === 'username') {
            this.setState({username: value})
        } else {
            this.setState({password: value})
        }
    }

    validate(event) {
        if (event.target.name === 'username') {
            this.validateUsername(event.target.value)
        } else {
            this.validatePassword(event.target.value)
        }
        this.setState({loginFail: false})
    }

    validateUsername(value) {
        const regex = /^\s+$/;
        if (!value || regex.test(value)) {
            this.setState({usernameIsValid: false})
        } else {
            this.setState({usernameIsValid: true})
        }
    }

    validatePassword(value) {
        const regex = /^\s+$/;
        if (!value || regex.test(value)) {
            this.setState({passwordIsValid: false})
        } else {
            this.setState({passwordIsValid: true})
        }
    }

    render() {
        return (
            <Grid container>
                <Grid item xs={false} sm={4}></Grid>
                <Grid item xs={12} sm={4}>
                    <Paper className={style.paper}>
                        <Avatar className={style.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form className={style.form} onSubmit={this.login.bind(this)}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input id="username" name="username" autoComplete="username" autoFocus
                                       onChange={this.inputChange} onBlur={this.validate}
                                       error={!this.state.usernameIsValid}/>
                            </FormControl>
                            {!this.state.usernameIsValid &&
                            <div className={style.alert}>Username must not be empty !</div>}
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input name="password" type="password" id="password" autoComplete="password"
                                       onChange={this.inputChange} onBlur={this.validate}
                                       error={!this.state.passwordIsValid}/>
                            </FormControl>
                            {!this.state.passwordIsValid &&
                            <div className={style.alert}>Password must not be empty !</div>}
                            {this.state.loginFail && <div className={style.alert}>Wrong username or password !</div>}
                            <Button type="submit" fullWidth variant="contained" color="primary" className={style.login}>
                                Sign in
                            </Button>
                            <div className={style.link}>
                                <Link to='/register'>Don't have account? Register
                                </Link>
                            </div>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={false} sm={4}></Grid>
            </Grid>
        )
    }
}

export default Login

