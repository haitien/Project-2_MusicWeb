import React, { Component } from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import Login from './components/Login/Login.js'
import Register from './components/Register/Register.js'
import About from './components/About.js'
import HomePage from './containers/Home/HomePage.js'
class App extends Component {
  render() {
    return (
      <div>
          <Switch>
              <Route extract path='/login' component={Login}/>
              <Route extract path='/register' component={Register}/>
              <Route extract path='/about' component={About}/>
              <Route path='/' component={HomePage}/>
          </Switch>
      </div>
    );
  }
}
export default App;
