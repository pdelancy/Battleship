import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import GameBoard from "./components/GameBoard";
import Landing from "./components/Landing";
import BattleStation from "./components/BattleStation";
import Winner from "./components/Winner";
import Loser from "./components/Loser";
import Error from "./components/Error";
import { Route, HashRouter } from 'react-router-dom';


class App extends Component {
  render() {
    return(
      <HashRouter basename='/'>
        <div>
          <Route exact path={"/"} component={Landing}></Route>
          <Route exact path={`/setup/`} component={GameBoard}></Route>
          <Route exact path={`/battleStation`} component={BattleStation}></Route>
          <Route exact path={`/winner`} component={Winner}></Route>
          <Route exact path={`/loser`} component={Loser}></Route>
          <Route exact path={`/error`} component={Error}></Route>
        </div>
      </HashRouter>
    )
  }
}

export default App;
