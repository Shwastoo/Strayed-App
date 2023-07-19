import React, { Component } from "react";
import axios from "axios";
import "./App.css";

import {Logo} from './components/Logo/Logo';
import {Heading} from './components/Heading/Heading';
import {Footer} from './components/Footer/Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Logo variant="secondary"/><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <Heading title="STRAYED" variant="secondary"/>
        <Footer title="© Strayed_App by Jakub Szwast & Julia Politowska | 2023/2024" variant="secondary"/>
      </div>
      );
  }
}

export default App;
