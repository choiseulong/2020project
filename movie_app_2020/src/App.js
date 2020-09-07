import React from 'react';
import { HashRouter, Route, Link } from "react-router-dom";
import About from "./routes/About";
import Home from "./components/Movie";
function App(){
  return (
    <HashRouter>
      <Route path="/" exact={true}>
        <h1> home </h1>
      </Route>
      <Route path="/about">
        <h1>about</h1>
      </Route>
    </HashRouter>
  );
}
export default App;