import React, {Component} from "react";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import HomeLayout from "../components/home-layout";
import Accordion from "../../blocks/components/accordion";
import data from "../../json/cosas.json";

class Home extends Component {

  render() {
    return (

      <HomeLayout>
      <Link to="/">Home</Link><br/>
      <Accordion title="Discreta" >
        <Accordion title="Unidad 1">
          <Link to="/logicProp">Propositional logic</Link><br/>
          <span>Cap2</span><br/>
          <span>Cap3</span>
        </Accordion>
        <Accordion title="Unidad 2" ><span>Cap4</span></Accordion>
        <Accordion title="Unidad 3" ><span>Cap5</span></Accordion>
      </Accordion>
      <div id="master">
      </div>
      </HomeLayout>
    )
  }
}
//<MediaContainer medias={data.things} mediasText="Este es un texto dentro de mediastext" />
export default Home;
