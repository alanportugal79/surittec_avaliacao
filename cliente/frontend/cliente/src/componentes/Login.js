import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            usuario: '',
            senha: ''
        }
    }

    handleLogin = e => {
      e.preventDefault();
      axios.post('http://localhost:8080/login', {
          usuario: this.state.usuario,
          senha: this.state.senha
      }).then(res => { 
        if (res.data.erro) {
            Swal.fire({
                icon: 'error',
                title: 'Login',
                text: res.data.mensagem,
                showConfirmButton: true
            });    
        } else {
            localStorage.setItem('token', res.data.dados.token)
            this.props.setLogado(true);
        }
      });
	  
    }
      

    render() {
        return (
            <div className="small-container">
              <form onSubmit={this.handleLogin}>
                <h1>Login</h1>
                <label htmlFor="usuario">Usuário</label>
                <input
                  id="usuario"
                  type="text"
                  name="usuario"
                  placeholder="usuario"
                  value={this.state.usuario}
                  onChange={e => this.setState({usuario: e.target.value})}
                />
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type="password"
                  name="senha"
                  placeholder="senha"
                  value={this.state.senha}
                  onChange={e => this.setState({senha: e.target.value})}
                />
                <input style={{ marginTop: '12px' }} type="submit" value="Login" />
              </form>
            </div>
        );    
    }
}