/*
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
*/

import React from "react";
import MapBox from "./MapBox";
import { Switch, Route } from "react-router-dom";
import FoF from "./FoF";
import Statistics from "./Statistics";

const Main = () => {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={MapBox} />
        <Route exact path="/stats" component={Statistics} />
        <Route component={FoF} />
      </Switch>
    </main>
  );
};

export default Main;
