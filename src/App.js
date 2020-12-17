import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Signup from './pages/signup';
import Logout from './pages/logout';
import Menu from './components/menu';
import tokencheck from './components/tokencheck';

function App() {
  return (
    <Router>
      <Menu />
      <Switch>
        <Route path="/dashboard">{tokencheck(Dashboard)}</Route>
        <Route path="/login"><Login /></Route>
        <Route path="/signup"><Signup /></Route>
        <Route path="/logout"><Logout /></Route>
        <Route path="/"><Home /></Route>
      </Switch>
    </Router>
  );
}

export default App;
