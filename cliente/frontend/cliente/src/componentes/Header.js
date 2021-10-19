import React from 'react';


export default class Header extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
      super(props);
  }

  render() {
    return (
        <header>
        <h1>Cadastro de Clientes</h1>
        <div style={{ marginTop: '30px', marginBottom: '18px' }}>
            <button onClick={() => this.props.setEstaAdicionando(true)}>Adicionar Clientes</button>
        </div>
        </header>
		
    );
  }
};