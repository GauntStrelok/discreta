import React from "react";
import ReactDOM, {render} from "react-dom";
import MediaContainer from "./playlist/components/mediaContainer";
import data from "./json/cosas.json";

const app = document.getElementById("app");
const message = <p>Hack to do react2!!</p>;
//render(<Media title="Un titulo azul" />,app)
render(<div> <MediaContainer medias={data.things} /></div>,app)

console.log("hello react");
