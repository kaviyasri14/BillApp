import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Login from './login'
import Register from './register';
import HomePage from './HomePage';
import Dashboard from './Dashboard';
import Report from "./Report"

function App() {
  return (
    <div className="App">
     <Router>
      <Switch>   
        <Route exact path="/" component={HomePage} />             
        <Route exact path="/login" component={Login} /> 
        <Route exact path="/register" component={Register} />
        <Route exact path="/dashboard" component={Dashboard} />     
        <Route exact path="/report" component={Report} />     
      </Switch>
    </Router>
    </div>
  );
}

export default App;
