import './App.css';
import React, { Component } from 'react';
import Clientes from './componentes/Clientes';
import Login from './componentes/Login'


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logado: false
    }
  }

  setLogado = valor => {
    this.setState(state => ({
      logado: valor
    }));
  }
  render() {
    return (
      <div className="App">
        {this.state.logado ? (<Clientes />) : (<Login setLogado={this.setLogado}/>)}                
      </div>
    );
  }
}
