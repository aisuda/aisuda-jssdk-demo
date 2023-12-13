/**
 * @file App.tsx
 *
 * @created: 2023/12/13
 */

import React from "react";
import { BrowserRouter as Router, Switch, Route, NavLink as Link } from "react-router-dom";
import Home from "./route/Home";
import About from "./route/About";
import ApiCenter from "./route/ApiCenter";
import Model from './route/Model';
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <ul>
            <li>
              <Link activeClassName="selected" exact to="/">Home</Link>
            </li>
            <li>
              <Link activeClassName="selected" to="/about">About</Link>
            </li>
            <li>
              <Link activeClassName="selected" to="/apicenter">服务编排</Link>
            </li>
            <li>
              <Link activeClassName="selected" to="/model">数据模型</Link>
            </li>
          </ul>
        </nav>

        <div className="App-wrapper">
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/apicenter">
              <ApiCenter />
            </Route>
            <Route path="/model">
              <Model />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
