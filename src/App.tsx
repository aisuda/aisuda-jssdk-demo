/**
 * @file App.tsx
 *
 * @created: 2023/12/13
 */

import React from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import { Select } from "antd";
import { I18nContext, DEFAULT_LOCALE } from "./context/i18n";
import Home from "./route/Home";
import ApiCenter from "./route/ApiCenter";
import Model from "./route/Model";
import I18n from "./route/I18n";
import Perm from './route/Perm';
import "./styles/App.css";

function App() {
  const lsLocale = localStorage.getItem('locale') || DEFAULT_LOCALE;
  const [locale] = React.useState<string>(lsLocale);

  function handleLocaleChange(value: string) {
    localStorage.setItem('locale', value);
    window.location.reload();
  }

  return (
    <I18nContext.Provider value={{locale}}>
      <BrowserRouter>
        <div className="App">
          <nav className="App-nav">
            <ul>
              <li>
                <NavLink activeClassName="selected" exact to="/">
                  介绍
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="selected" to="/apicenter">
                  服务编排
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="selected" to="/model">
                  数据模型
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="selected" to="/i18n">
                  多语言
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="selected" to="/perm">
                  权限
                </NavLink>
              </li>
            </ul>
            <Select
              onChange={handleLocaleChange}
              style={{ width: 80 }}
              defaultValue={locale}
              options={[
                { value: "zh-CN", label: "中文" },
                { value: "en-US", label: "英语" },
              ]}
            />
          </nav>

          <div className="App-wrapper">
            <Switch>
              <Route path="/apicenter">
                <ApiCenter />
              </Route>
              <Route path="/model">
                <Model />
              </Route>
              <Route path="/i18n">
                <I18n />
              </Route>
              <Route path="/perm">
                <Perm />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </I18nContext.Provider>
  );
}

export default App;
