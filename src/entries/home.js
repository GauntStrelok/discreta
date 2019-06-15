import React from "react";
import ReactDOM, {render} from "react-dom";
import { Route, Link, HashRouter as Router } from 'react-router-dom'
//import MediaContainer from "./playlist/components/mediaContainer";
//import data from "./json/cosas.json";
import Home from "../pages/containers/home"
import PropositionalLogic from "../contents/components/PropositionalLogic"

const app = document.getElementById("app");
const message = <p>Hack to do react2!!</p>;
//render(<Media title="Un titulo azul" />,app)
render(<Router>
  <Route path="/" component={Home} />
  <Route path="/logicProp" component={PropositionalLogic} />
</Router>,app)

console.log("hello reac7");
