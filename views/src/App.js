import React, {Component} from 'react';
import './core/App.css';
import {Route, Switch} from "react-router-dom";
import Login from './containers/Login/Login'
import Register from './containers/Register/Register'
import About from './containers/About/About'
import HomePage from './containers/Home/HomePage'
import EditProfile from './containers/User/EditProfile/EditProfile'
import HomeAdmin from './containers/Admin/HomeAdmin/HomeAdmin'
import Unauthorized from './containers/ErrorPage/Unauthorized'

class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route extract path='/login' component={Login}/>
                    <Route extract path='/register' component={Register}/>
                    <Route extract path='/about' component={About}/>
                    <Route extract path='/401' component={Unauthorized}/>
                    <Route extract path='/user/profile/edit' component={EditProfile}/>
                    <Route path='/admin' component={HomeAdmin}/>
                    <Route path='/' component={HomePage}/>
                </Switch>
            </div>
        );
    }
}

export default App;
